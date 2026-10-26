import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatModal, ChatContact } from '../shared/chat-modal/chat-modal';
import { AppModal } from '../shared/app-modal/app-modal';
import { EditPropertyModal } from './edit-property-modal/edit-property-modal';
import { SessionService } from '../../services/session.service';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

export type { Property };

@Component({
  selector: 'app-properties',
  imports: [CommonModule, FormsModule, ChatModal, AppModal, EditPropertyModal],
  templateUrl: './properties.html',
  styleUrl: './properties.css',
})
export class Properties {
  constructor(
    private router: Router,
    public sessionService: SessionService,
    private propertyService: PropertyService
  ) {}

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

  // ── Filter state ─────────────────────────────────────────────
  searchKeyword = '';
  selectedType = '';
  selectedLocation = '';
  sliderMax = 1000;
  priceMin = 16;
  priceMax = 150;

  propertyTypes = ['شقة', 'فيلا', 'بنتهاوس', 'مكتب', 'أرض'];
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
  get allProperties(): Property[] {
    return this.propertyService.getProperties();
  }

  // ── Computed filtered list ─────────────────────────────────────
  get filteredProperties(): Property[] {
    return this.allProperties.filter((p) => {
      const matchKeyword =
        !this.searchKeyword ||
        p.name.includes(this.searchKeyword) ||
        p.description.includes(this.searchKeyword);
      const matchType = !this.selectedType || p.type === this.selectedType;
      const matchLocation =
        !this.selectedLocation || p.city === this.selectedLocation;
      const isDefaultPrice = this.priceMin === 16 && this.priceMax === 150;
      const matchPrice =
        isDefaultPrice ||
        (p.priceNum >= this.priceMin && p.priceNum <= this.priceMax);
      return matchKeyword && matchType && matchLocation && matchPrice;
    });
  }

  // ── Actions ───────────────────────────────────────────────────
  onSearch() {
    // Trigger re-render (already reactive via getter)
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

  /* ── Admin: Edit Property ── */
  editProperty(p: Property, e: Event) {
    e.stopPropagation();
    this.editingProperty = p;
    this.editModalOpen = true;
  }

  onEditSave(updated: Property) {
    this.propertyService.updateProperty(updated.id, updated);
    this.editModalOpen = false;
    this.editingProperty = null;
  }

  onEditCancel() {
    this.editModalOpen = false;
    this.editingProperty = null;
  }

  /* ── Admin: Delete Property ── */
  deleteProperty(p: Property, e: Event) {
    e.stopPropagation();
    this.pendingDeleteId = p.id;
    this.deleteModalMessage = `هل أنت متأكد من حذف العقار "${p.name}"؟`;
    this.deleteModalOpen = true;
  }

  confirmDeleteProperty() {
    this.deleteModalOpen = false;
    if (this.pendingDeleteId !== undefined) {
      this.propertyService.deleteProperty(this.pendingDeleteId);
      this.pendingDeleteId = undefined;
    }
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
      name: p.agentName,
      image: p.agentImage,
      role: 'وكيل عقارات',
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
  }
}
