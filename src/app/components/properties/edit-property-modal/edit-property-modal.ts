import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,FormGroup,ReactiveFormsModule, FormBuilder,Validators } from '@angular/forms';
import { Property } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-edit-property-modal',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './edit-property-modal.html',
  styleUrl: './edit-property-modal.css',
})
export class EditPropertyModal implements OnChanges {
  @Input() open = false;
  @Input() property: Property | null = null;

  @Output() save = new EventEmitter<Property>();
  @Output() cancel = new EventEmitter<void>();

  isSaving = false;
  saveError: string | null = null;

  propertyTypes = ['apartment', 'house', 'condo', 'land', 'commercial', 'other'];
  propertyStatuses: Array<'available' | 'sold' | 'pending' | 'rented'> = ['available', 'sold', 'pending', 'rented'];
  propertycontractType: Array<'sale' | 'rent'> = ['sale', 'rent'];
  editForm!:FormGroup


  constructor(
    private fb:FormBuilder,
    private propertyService: PropertyService,
  ){
    this.editForm=this.fb.group({
      name:['',[Validators.required, Validators.minLength(2)]],
      price:[''],
      location:[''],
      contract_type:[''],
      type:[''],
      status:[''],
      description:[''],
      image:[''],
      features:[['']],
      images:[['']],
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && this.property) {
      this.editForm.patchValue(this.property);
    }
  }
  onSave(): void {
    if (!this.property || this.editForm.invalid || this.isSaving) return;
    const updated: Property = {
      ...this.property,
      ...this.editForm.value
    };
    this.isSaving = true;
    this.saveError = null;
    this.propertyService.updateProperty(updated.id, updated).subscribe({
      next: () => {
        this.isSaving = false;
        this.save.emit(updated);
      },
      error: () => {
        this.isSaving = false;
        this.saveError = 'تعذر حفظ التعديلات. يرجى المحاولة مرة أخرى.';
      },
    });
  }

  onCancel(): void {
    if (this.isSaving) return;
    this.cancel.emit();
  }
}
