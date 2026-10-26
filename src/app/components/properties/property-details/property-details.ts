import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatModal, ChatContact } from '../../shared/chat-modal/chat-modal';
import { EditPropertyModal } from '../edit-property-modal/edit-property-modal';
import { PropertyService } from '../../../services/property.service';
import { SessionService } from '../../../services/session.service';
import { Property } from '../../../models/property.model';

export interface PropertyDetail {
  id: number;
  name: string;
  city: string;
  address: string;
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
  private propertiesDb: PropertyDetail[] = [
    {
      id: 1,
      name: 'شقة البحر الأزرق',
      city: 'الدوحة',
      address: 'قطر الدوحة، شارع الخليج',
      status: 'للبيع',
      price: '$6521k',
      description:
        'شقة فاخرة بإطلالة مباشرة على البحر الأزرق، تتميز بتصميم عصري أنيق وتتوفر على ثلاث غرف نوم فسيحة وصالة واسعة وشرفة خاصة وغرفة خادمة خاصة. الشقة تطل مباشرة على الشاطئ وتتمتع بأسلوب حياة راقٍ في قلب الدوحة. موقع ممتاز قريب من المراكز التجارية والمطاعم الفاخرة.',
      mainImage: 'images/properties/image-1.png',
      galleryImages: [
        'images/properties/image-2.png',
        'images/properties/image.png',
        'images/properties/image-4.png',
      ],
      agent: {
        name: 'عز الدين المنصوري',
        title: 'وكيل عقارات',
        image: 'images/properties/imageperson.png',
        instagram: '#',
        facebook: '#',
        twitter: '#',
      },
      amenities: ['أسانسير', 'باركينج أريا', 'واي فاي مجاني', 'مكيف هواء'],
      overlayText:
        'الواجهة الإضافية للفيلا تقع في قلب المنطقة السكنية الراقية وتتميز بتصميم عصري وفاخر وحديقة خضراء واسعة وسياج خاص.',
    },
    {
      id: 2,
      name: 'فيلا النخبة باطلالة مميزة على البحر',
      city: 'الرياض',
      address: 'الأردن عمان، شارع مكة',
      status: 'للإيجار',
      price: '$15021k',
      description:
        'تقع هذه الفيلا في قلب المنطقة السكنية الراقية وتتميز بتصميم عصري رائع وتقدر بكثير الإضافة وفاخرة وحديقة خضراء واسعة. القصر تضم أربع غرف نوم على بحر خاص وقاعة متعددة الاستخدامات وحوض سباحة خاص. الفيلا مثالية للعائلات التي تبحث عن الرقي والرفاهية في آنٍ واحد.',
      mainImage: 'images/properties/image.png',
      galleryImages: [
        'images/properties/image-1.png',
        'images/properties/image-2.png',
        'images/properties/image 14.png',
      ],
      agent: {
        name: 'عز الدين المنصوري',
        title: 'وكيل عقارات',
        image: 'images/properties/imageperson.png',
        instagram: '#',
        facebook: '#',
        twitter: '#',
      },
      amenities: ['أسانسير', 'باركينج أريا', 'واي فاي مجاني', 'مكيف هواء'],
      overlayText:
        'الواجهة الإضافية للفيلا تقع في قلب المنطقة السكنية الراقية وتتميز بتصميم عصري وفاخر وحديقة خضراء خاصة.',
    },
    {
      id: 3,
      name: 'بنتهاوس النجوم',
      city: 'دبي',
      address: 'الإمارات دبي، شارع الشيخ زايد',
      status: 'للإيجار',
      price: '$15021k',
      description:
        'بنتهاوس الفخامة يقع في أعلى نقطة من برج حديث في وسط المدينة بحمامات سباحة خاصة وشرفات بانورامية رائعة. يتميز بتصميم داخلي فاخر وإضاءة ذكية مبتكرة ومواد بناء من أرقى الأنواع. البنتهاوس مثالي لمن يبحث عن الحياة في قمة الرفاهية والتميز.',
      mainImage: 'images/properties/image-2.png',
      galleryImages: [
        'images/properties/image.png',
        'images/properties/image-1.png',
        'images/properties/image-4.png',
      ],
      agent: {
        name: 'عز الدين المنصوري',
        title: 'وكيل عقارات',
        image: 'images/properties/imageperson.png',
        instagram: '#',
        facebook: '#',
        twitter: '#',
      },
      amenities: ['أسانسير', 'باركينج أريا', 'واي فاي مجاني', 'مكيف هواء'],
      overlayText:
        'بنتهاوس في قلب المدينة بإطلالات بانورامية 360 درجة على ناطحات السحاب وشواطئ دبي الذهبية.',
    },
    {
      id: 4,
      name: 'شقة الحديقة السرية',
      city: 'القاهرة',
      address: 'مصر القاهرة، التجمع الخامس',
      status: 'للبيع',
      price: '$15021k',
      description:
        'شقة أرضية مميزة تحتوي على حديقة خاصة مخصصة للتنزه والترفيه طوال اليوم وتتميز بإطلالة خضراء ورائعة على الحديقة الداخلية. تقع في موقع استراتيجي وسط القاهرة الجديدة وقريبة من مناطق الخدمات والمرافق التجارية. مساحة الشقة 320 متر مربع.',
      mainImage: 'images/properties/image-4.png',
      galleryImages: [
        'images/properties/image-2.png',
        'images/properties/image-1.png',
        'images/properties/image.png',
      ],
      agent: {
        name: 'عز الدين المنصوري',
        title: 'وكيل عقارات',
        image: 'images/properties/imageperson.png',
        instagram: '#',
        facebook: '#',
        twitter: '#',
      },
      amenities: ['أسانسير', 'باركينج أريا', 'واي فاي مجاني', 'مكيف هواء'],
      overlayText:
        'شقة أرضية فاخرة بحديقة خاصة في التجمع الخامس، محاطة بالطبيعة الخضراء والهدوء التام.',
    },
  ];

  property!: PropertyDetail;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id')) || 2;
    this.property = this.propertiesDb.find((p) => p.id === id) ?? this.propertiesDb[1];
    this.syncFromPropertyService();
  }

  /** Overlay the locally-mocked display data with the live, editable Property record. */
  private syncFromPropertyService(): void {
    const live = this.propertyService.getPropertyById(this.property.id);
    if (!live) return;
    this.property = {
      ...this.property,
      name: live.name,
      city: live.city,
      status: live.status,
      price: live.price,
      description: live.description,
      mainImage: live.image,
    };
  }

  /* ── Edit Property ── */
  openEditModal(): void {
    this.editingProperty = this.propertyService.getPropertyById(this.property.id) ?? null;
    if (this.editingProperty) {
      this.editModalOpen = true;
    }
  }

  onEditSave(updated: Property): void {
    this.propertyService.updateProperty(updated.id, updated);
    this.syncFromPropertyService();
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

  closeLightbox() {
    this.showLightbox = false;
  }
}
