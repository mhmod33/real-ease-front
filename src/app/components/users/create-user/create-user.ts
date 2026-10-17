import { Component,signal} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { userRole, UserType } from '../../../models/user.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {

  addForm: FormGroup;
  showPassword = signal(false);
  userTypes: UserType[] = [
    'realEstateAgent',
    'independentRealEstateAgent',
    'realEstateCompany',
    'commercialAgent',
  ];
  roles: userRole[] = [
    'admin',
    'agent',
    'user',
  ];

  isLoading=signal(false);
  serverErrors = signal<string[]>([]);

  togglePassword(): void {
    this.showPassword.update(visible => !visible);
  }

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.minLength(2)]],
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
        linkedin: [''],
      }),
      phone: ['', [Validators.pattern(/^\d{0,11}$/)]],
      whatsapp_phone: ['', [Validators.pattern(/^\d{0,11}$/)]],
      personal_website: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    });
  }

  onSubmit(): void {
    this.serverErrors.set([]);
    console.log('Form submitted:', this.addForm.value);

    this.isLoading.set(true);
    this.userService.createNewUser(this.addForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/users']);
      },
      error: (error: HttpErrorResponse) => {
        this.serverErrors.set(this.getErrorMessages(error));
        this.isLoading.set(false);
      }
    });
  }

  private getErrorMessages(error: HttpErrorResponse): string[] {
    const response = this.asRecord(error.error);
    const validationErrors = this.asRecord(response?.['errors']);

    if (error.status === 422 && validationErrors) {
      const messages = Object.values(validationErrors).flatMap(value => {
        if (typeof value === 'string') {
          return [value];
        }
        return Array.isArray(value)
          ? value.filter((message): message is string => typeof message === 'string')
          : [];
      });

      if (messages.length > 0) {
        return messages;
      }
    }

    const responseMessage = response?.['message'];
    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return [responseMessage];
    }

    return [error.message || 'حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.'];
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? value as Record<string, unknown>
      : null;
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
