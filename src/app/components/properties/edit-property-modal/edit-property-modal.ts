import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property } from '../../../models/property.model';

@Component({
  selector: 'app-edit-property-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-property-modal.html',
  styleUrl: './edit-property-modal.css',
})
export class EditPropertyModal implements OnChanges {
  @Input() open = false;
  @Input() property: Property | null = null;

  @Output() save = new EventEmitter<Property>();
  @Output() cancel = new EventEmitter<void>();

  propertyTypes = ['شقة', 'فيلا', 'بنتهاوس', 'مكتب', 'أرض', 'مستودع'];
  propertyStatuses: Array<'available' | 'sold' | 'pending' | 'rented'> = ['available', 'sold', 'pending', 'rented'];

  draft = {
    name: '',
    type: '',
    status: 'available' as 'available' | 'sold' | 'pending' | 'rented',
    priceNum: 0,
    city: '',
    description: '',
    image: '',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open && this.property) {
      this.draft = {
        name: this.property.name,
        type: this.property.type,
        status: this.property.status,
        priceNum: this.property.price ? parseFloat(this.property.price.toString()) : 0,
        city: this.property.location,
        description: this.property.description,
        image: this.property.image,
      };
    }
  }

  onSave(): void {
    if (!this.property) return;
    const updated: Property = {
      ...this.property,
      name: this.draft.name,
      type: this.draft.type,
      status: this.draft.status,
      location: this.draft.city,
      description: this.draft.description,
      image: this.draft.image,
    };
    this.save.emit(updated);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
