import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { UserType } from '../../../models/user.model';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {
  name = '';
  nameError = false;
  type: UserType = 'وكيل عقاري';
  address = '';
  age?: number;
  gender: 'ذكر' | 'أنثى' = 'ذكر';
  email = '';
  agencyName = '';
  agencyAddress = '';
  description = '';

  userTypes: UserType[] = [
    'وكيل عقاري',
    'وكيل عقاري مستقل',
    'شركة عقارية',
    'وكيل تجاري',
    ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.name.trim()) {
      this.nameError = true;
      return;
    }
    this.nameError = false;
    this.userService
      .createUser({
        name: this.name,
        type: this.type,
        address: this.address,
        location: this.address || 'غير محدد',
        age: this.age,
        gender: this.gender,
        email: this.email,
        agencyName: this.agencyName,
        agencyAddress: this.agencyAddress,
        description: this.description,
      })
      .subscribe(() => {
        this.router.navigate(['/users']);
      });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
