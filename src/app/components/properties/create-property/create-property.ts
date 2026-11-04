import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Users,Data } from '../../../models/user.model';
interface AmenityOption {
  key: string;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-create-property',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-property.html',
  styleUrl: './create-property.css',
})
export class CreateProperty implements OnDestroy {
  createForm:FormGroup
  users:Data[] = [];
  errorMessage = '';
  isLoading = false;
  constructor(
    private router: Router, 
    private propertyService: PropertyService,
    private fb:FormBuilder,
    private UserService :UserService
  ) {
    this.createForm=this.fb.group({
      name:['',[Validators.required,Validators.minLength(2)]],
      price:['',[Validators.required,Validators.min(0)]],
      features:[[]],
      description:['',[Validators.minLength(5)]],
      location:[''],
      type:[''],
      status:[''],
      contract_type:[''],
      image:[null],
      images:[[]],
      user_id:[''],
    })
  }
  ngOnInit():void{
    this.loadUsers();
  }
  loadUsers(){
    this.UserService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users?.data || [];
      }
    })
  };
  // ── Mock dropdown options ──────────────────────────────────────
  propertyTypes = ['apartment', 'house', 'condo', 'land', 'commercial', 'other'];
  propertyStatuses = ['available', 'sold', 'pending', 'rented'];
  contractTypes = ['sale', 'rent'];
  amenities: AmenityOption[] =[]
  // ── File upload ─────────────────────────────────────────────────
  mainImage: File | null = null;
  uploadedFiles: File[] = [];
  isDragOver = false;
  newAmenityLabel = '';
  private readonly filePreviews = new Map<File, string>();

  onMainImageSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file?.type.startsWith('image/')) {
      this.mainImage = file;
      this.createForm.get('image')?.setValue(file);
    }
    input.value = '';
  }

  removeMainImage() {
    if (this.mainImage) {
      this.releaseFilePreview(this.mainImage);
      this.mainImage = null;
      this.createForm.get('image')?.setValue(null);
    }
  }

  addAmenity() {
    const inputValue=document.getElementById('newAmenity') as HTMLInputElement
    if(!inputValue.value.trim()){
      console.log('Please enter a valid amenity label.');
      return
    }
    const newAmenity: AmenityOption = {
      key: `amenity_${this.amenities.length + 1}`,
      label: inputValue.value.trim(),
      checked: true,
    };
    this.amenities.push(newAmenity);
    this.newAmenityLabel = '';
    inputValue.value = '';
  }
  removeAmenity(key: string) {
    const index = this.amenities.findIndex((a) => a.key === key);
    if (index !== -1) {
      this.amenities.splice(index, 1);
      this.updateFeatures();
    }
  }

  onFeatureChange(amenity: AmenityOption, e: Event) {
    amenity.checked = (e.target as HTMLInputElement).checked;
    this.updateFeatures();
  }

  private updateFeatures() {
    const features = this.amenities
      .filter((amenity) => amenity.checked)
      .map((amenity) => amenity.label);
    this.createForm.get('features')?.setValue(features);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(e: DragEvent) {
    this.isDragOver = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = false;
    const files = Array.from(e.dataTransfer?.files ?? []);
    this.addFiles(files);
  }

  onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(Array.from(input.files));
    }
    input.value = '';
  }

  private addFiles(files: File[]) {
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    this.uploadedFiles.push(...imageFiles);
    this.createForm.get('images')?.setValue(this.uploadedFiles);
  }

  removeFile(index: number) {
    const [file] = this.uploadedFiles.splice(index, 1);
    if (file) {
      this.releaseFilePreview(file);
    }
    this.createForm.get('images')?.setValue(this.uploadedFiles);
  }

  getFilePreview(file: File): string {
    let preview = this.filePreviews.get(file);
    if (!preview) {
      preview = URL.createObjectURL(file);
      this.filePreviews.set(file, preview);
    }
    return preview;
  }

  private releaseFilePreview(file: File) {
    const preview = this.filePreviews.get(file);
    if (preview) {
      URL.revokeObjectURL(preview);
      this.filePreviews.delete(file);
    }
  }

  ngOnDestroy() {
    this.filePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    this.filePreviews.clear();
  }
  getErrorMessage(controlName: string): string {
    const control = this.createForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required.';
    }
    if (control?.hasError('string')) {
      return `This field must be a string.`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.getError('minlength').requiredLength;
      return `Minimum length is ${minLength} characters.`;
    }
    if (control?.hasError('min')) {
      const minValue = control.getError('min').min;
      return `Minimum value is ${minValue}.`;
    }
    if (control?.touched) {
      return '';
    }
    return '';
  }
  // ── Submit / Cancel ────────────────────────────────────────────
  onSubmit() {
    
    this.isLoading = true;
    const data = {
      name: this.createForm.get('name')?.value,
      type: this.createForm.get('type')?.value,
      status: this.createForm.get('status')?.value,
      price: this.createForm.get('price')?.value,
      address: this.createForm.get('location')?.value,
      description: this.createForm.get('description')?.value,
      features: this.createForm.get('features')?.value ?? [],
      filesCount: this.uploadedFiles.length + (this.mainImage ? 1 : 0),
      user_id: this.createForm.get('user_id')?.value,
      images: this.uploadedFiles.map((file) => this.getFilePreview(file)),
      image: this.mainImage ? this.getFilePreview(this.mainImage) : null,
    };
    console.log('📦 New Property Payload (mock):', data);
    this.propertyService.createProperty(data).subscribe({
      next: (property) => {
        console.log('Property created successfully:', property);
        this.isLoading = false;
        this.router.navigate(['/properties']);
      },
      error: (err) => {
        console.error('Error creating property:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
 
  onCancel() {
    this.router.navigate(['/properties']);
  }
}
