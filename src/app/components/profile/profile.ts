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
  ){}
  ngOnInit():void{
    this.getProfileData();
  }
  getProfileData():void{
    this.authService.getUserProfile().subscribe({
      next:(response)=>{
        console.log("returned data successfully",response)
        this.profile.set(response)
      },
      error:(err)=>{
        console.error(err)
      },
    })
  }
}
