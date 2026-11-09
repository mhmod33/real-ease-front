import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,FormGroup,ReactiveFormsModule, FormBuilder,Validators } from '@angular/forms';
import { Property } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-edit-property-status-modal',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './edit-property-status-modal.html',
  styleUrl: './edit-property-status-modal.css',
})
export class EditPropertyStatusModal implements OnChanges {
  @Input() editStatusModalOpen = false;
  @Input() property: Property | null = null;

  @Output() save = new EventEmitter<Property>();
  @Output() cancel = new EventEmitter<void>();

  isSaving = false;
  saveError: string | null = null;

  propertyStatuses: Array<'available' | 'sold' | 'pending' | 'rented'> = ['available', 'sold', 'pending', 'rented'];
  editstatusForm!:FormGroup


  constructor(
    private fb:FormBuilder,
    private propertyService: PropertyService,
  ){
    this.editstatusForm=this.fb.group({
      status:[''],
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['property'] && this.property) {
      this.editstatusForm.patchValue(this.property);
    }
  }
  onSave(): void {
    if (!this.property || this.editstatusForm.invalid || this.isSaving) return;
    const updated: Property = {
      ...this.property,
      ...this.editstatusForm.value
    };
    this.isSaving = true;
    this.saveError = null;
    this.propertyService.editPropertyStatus(updated.id, updated.status).subscribe({
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
