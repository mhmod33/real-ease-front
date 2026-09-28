import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, UserProperty } from '../../../models/user.model';
import { AppModal, ModalVariant } from '../../shared/app-modal/app-modal';
import { EditUserPropertyModal } from '../../shared/edit-user-property-modal/edit-user-property-modal';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, AppModal, EditUserPropertyModal],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit {
  user?: User;

  // Carousel index for properties
  carouselIndex = 0;

  // Edit Property Modal
  editModalOpen = false;
  editingProperty: UserProperty | null = null;

  // Confirmation / Info Modal
  modalOpen = false;
  modalVariant: ModalVariant = 'confirm';
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = 'تأكيد';
  private pendingAction?: () => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/notfound']);
      return;
    }

    this.userService.getUserById(id).subscribe({
      next: (user) => this.user = user,
      error: () => this.router.navigate(['/notfound']),
    });
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  goToAddProperty(): void {
    this.router.navigate(['/properties/create']);
  }

  prevProperty(): void {
    if (!this.user?.properties || this.user.properties.length === 0) return;
    this.carouselIndex =
      (this.carouselIndex - 1 + this.user.properties.length) % this.user.properties.length;
  }

  nextProperty(): void {
    if (!this.user?.properties || this.user.properties.length === 0) return;
    this.carouselIndex = (this.carouselIndex + 1) % this.user.properties.length;
  }

  deleteProperty(property: UserProperty, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.user?.properties) return;
    this.openConfirm(
      'حذف العقار',
      `هل أنت متأكد من حذف العقار "${property.title}"؟`,
      () => {
        if (this.user?.properties) {
          this.user.properties = this.user.properties.filter((p) => p.id !== property.id);
        }
      }
    );
  }

  shareProperty(property: UserProperty, event: MouseEvent): void {
    event.stopPropagation();
    this.openInfo('مشاركة العقار', `مشاركة العقار: ${property.title}`);
  }

  startEditProperty(property: UserProperty, event: MouseEvent): void {
    event.stopPropagation();
    this.editingProperty = property;
    this.editModalOpen = true;
  }

  onEditSave(updated: UserProperty): void {
    if (this.user?.properties) {
      this.user.properties = this.user.properties.map((property) =>
        property.id === updated.id ? updated : property
      );
    }
    this.editModalOpen = false;
    this.editingProperty = null;
  }

  onEditCancel(): void {
    this.editModalOpen = false;
    this.editingProperty = null;
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
}
