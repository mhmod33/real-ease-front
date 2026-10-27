import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth-service';
import { MessageHistoryEntry } from '../../../models/message.model';
import { finalize } from 'rxjs';

export interface ChatContact {
  id?: number | string;
  propertyId?: number;
  name: string;
  image: string;
  role?: string;
  phone?: string;
}

export interface ChatMessage {
  id: number | string;
  message: string;
  created_at: string;
  isMe: boolean;
}

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-modal.html',
  styleUrl: './chat-modal.css',
})
export class ChatModal implements OnChanges {
  @Input() open = false;
  @Input() contact?: ChatContact;

  @Output() closed = new EventEmitter<void>();

  newMessage = '';
  messageHistory: ChatMessage[] = [];
  isLoading = false;
  isSending = false;
  historyError = '';
  sendError = '';
  private historyRequestId = 0;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['open'] || changes['contact']) && this.open) {
      this.newMessage = '';
      this.sendError = '';
      this.getUserHistory();
    }
  }

  close(): void {
    this.open = false;
    this.historyRequestId++;
    this.isLoading = false;
    this.newMessage = '';
    this.closed.emit();
  }

  getUserHistory(): void {
    const receiverId = this.receiverId;
    const requestId = ++this.historyRequestId;
    this.historyError = '';
    if (receiverId === null) {
      this.messageHistory = [];
      this.isLoading = false;
      this.historyError = 'تعذر تحديد المستخدم لعرض المحادثة';
      this.changeDetector.markForCheck();
      return;
    }

    this.isLoading = true;
    this.messageService.getMessageHistory(receiverId).pipe(
      finalize(() => {
        if (requestId === this.historyRequestId) {
          this.isLoading = false;
          this.changeDetector.markForCheck();
        }
      })
    ).subscribe({
      next: (response) => {
        if (requestId !== this.historyRequestId) {
          return;
        }
        if (!Array.isArray(response.data)) {
          this.messageHistory = [];
          this.historyError = 'تعذر تحميل الرسائل';
          this.changeDetector.markForCheck();
          return;
        }
        const currentUserId = this.authService.currentUser()?.id;
        this.messageHistory = response.data.map((message) => this.toChatMessage(
          message,
          currentUserId !== undefined && message.sender_id === currentUserId
        ));
        this.changeDetector.markForCheck();
      },
      error: () => {
        if (requestId === this.historyRequestId) {
          this.historyError = 'تعذر تحميل الرسائل';
          this.changeDetector.markForCheck();
        }
      },
    });
  }
  geCurrentUserId(): number | null {
    const currentUser = this.authService.currentUser();
    return currentUser?.id ?? null;
  }
  send(): void {
    const text = this.newMessage.trim();
    const receiverId = this.receiverId;
    const currentUserId = this.geCurrentUserId();
    if(receiverId === currentUserId) {
      this.sendError = 'لا يمكنك إرسال رسالة لنفسك';
      this.changeDetector.markForCheck();
      return;
    }
    if (!text || this.isSending) {
      return;
    }
    if (receiverId === null) {
      this.sendError = 'تعذر تحديد المستخدم لإرسال الرسالة';
      this.changeDetector.markForCheck();
      return;
    }

    this.sendError = '';
    this.isSending = true;
    this.messageService.sendMessage(text, receiverId, this.contact?.propertyId).subscribe({
      next: (response) => {
        const sentMessage = response.data;
        const receiverId = this.receiverId;
        const displayedMessage = sentMessage
          && Number.isSafeInteger(sentMessage.id)
          && typeof sentMessage.message === 'string'
          && typeof sentMessage.created_at === 'string'
          ? this.toChatMessage(sentMessage, true)
          : {
              id: `local-${Date.now()}`,
              message: text,
              created_at: new Date().toISOString(),
              isMe: true,
            };
        this.messageHistory = [
          ...this.messageHistory,
          displayedMessage,
        ];
        this.newMessage = '';
        this.isSending = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.isSending = false;
        this.sendError = 'تعذر إرسال الرسالة. حاول مرة أخرى';
        this.changeDetector.markForCheck();
      }
    });
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  dateFormat(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  private get receiverId(): number | null {
    const id = Number(this.contact?.id);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  }

  private toChatMessage(message: MessageHistoryEntry, isMe: boolean): ChatMessage {
    return {
      id: message.id,
      message: message.message,
      created_at: message.created_at,
      isMe,
    };
  }
}
