import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';
import { SessionService } from '../../../services/session.service';

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

  conversationList: Conversation[] = [
    {
      id: 'conv-1',
      name: 'أحمد الصالح',
      initials: 'أ',
      avatarColor: '#3b82f6',
      lastMessage: 'نعم، أريد معاينة العقار يوم السبت',
      lastTime: '10:35 ص',
      unread: true,
      status: 'online',
      totalMessages: 8,
      messages: [
        {
          id: '1',
          sender: 'أحمد الصالح',
          avatar: 'أ',
          message: 'مرحبا! هل العقار لا يزال متاحاً؟',
          time: '10:30 ص',
          isMe: false,
          unread: true,
        },
        {
          id: '2',
          sender: 'أنت',
          avatar: 'م',
          message: 'نعم، العقار متاح. هل تريد موعد للمعاينة؟',
          time: '10:32 ص',
          isMe: true,
          unread: false,
        },
        {
          id: '3',
          sender: 'أحمد الصالح',
          avatar: 'أ',
          message: 'نعم، أريد معاينة العقار يوم السبت',
          time: '10:35 ص',
          isMe: false,
          unread: true,
        },
      ]
    },
    {
      id: 'conv-2',
      name: 'محمد علي',
      initials: 'م',
      avatarColor: '#10b981',
      lastMessage: 'ما هو السعر النهائي للشقة؟',
      lastTime: '11:10 ص',
      unread: true,
      status: 'offline',
      totalMessages: 12,
      messages: [
        {
          id: '4',
          sender: 'محمد علي',
          avatar: 'م',
          message: 'السلام عليكم، ما هو السعر النهائي للشقة؟',
          time: '11:10 ص',
          isMe: false,
          unread: true,
        },
      ]
    },
    {
      id: 'conv-3',
      name: 'فاطمة السويدي',
      initials: 'ف',
      avatarColor: '#f59e0b',
      lastMessage: 'شكراً على المعلومات الإضافية',
      lastTime: 'أمس 3:45 م',
      unread: false,
      status: 'online',
      totalMessages: 15,
      messages: []
    },
    {
      id: 'conv-4',
      name: 'سارة الخليل',
      initials: 'س',
      avatarColor: '#ec4899',
      lastMessage: 'هل يمكن تأجيل الاجتماع؟',
      lastTime: 'أمس 1:20 م',
      unread: false,
      status: 'offline',
      totalMessages: 6,
      messages: []
    },
  ];

  chatConversations: ChatMessage[] = [];

  get unreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  get unreadMessagesCount(): number {
    return this.conversationList.filter((c) => c.unread).length;
  }

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
    if (this.showChat) this.showNotifications = false;
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
    
    // Update conversation in list
    const convIndex = this.conversationList.findIndex(c => c.id === this.activeConv?.id);
    if (convIndex !== -1) {
      this.conversationList[convIndex].lastMessage = this.newMessage.trim();
      this.conversationList[convIndex].lastTime = newMsg.time;
    }
    
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
}
