import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import {environment } from '../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { GoogleLoginPayload } from '../models/google-login-payload.model';
import { User } from '../models/user.model';
import { ProfileModel, Root } from '../models/profile.model';
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
      tap((response:AuthResponse)=>this.setSession(response))
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
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
  getLoggedInUserId(): Observable<string | null> {
    const user=this.currentUser();
    console.log('Logged in user ID:', user?.id);
    return of(user?.id || null);
  }
  private setSession(response:AuthResponse){
    if (!response?.Token || !response.UserID || !response.UserName) {
      this.clearSession();
      throw new Error('Invalid authentication response');
    }

    const user: User = {
      id: String(response.UserID),
      name: response.UserName,
      type: 'وكيل عقاري',
      email: '',
      image: response.UserPhoto ?? '',
      propertiesCount: 0,
      location: '',
      role: response.UserRole,
    };

    localStorage.setItem(this.tokenKey, response.Token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
  }
  private clearSession(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  isAuthinticated():boolean{
    return !!this.getToken();
  }
  getUserProfile():Observable< Root>{
    return this.http.get<Root>(`${this.apiUrl}user/profile`);
  }
  editProfile(data: Record<string, unknown>):Observable<Root>{
    return this.http.put<Root>(`${this.apiUrl}user/profile`, data);
  }
  isAdmin():boolean{
    return this.currentUser()?.role==='admin';
  }
  logout():void{
    this.clearSession();
  }
}
