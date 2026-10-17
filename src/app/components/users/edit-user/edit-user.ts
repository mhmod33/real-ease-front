import { Component,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, UserType } from '../../../models/user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser {

  editForm:FormGroup;
  userTypes: UserType[] = [
    'realEstateAgent',
    'independentRealEstateAgent',
    'realEstateCompany',
    'commercialAgent',
  ];
  userData=signal<User|null>(null);
  roles: string[] = [
    'admin',
    'user',
    'agent',
  ];
  isLoading=signal(false);
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [''],
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
  ngOnInit():void{
    this.getUserData();
  }
  getUserData(){
    const url=this.router.url;
    const id = url.split('/')[3]; 
    this.userService.getUserById(id).subscribe({
      next:(res)=>{
        console.log('User data retrieved:', res);
        this.userData.set(res.data);
        this.editForm.patchValue({
        name: res.data.name,
        type: res.data.type,
        role: res.data.role,
        location: res.data.location,
        agency: res.data.agency,
        password: res.data.password,
        email: res.data.email,
        gender: res.data.gender,
        age: res.data.age,
        description: res.data.description,
        phone: res.data.phone,
        personal_website: res.data.personal_website,
        social_media: res.data.social_media,
        whatsapp_phone: res.data.whatsapp_phone,
        })
      },
      error:(err)=>{
        console.log('Error retrieving user data:', err);
      }
    })
  }
  onSubmit(): void {
    console.log('Form submitted:', this.editForm.value);
      const url=this.router.url;
      const id = url.split('/')[3];
      this.isLoading.set(true);
      const data=this.editForm.value;
      this.userService.editUser(data, id).subscribe({
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

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
