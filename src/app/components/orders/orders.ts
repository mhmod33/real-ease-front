import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, OrderStatus } from '../../models/order.model';
import { AppModal, ModalVariant } from '../shared/app-modal/app-modal';
import { OrderService } from '../../services/order.service';
import { finalize } from 'rxjs';
type SelectableOrder = Order & { selected: boolean };

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModal],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {

  totalClients = 0;
  totalTransactions = 0;

  isLoading = true;
  isDeleting = false;
  selectAll = false;
  activeMenuId: number | null = null;

  // Confirmation / Info Modal
  modalOpen = false;
  modalVariant: ModalVariant = 'confirm';
  modalTitle = '';
  modalMessage = '';
  modalConfirmText = 'تأكيد';
  
  private pendingAction?: () => void;

  // Pagination state
  currentPage = 1;
  pageSize = 5;
  
  orders: Order[] = [];
  constructor(
    private orderService: OrderService,
    private changeDetector: ChangeDetectorRef,
  ) {}
  ngOnInit() {
    this.getAllOrders();
    this.getTotalCLientsCount();
  }
  // Computed properties
  get selectedCount(): number {
    return this.orders.filter((o) => o.selected).length;
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.pageSize) || 1;
  }

  get paginatedOrders(): SelectableOrder[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.orders.slice(startIndex, startIndex + this.pageSize);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get startIndex(): number {
    return this.orders.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.orders.length);
  }

  toggleSelectAll(): void {
    const visibleOrders = this.paginatedOrders;
    const allVisibleSelected = visibleOrders.every((o) => o.selected);
    visibleOrders.forEach((order) => (order.selected = !allVisibleSelected));
    this.checkSelectAllState();
  }

  checkSelectAllState(): void {
    const visibleOrders = this.paginatedOrders;
    this.selectAll = visibleOrders.length > 0 && visibleOrders.every((o) => o.selected);
  }

  onRowSelectChange(): void {
    this.checkSelectAllState();
  }

  // Pagination navigation
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.checkSelectAllState();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Bulk Actions
  bulkDelete(): void {
    this.openConfirm(
      'حذف الطلبات',
      `هل أنت متأكد من حذف ${this.selectedCount} طلبات مجهزة؟`,
      () => {
        this.orders = this.orders.filter((o) => !o.selected);
        this.selectAll = false;
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      }
    );
  }

  bulkChangeStatus(newStatus: OrderStatus): void {
    this.orders.forEach((o) => {
      if (o.selected) {
        o.status = newStatus;
      }
    });
  }

  clearSelection(): void {
    this.orders.forEach((o) => (o.selected = false));
    this.selectAll = false;
  }

  toggleMenu(orderId: number, event: MouseEvent): void {
    event.stopPropagation();
    this.activeMenuId = this.activeMenuId === orderId ? null : orderId;
  }

  @HostListener('document:click')
  closeMenu(): void {
    this.activeMenuId = null;
  }

  downloadData(): void {
    const selectedOrders = this.orders.filter((o) => o.selected);
    const dataToExport = selectedOrders.length > 0 ? selectedOrders : this.orders;

    const headers = [
      'رقم الطلب',
      'التاريخ',
      'اسم العميل',
      'العقار',
      'العنوان',
      'السعر',
      'الوكيل العقاري',
      'الحالة',
    ];

    const rows = dataToExport.map((o) => [
      o.order_number,
      o.created_at,
      o.client.name,
      o.property.name,
      o.property.location,
      o.property.price,
      o.owner,
      o.status,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  deleteOrder(id: number): void {
    this.openConfirm(
      'حذف الطلب',
      'هل أنت متأكد من حذف هذا الطلب؟',
      () => {
        this.isDeleting = true;
        this.orderService.deleteOrder(id).pipe(
          finalize(() => {
            this.isDeleting = false;
            this.changeDetector.markForCheck();
          })
        ).subscribe({
          next: () => {
            this.orders = this.orders.filter((o) => o.id !== id);
            this.checkSelectAllState();
            this.openInfo('تم الحذف', 'تم حذف الطلب بنجاح');
            this.changeDetector.markForCheck();
          },
          error: (err) => {
            console.error(err);
            this.openInfo('تعذر الحذف', 'لم يتم حذف الطلب. يرجى المحاولة مرة أخرى.');
            this.changeDetector.markForCheck();
          }
        });
      }
    );
    this.activeMenuId = null;
  }

  viewOrder(order: SelectableOrder): void {
    this.openInfo(
      `تفاصيل الطلب ${order.order_number}`,
      `العميل: ${order.client.name}`
    );
    this.activeMenuId = null;
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
  getAllOrders(){
    return this.orderService.getAllOrders().subscribe({
      next:(res)=>{
        this.orders = res.data.map(order => ({
          ...order,
          selected: false,
        }));
        this.isLoading = false;
        this.changeDetector.markForCheck();

      },error:(err)=>{
        console.error(err);
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }
    })
  }
  getTotalCLientsCount(){
    return this.orderService.getTotalCLientsCount().subscribe({
      next:(res)=>{
        this.totalClients = res.totalClients;
        this.totalTransactions = res.totalRevenue;
        this.changeDetector.markForCheck();
      },error:(err)=>{
        console.error(err);
        this.changeDetector.markForCheck();
      }
    })
  }
}
