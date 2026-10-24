import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';

export interface ChatContact {
  id?:number;
  name: string;
  image: string;
  role?: string;
  phone?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isMe: boolean;
  time: string;
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
  history: ChatMessage[] = [];
  constructor(private messageService:MessageService){}
  ngOnChanges(changes: SimpleChanges): void {
    // Seed a fresh conversation each time the modal is opened for a contact.
    if (changes['open'] && this.open) {
      console.log(this.contact);
      this.seedHistory();
      this.newMessage = '';
    }
  }

  private seedHistory(): void {
    this.history = [
      { id: '1', text: 'السلام عليكم! كيف يمكنني مساعدتك؟', isMe: false, time: '10:00 ص' },
      { id: '2', text: 'أريد الاستفسار عن عقار', isMe: true, time: '10:02 ص' },
      { id: '3', text: 'بكل سرور، أنا في خدمتك', isMe: false, time: '10:04 ص' },
    ];
  }

  close(): void {
    this.open = false;
    this.newMessage = '';
    this.closed.emit();
  }

  send(): void {
    const text = this.newMessage.trim();
    const receiverId = this.contact?.id;
    if (!text ) {
      console.log("No text provided for sending message");
      return;
    }else if(!receiverId){
      console.log("No receiverId provided for sending message",receiverId);
      return;
    }
    console.log("Sending message",text,receiverId)
    this.messageService.sendMessage(text, receiverId).subscribe({
      next:(res)=>{
        console.log("Message sent",text,receiverId)
        console.log('Message sent successfully:', res);
      },
      error:(err)=>{
        console.log('error sending message:',err)
      }
    })
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private now(): string {
    return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  }
}
