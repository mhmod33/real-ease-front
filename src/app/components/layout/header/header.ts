import { Component, inject, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { SessionService } from '../../../services/session.service';
import { Message } from '../../../models/message.model';
import { MessageService } from '../../../services/message.service';

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  time: string;
  isMe: boolean;
  unread: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages?: ChatMessage[];
  status?: 'online' | 'offline';
  totalMessages?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly sidebarService = inject(SidebarService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  readonly userName = 'مصطفى';
  readonly userRole = 'صاحب عقارات';

  goToProfile(): void {
    this.router.navigate(['/user/profile']);
  }

  showNotifications = false;
  showChat = false;
  showChatModal = false;
  newMessage = '';
  activeConv: Conversation | null = null;
  messages: Message[] = [];
  chatConversations: ChatMessage[] = [];
  isLoadingMessages = false;
  loadingMessageId: number | null = null;
  messagesError = '';
  unreadMessagesCount = 0;
  constructor(
    private messageService:MessageService
  ){}
  ngOnInit(): void {
    this.getAllMessages();
  }
  notifications: Notification[] = [
    {
      id: '1',
      title: 'طلب جديد',
      message: 'لديك طلب مشاهدة عقار جديد من أحمد الصالح',
      time: 'منذ 5 دقائق',
      icon: 'order',
      read: false,
    },
    {
      id: '2',
      title: 'تعليق جديد',
      message: 'قام محمد علي بتعليق على عقارك في دبي',
      time: 'منذ 20 دقيقة',
      icon: 'comment',
      read: false,
    },
    {
      id: '3',
      title: 'اتفاقية تمت',
      message: 'تم الاتفاق على عقار بنتهاوس راقٍ بنجاح',
      time: 'منذ ساعة',
      icon: 'deal',
      read: false,
    },
    {
      id: '4',
      title: 'تحديث السعر',
      message: 'تم تحديث سعر فيلا النخبة المميزة',
      time: 'منذ 3 ساعات',
      icon: 'price',
      read: true,
    },
  ];

  get unreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }
  getUnreadMessagesCount(): number {
    return this.unreadMessagesCount = this.messages.filter((m) => !m.read_at).length;
  }
  
  getAllMessages(){
    this.isLoadingMessages = true;
    this.messagesError = '';
    this.messageService.getALlMessages().subscribe({
      next:(res)=>{
        this.messages = res.data;
        this.isLoadingMessages = false;
        this.changeDetector.detectChanges();
      },
      error:()=>{
        this.isLoadingMessages = false;
        this.messagesError = 'تعذر تحميل الرسائل';
        this.changeDetector.detectChanges();
      },
    })
  };
  selectConversation(conv: Conversation): void {
    this.activeConv = conv;
    this.chatConversations = conv.messages || [];
    this.showChatModal = true;
  }

  closeChatModal(): void {
    this.showChatModal = false;
    this.activeConv = null;
    this.chatConversations = [];
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) this.showChat = false;
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
    if (this.showChat) {
      this.showNotifications = false;
      this.getAllMessages();
    }
  }

  dismissNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  clearAllNotifications(): void {
    this.notifications = [];
  }

  markAllNotificationsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.activeConv) return;
    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'أنت',
      avatar: 'م',
      message: this.newMessage.trim(),
      time: new Date().toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMe: true,
      unread: false,
    };
    this.chatConversations.push(newMsg);
  
    
    this.newMessage = '';
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.header__icon-wrapper') && this.showNotifications) {
      this.showNotifications = false;
    }
    if (!target.closest('.header__icon-wrapper') && this.showChat) {
      this.showChat = false;
    }
  }

  closeNotifications(): void {
    this.showNotifications = false;
  }

  closeChat(): void {
    this.showChat = false;
  }
  markAsRead(messageId: number){
    if (this.loadingMessageId !== null) return;
    const message = this.messages.find(m => m.id === messageId);
    if (!message || message.read_at) return;

    this.loadingMessageId = messageId;
    this.messageService.markMessageAsRead(messageId).subscribe({
      next:()=>{
        this.loadingMessageId = null;
        message.read_at = new Date().toString();
        this.changeDetector.detectChanges();
      },error:()=>{        
        this.loadingMessageId = null;
        console.error('Failed to mark message as read');
        this.changeDetector.detectChanges();
      }
    });
  }
  openChatModal(m:any){}
}
