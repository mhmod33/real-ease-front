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

  propertyTypes = ['شقة', 'فيلا', 'بنتهاوس', 'مكتب', 'أرض', 'مستودع'];
  propertyStatuses: Array<'available' | 'sold' | 'pending' | 'rented'> = ['available', 'sold', 'pending', 'rented'];
  propertycontractType: Array<'sale' | 'rent'> = ['sale', 'rent'];
  editForm!:FormGroup


  constructor(
    private propertyService:PropertyService,
    private fb:FormBuilder
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
  }


  onSave(): void {
    if (!this.property) return;
    const updated: Property = {
      ...this.editForm.value
    };
    const propertyId=this.property.id
    this.propertyService.updateProperty(propertyId,updated).subscribe({
      next:(res)=>{
        this.editForm.patchValue({
        name:res?.data.name,
        contract_type:res?.data.contract_type,
        price:res?.data.price,
        status:res?.data.status,
        type:res?.data.type,
        location:res?.data.location,
        description:res?.data.description,
    })
      }
    })
    this.save.emit(updated);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
