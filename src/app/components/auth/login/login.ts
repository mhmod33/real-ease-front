import { Component, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  showPassword = signal(false);
  errorMessage=signal<string | null>(null);
  loginForm:FormGroup;
  isLoading=signal(false);
  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router:Router,
  ){

    this.loginForm=this.fb.group(
      {
        email:['',[Validators.required,Validators.email]],
        password:['',[Validators.required,Validators.minLength(8)]]
      }
    );
  }
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      client_id: '314057864540-dpc10dbvpk60ra1g71t3h9c92efctqun.apps.googleusercontent.com',
      callback: (response: any) => this.handleGoogleResponse(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', width: '100%', locale: 'ar' }
    );
  }

  onSubmit():void{
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage.set(null);
    this.isLoading.set(true);
    const {email,password}=this.loginForm.value;
    this.authService.loginWithEmail(email,password).subscribe({
      next: ()=>{
        this.isLoading.set(false)
        this.redirectAfterLogin();
      },
      error:(err)=>{
        this.isLoading.set(false)
        this.errorMessage.set(
          err.error?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة'

        )
      }
    })
  }
  redirectAfterLogin():void{
    if(this.authService.isAdmin()){
      this.router.navigate(['/dashboard'])
    }
    else{
      this.router.navigate(['/properties'])
    }
  }
  handleGoogleResponse(response: any): void {
    const idToken = response.credential;
    console.log('Google ID Token:', idToken);
    // TODO: send idToken to your backend for verification
  }
}
