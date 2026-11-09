import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormsModule } from '@angular/forms';
import { ChatModal, ChatContact } from '../shared/chat-modal/chat-modal';
import { AppModal } from '../shared/app-modal/app-modal';
import { EditPropertyModal } from './edit-property-modal/edit-property-modal';
import { SessionService } from '../../services/session.service';
import { PropertyFilters, PropertyService } from '../../services/property.service';
import { Properties as PropertiesResponse, Property } from '../../models/property.model';
import { ChangeDetectorRef } from '@angular/core';
import { EditPropertyStatusModal } from '../../components/properties/edit-property-status-modal/edit-property-status-modal';
export type { Property };

@Component({
  selector: 'app-properties',
  imports: [CommonModule, FormsModule, ChatModal, AppModal, EditPropertyModal,EditPropertyStatusModal],
  templateUrl: './properties.html',
  styleUrl: './properties.css',
})
export class Properties {
  private activeFilters: PropertyFilters = {};

  constructor(
    private router: Router,
    public sessionService: SessionService,
    private propertyService: PropertyService,
    private changeDetector: ChangeDetectorRef,

  ) {
    this.loadProperties();
  }

  // Chat Modal
  showChatModal = false;
  chatContact?: ChatContact;

  // Delete Confirmation Modal (admin)
  deleteModalOpen = false;
  deleteModalMessage = '';
  private pendingDeleteId?: number;

  // Edit Property Modal (admin)
  editModalOpen = false;
  editingProperty: Property | null = null;

  editStatusModalOpen = false;
  // ── Filter state ─────────────────────────────────────────────
  searchKeyword = '';
  selectedType = '';
  selectedLocation = '';
  sliderMax = 1000;
  priceMin = 16;
  priceMax = 150;

  propertyTypes = ['apartment', 'house', 'condo', 'land', 'commercial', 'other'];
  locations = ['الدوحة', 'الرياض', 'دبي', 'القاهرة', 'عمان', 'الكويت'];

  get trackBackground(): string {
    const minPct = (this.priceMin / this.sliderMax) * 100;
    const maxPct = (this.priceMax / this.sliderMax) * 100;
    return (
      `linear-gradient(to right,` +
      ` #f6a65b ${minPct}%,` +
      ` #003366 ${minPct}%,` +
      ` #003366 ${maxPct}%,` +
      ` #f6a65b ${maxPct}%)`
    );
  }
  // ── Data (from PropertyService) ───────────────────────────────
  propertiesResponse: PropertiesResponse | null = null;
  isLoading = false;
  loadError = false;

  get currentPage(): number {
    return this.propertiesResponse?.pagination.current_page ?? 1;
  }

  get totalPages(): number {
    const pagination = this.propertiesResponse?.pagination;
    return pagination && pagination.per_page > 0
      ? Math.ceil(pagination.total / pagination.per_page)
      : 0;
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  // ── Actions ───────────────────────────────────────────────────
  goToPage(page: number): void {
    this.loadProperties(page);
  }

  onSearch() {
    const filters: PropertyFilters = {};
    const search = this.searchKeyword.trim();

    if (this.selectedType) filters.type = this.selectedType;
    if (this.selectedLocation) filters.location = this.selectedLocation;
    if (search) filters.search = search;
    if (this.priceMin !== 16 || this.priceMax !== 150) {
      filters.min_price = this.priceMin;
      filters.max_price = this.priceMax;
    }

    this.activeFilters = filters;
    this.loadProperties();
  }

  private loadProperties(page = 1) {
    this.isLoading = true;
    this.loadError = false;
    this.propertyService.getProperties({ ...this.activeFilters, page }).subscribe({
      next: (res) => {
        this.propertiesResponse = res;
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching properties:', err);
        this.loadError = true;
        this.isLoading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  toggleSave(p: Property, e: Event) {
    e.stopPropagation();
    p.isSaved = !p.isSaved;
  }

  toggleLike(p: Property, e: Event) {
    e.stopPropagation();
    p.isLiked = !p.isLiked;
  }

  goToDetails(id: number) {
    this.router.navigate(['/properties', id]);
  }
  editStatus(p:Property) {
    console.log('editStatus called');
    this.editStatusModalOpen=true;
    this.editingProperty = p;
  }

  /* ── Admin: Edit Property ── */
  editProperty(p: Property, e: Event) {
    e.stopPropagation();
    this.editingProperty = p;
    this.editModalOpen = true;
  }

  onEditSave(updated: Property) {
    const property = this.propertiesResponse?.data.find((item) => item.id === updated.id);
    if (property) Object.assign(property, updated);
    this.editModalOpen = false;
    this.editStatusModalOpen=false;
    this.editingProperty = null;
  }

  onEditCancel() {
    this.editModalOpen = false;
    this.editingProperty = null;
  }


  confirmDeleteProperty() {
    this.deleteModalOpen = false;
    const propertyId = this.pendingDeleteId;
    this.pendingDeleteId = undefined;
    if (propertyId === undefined) return;

    this.propertyService.deleteProperty(propertyId).subscribe({
      next: () => {
        if (this.propertiesResponse) {
          this.propertiesResponse = {
            ...this.propertiesResponse,
            data: this.propertiesResponse.data.filter(
              (property) => property.id !== propertyId
            ),
            pagination: {
              ...this.propertiesResponse.pagination,
              total: Math.max(0, this.propertiesResponse.pagination.total - 1),
            },
          };
        }
        this.changeDetector.markForCheck();
        // this.loadProperties();

      },
      error: (err) => {
        console.error('Error deleting property:', err);
      },
    });
  }

  deleteProperty(property: Property, event: Event) {
    event.stopPropagation();
    this.pendingDeleteId = property.id;
    this.deleteModalMessage = `هل أنت متأكد من حذف العقار "${property.name}"؟`;
    this.deleteModalOpen = true;
  }

  cancelDeleteProperty() {
    this.deleteModalOpen = false;
    this.pendingDeleteId = undefined;
  }

  /* ── Chat / Negotiate ── */
  openChat(p: Property, e: Event) {
    e.stopPropagation();
    this.chatContact = {
      propertyId: p.id,
      name: p.user?.name ?? 'صاحب العقار',
      image: p.image,
      role: p.user?.role ?? '',
    };
    this.showChatModal = true;
  }

  closeChat() {
    this.showChatModal = false;
    this.chatContact = undefined;
  }

  goToCreate() {
    this.router.navigate(['/properties/create']);
  }

  onPriceMinChange(value: string) {
    this.priceMin = +value;
    if (this.priceMin > this.priceMax) this.priceMax = this.priceMin;
  }

  onPriceMaxChange(value: string) {
    this.priceMax = +value;
    if (this.priceMax < this.priceMin) this.priceMin = this.priceMax;
  }

  clearFilters() {
    this.searchKeyword = '';
    this.selectedType = '';
    this.selectedLocation = '';
    this.priceMin = 16;
    this.priceMax = 150;
    this.activeFilters = {};
    this.loadProperties();
  }
}
