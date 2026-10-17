import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { ProfileModel, Root } from '../../models/profile.model';
@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  profile = signal<Root | null>(null);
  constructor(
    private authService:AuthService,
    private router:Router
  ){}
  ngOnInit():void{
    this.getProfileData();
  }
  getProfileData():void{
    
    this.authService.getUserProfile().subscribe({
      next:(response)=>{
        this.profile.set(response)
      },
      error:(err)=>{
        console.error(err)
      },
    })
  }
  navigateToEditPage():void{
    const url = this.router.url;
    if(url.includes('/user/profile')){
      this.router.navigate(['/settings']);
    }else if(url.includes('/users/')){
      this.router.navigate(['/settings']);
      const id=url.split('/users/')[2];
      if(id){
        console.log('Navigating to edit page for user ID:', id);
        this.router.navigate(['/users/edit',id]);
      }
      else{
        console.log('User ID not found in the URL');
      }
    }
  }
}
