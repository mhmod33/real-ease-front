import { Component,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserType } from '../../../models/user.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {

  addForm: FormGroup;
  userTypes: UserType[] = [
    'وكيل عقاري',
    'وكيل عقاري مستقل',
    'شركة عقارية',
    'وكيل تجاري',
  ];
  isLoading=signal(false);
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.minLength(2), Validators.maxLength(15)]],
      type: ['', Validators.required],
      age: ['', [Validators.min(18), Validators.max(120)]],
      gender: [''],
      agency: [''],
      location: [''],
      description: ['', [Validators.minLength(10)]],
      social_media: this.fb.group({
        facebook: [''],
        instagram: [''],
        twitter: [''],
      }),
      phone: ['', [Validators.pattern(/^\d{0,11}$/)]],
      whatsapp_phone: ['', [Validators.pattern(/^\d{0,11}$/)]],
      personal_website: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

  onSubmit(): void {
    console.log('Form submitted:', this.addForm.value);
    this.isLoading.set(true);
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched();
      this.isLoading.set(false)
      return;
    }
    else{
      this.isLoading.set(true);
      const data=this.addForm.value;
      this.userService.createNewUser(data).subscribe({
        next:()=>{
          console.log(data);
          this.isLoading.set(false);
          this.router.navigate(['/users']);
        },
        error:(error)=>{
          console.error('Error creating user:', error);
          this.isLoading.set(false);
        }
      })
    }

  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
