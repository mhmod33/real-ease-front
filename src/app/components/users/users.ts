import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Users as users, User,Data } from '../../models/user.model';
import { AppModal, ModalVariant } from '../shared/app-modal/app-modal';
import { ChatModal, ChatContact } from '../shared/chat-modal/chat-modal';
import { Signal } from '@angular/core';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModal, ChatModal],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  selectedIds = new Set<string>();

  // Chat Modal
  showChatModal = false;
  chatContact?: ChatContact;
  users=signal<Data[]|undefined>(undefined);
  // Confirmation / Info Modal
  modalOpen = false;
  modalVariant: ModalVariant = 'confirm';
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = 'تأكيد';
  private pendingAction?: () => void;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(){
    this.userService.getAllUsers().subscribe({
      next:(res)=>{
        console.log(res);
        this.users.set(res?.data);        
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }

  /* ── Selection ── */
  toggleSelect(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  // selectAll(): void {
  //   if (this.selectedIds.size === this.users.length) {
  //     this.selectedIds.clear();
  //   } else {
  //     this.users.forEach((u) => this.selectedIds.add(u.id));
  //   }
  // }

  get allSelected(): boolean {
    return this.users.length > 0 && this.selectedIds.size === this.users.length;
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  /* ── Navigation ── */
  goToCreate(): void {
    this.router.navigate(['/users/create']);
  }

  goToDetails(id: string): void {
    this.router.navigate(['/users', id]);
  }

  /* ── Delete ── */
  deleteUser(user: User, event: MouseEvent): void {
    event.stopPropagation();
    this.openConfirm(
      'حذف المستخدم',
      `هل أنت متأكد من حذف المستخدم "${user.name}"؟`,
      () => {
        this.selectedIds.delete(String(user.id));
      }
    );
  }

  bulkDelete(): void {
    if (this.selectedIds.size === 0) {
      this.openInfo('تنبيه', 'الرجاء تحديد مستخدم واحد على الأقل للحذف');
      return;
    }
    this.openConfirm(
      'حذف المستخدمين',
      `هل أنت متأكد من حذف ${this.selectedIds.size} مستخدم؟`,
      () => {
        const ids = [...this.selectedIds];
        
      }
    );
  }

  /* ── Confirmation / Info Modal ── */
  private openConfirm(title: string, message: string, action: () => void): void {
    this.modalVariant = 'danger';
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalConfirmText = 'تأكيد';
    this.pendingAction = action;
    this.modalOpen = true;
  }

  private openInfo(title: string, message: string): void {
    this.modalVariant = 'info';
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalConfirmText = 'حسناً';
    this.pendingAction = undefined;
    this.modalOpen = true;
  }

  onModalConfirm(): void {
    this.modalOpen = false;
    const action = this.pendingAction;
    this.pendingAction = undefined;
    action?.();
  }

  onModalCancel(): void {
    this.modalOpen = false;
    this.pendingAction = undefined;
  }

  /* ── Chat Modal ── */
  openChat(user: User, event: MouseEvent): void {
    event.stopPropagation();
    this.chatContact = {
      name: user.name,
      image: user.avatar,
      role: user.type,
    };
    this.showChatModal = true;
  }

  closeChat(): void {
    this.showChatModal = false;
    this.chatContact = undefined;
  }
}
