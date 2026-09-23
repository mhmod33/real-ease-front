import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
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
  private userKey='auth-user';

  currentUser=signal<User|null>(this.getStoredUser());
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
  loginWithEmail(email:string,password:string): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}auth/login`,{email,password}).pipe(
      tap((response)=>this.setSession(response))
    );
  }
  getToken():string|null{
    return localStorage.getItem(this.tokenKey);
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}user`);
  }
  
  private getStoredUser():User |null{
    const stored=localStorage.getItem(this.userKey);
    return stored ? JSON.parse(stored) :null; 
  }
  private setSession(response:AuthResponse){
    localStorage.setItem(this.tokenKey,response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }
  private clearSession(response:AuthResponse){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthinticated():boolean{
    return !!this.getToken();
  }
  isAdmin():boolean{
    return this.currentUser()?.role==='admin';
  }
  logout():void{
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }
}
