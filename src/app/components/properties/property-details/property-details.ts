import { Component,ChangeDetectorRef, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatModal, ChatContact } from '../../shared/chat-modal/chat-modal';
import { EditPropertyModal } from '../edit-property-modal/edit-property-modal';
import { PropertyService } from '../../../services/property.service';
import { SessionService } from '../../../services/session.service';
import { PropertyDetailsResponse } from '../../../models/property-details.model';
import { Property } from '../../../models/property.model';
import { Ratings } from '../../../models/rating.model';
@Component({
  selector: 'app-property-details',
  imports: [CommonModule, ChatModal, EditPropertyModal],
  templateUrl: './property-details.html',
  styleUrl: './property-details.css',
})
export class PropertyDetails implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    public sessionService: SessionService,
    private changeDetector: ChangeDetectorRef
  ) {}

  Rating: Ratings | null = null;
  currentGalleryIndex = 0;
  isLoading = false;
  // Chat Modal
  showChatModal = false;
  chatContact?: ChatContact;

  // Image Lightbox
  showLightbox = false;

  // Edit Property Modal
  editModalOpen = false;
  editingProperty: Property | null = null;

  property: PropertyDetailsResponse | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 2;
    this.getPropertyDetails(id);
    this.getPropertyRating(id);
  }



  /* ── Edit Property ── */
  openEditModal(): void {
    if (!this.property) return;
    this.propertyService.getPropertyById(this.property.data.id).subscribe((property) => {
      this.editingProperty = property?.data ?? null;
      this.editModalOpen = this.editingProperty !== null;
    });
  }

  onEditSave(updated: Property): void {
    this.editModalOpen = false;
    this.editingProperty = null;
    this.getPropertyDetails(updated.id);
  }

  onEditCancel(): void {
    this.editModalOpen = false;
    this.editingProperty = null;
  }

  // ── Gallery ───────────────────────────────────────────────────
  get currentGalleryImage(): string {
    return this.property?.data.images[this.currentGalleryIndex] ?? '';
  }

  prevGallery() {
    if (!this.property?.data.images.length) return;
    if (this.currentGalleryIndex > 0) this.currentGalleryIndex--;
    else this.currentGalleryIndex = this.property.data.images.length - 1;
  }

  nextGallery() {
    if (!this.property?.data.images.length) return;
    if (this.currentGalleryIndex < this.property.data .images.length - 1)
      this.currentGalleryIndex++;
    else this.currentGalleryIndex = 0;
  }

  selectGalleryImage(index: number) {
    this.currentGalleryIndex = index;
  }

  goBack() {
    this.router.navigate(['/properties']);
  }

  // ── Chat / Negotiate ──────────────────────────────────────────
  openChat() {
    if (!this.property) return;
    this.chatContact = {
      propertyId: this.property.data.id,
      name: this.property.data.user.name,
      image: this.property.data.user.avatar,
      role: this.property.data.user.role,
    };
    this.showChatModal = true;
  }

  closeChat() {
    this.showChatModal = false;
    this.chatContact = undefined;
  }

  // ── Image Lightbox ────────────────────────────────────────────
  openLightbox() {
    this.showLightbox = true;
  }
   getPropertyDetails(id:number){
    this.isLoading = true;
    this.propertyService.getPropertyDetails(id).subscribe({
      next:(property)=>{
        this.isLoading = false;
        this.property = property;
      },
      error:(err)=>{
        this.isLoading = false;
        console.error('Error fetching property details:',err)
      }
    })
  }
  closeLightbox() {
    this.showLightbox = false;
  }
  returnToProperties() {
    this.router.navigate(['/properties']);
  }
  getPropertyRating(propertyId: number | undefined) {
    if (propertyId === undefined) return;

    this.propertyService.getPropertyRating(propertyId).subscribe({
      next: (ratings) => {
            if (ratings.data === null) this.Rating = null;

        this.Rating = ratings;
        this.changeDetector.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching property ratings:', err);
      }
    });
  }
  getStarFill(rate: string | undefined, starIndex: number): string {
    if (!rate) return 'none';
    const numericRate = parseFloat(rate);
    if (isNaN(numericRate)) return 'none';
    return numericRate >= starIndex ? '#ffe70d' : 'none';
  }
}
