import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { GoogleLoginPayload } from '../models/google-login-payload.model';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl=environment.apiUrl;
  private tokenKey='token';
  constructor(
    private http:HttpClient,
    private router:Router
  ){}
  loginWithGoogle(idToken:string):Observable<AuthResponse>{
    const payload:GoogleLoginPayload={id_token:idToken};
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/google`,payload).pipe(
      tap((response:AuthResponse)=>{
        if(response.token){
          localStorage.setItem(this.tokenKey,response.token);
        }
      })
    )

  }
  getToken():string|null{
    return localStorage.getItem(this.tokenKey);
  }
  logout():void{
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}user`);
  }

}
