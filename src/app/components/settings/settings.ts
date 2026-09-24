import { Component, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule,FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { AppModal } from '../shared/app-modal/app-modal';
import { AuthService } from '../../services/auth-service';
import { Root } from '../../models/profile.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, AppModal,ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  user?: User;
  ProfileData=signal<Root|null>(null);
  dragOver = false;
  editForm:FormGroup;
  errorMessage=signal<string | null>(null);

  // Delete modal
  showDeleteModal = false;
  isLoading = signal(false);
  // Success / Info modal
  infoModalOpen = false;
  infoModalMessage = '';
  userTypes = ['realEstateAgent', 'independentRealEstateAgent', 'realEstateCompany', 'commercialAgent'];

  constructor(
    private userService: UserService, private router: Router,
    private authService: AuthService,
    private fb:FormBuilder
  ) {

    this.editForm=this.fb.group({
      name:['',[Validators.required,Validators.maxLength(50),Validators.minLength(2)]],
      type:[''],
      location:[''],
      agency:[''],
      gender:[''],
      age:[''],
      description:[''],
      phone:[''],
      personal_website:[''],
      social_media:[''],
      whatsapp_number:[''],

    })
  }

  ngOnInit(): void {
    this.user = this.userService.getUserById('5') || this.userService.getUsers()[0];
    this.getUser();
    this.getUserAuth();
    this.getUserDataAuthUser();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(): void {
    this.dragOver = false;
  }
  onSubmit(){
    this.savePersonalInfo();
  }
  getUserAuth(){
    this.authService.getLoggedInUserId().subscribe((res)=>{
      return res;
    })
    }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }
  getUser(){}
  // savePersonalInfo(): void {
  //   if (this.user) {
  //     this.userService.updateUser(this.user.id, {
  //       name: this.name,
  //       address: this.address,
  //       agencyName: this.agencyName,
  //       gender: this.gender,
  //       age: this.age,
  //       description: this.description,
  //     }).subscribe(() => {
  //       this.showInfo('تم حفظ المعلومات الشخصية بنجاح');
  //     });
  //   }
  // }

  // saveSocialInfo(): void {
  //   if (this.user) {
  //     this.userService.updateUser(this.user.id, {
  //       phone: this.phone,
  //       whatsapp: this.whatsapp,
  //       email: this.email,
  //       website: this.website,
  //       socialLinks: {
  //         facebook: this.facebook,
  //         instagram: this.instagram,
  //         twitter: this.twitter,
  //         linkedin: this.linkedin,
  //       },
  //     }).subscribe(() => {
  //       this.showInfo('تم حفظ وسائل التواصل بنجاح');
  //     });
  //   }
  // }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  getUserDataAuthUser(){
    this.authService.getUserProfile().subscribe( (res)=>{
      console.log(res);
      this.ProfileData.set(res);
      this.editForm.patchValue({
        name: res.data.name,
        type: res.data.type,
        location: res.data.location,
        agency: res.data.agency,
        gender: res.data.gender,
        age: res.data.age,
        description: res.data.description,
        phone: res.data.phone,
        personal_website: res.data.personal_website,
        social_media: res.data.social_media,
        whatsapp_number: res.data.whatsapp_phone,
      });
    })
  }
  savePersonalInfo():void{
    console.log('clicked')
    this.isLoading.set(true)
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.isLoading.set(false);

      return;
    }

    const data={...this.editForm.getRawValue()};
    console.log(data);
    
    // data.append("_method",'PUT')
    // if(this.editForm.valid){
      this.authService.editProfile(data).subscribe({
        next: (res)=>{
        console.log(res);
        console.log("updated successfully");
        
        this.isLoading.set(false);
        this.showInfo('تم تحديث المعلومات بنجاح');
        },
        error:(err)=>{
        this.isLoading.set(false)
        this.errorMessage.set(
          err.error?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة'

        )
      }
      });

    // }
  }
  showInfo(message: string): void {
    this.infoModalMessage = message;
    this.infoModalOpen = true;
  }

  closeInfo(): void {
    this.infoModalOpen = false;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.user) {
      this.userService.deleteUser(this.user.id).subscribe(() => {
        this.showDeleteModal = false;
        this.router.navigate(['/login']);
      });
    }
  }
}
