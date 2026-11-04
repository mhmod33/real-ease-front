import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatModal, ChatContact } from '../../shared/chat-modal/chat-modal';
import { EditPropertyModal } from '../edit-property-modal/edit-property-modal';
import { PropertyService } from '../../../services/property.service';
import { SessionService } from '../../../services/session.service';
import { Property,Properties } from '../../../models/property.model';

export interface PropertyDetail {
  id: number;
  name: string;
  city: string;
  location: string;
  status: 'للبيع' | 'للإيجار';
  price: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  agent: {
    name: string;
    title: string;
    image: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
  amenities: string[];
  overlayText: string;
}

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
    public sessionService: SessionService
  ) {}

  currentGalleryIndex = 0;

  // Chat Modal
  showChatModal = false;
  chatContact?: ChatContact;

  // Image Lightbox
  showLightbox = false;

  // Edit Property Modal
  editModalOpen = false;
  editingProperty: Property | null = null;

  // ── Mock Properties Database ──────────────────────────────────
  private propertiesDb: PropertyDetail[] = [];

  property!: PropertyDetail;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 2;
    this.getPropertyDetails(id);
    this.property = this.propertiesDb.find((p) => p.id === id) ?? this.propertiesDb[1];
  }



  /* ── Edit Property ── */
  openEditModal(): void {
    this.propertyService.getPropertyById(this.property.id).subscribe((property) => {
      this.editingProperty = property ?? null;
      this.editModalOpen = this.editingProperty !== null;
    });
  }

  onEditSave(updated: Property): void {
    this.propertyService.updateProperty(updated.id, updated);
    this.editModalOpen = false;
    this.editingProperty = null;
  }

  onEditCancel(): void {
    this.editModalOpen = false;
    this.editingProperty = null;
  }

  // ── Gallery ───────────────────────────────────────────────────
  get currentGalleryImage(): string {
    return this.property?.galleryImages[this.currentGalleryIndex] ?? '';
  }

  prevGallery() {
    if (this.currentGalleryIndex > 0) this.currentGalleryIndex--;
    else this.currentGalleryIndex = this.property.galleryImages.length - 1;
  }

  nextGallery() {
    if (this.currentGalleryIndex < this.property.galleryImages.length - 1)
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
    this.chatContact = {
      propertyId: this.property.id,
      name: this.property.agent.name,
      image: this.property.agent.image,
      role: this.property.agent.title,
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
    this.propertyService.getPropertyDetails(id).subscribe({
      next:(property)=>{
        console.log('Property details:',property)
      },
      error:(err)=>{
        console.error('Error fetching property details:',err)
      }
    })
  }
  closeLightbox() {
    this.showLightbox = false;
  }
}
