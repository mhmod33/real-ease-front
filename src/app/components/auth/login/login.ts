import { Component, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const google: any;

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  showPassword = signal(false);

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

  handleGoogleResponse(response: any): void {
    const idToken = response.credential;
    console.log('Google ID Token:', idToken);
    // TODO: send idToken to your backend for verification
  }
}
