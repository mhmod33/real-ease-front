import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Users, User, Root } from '../models/user.model';
import {environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  deleteSelectedUsers(ids: string[]) {
    throw new Error('Method not implemented.');
  }
  private apiUrl=environment.apiUrl;
  

  constructor(
    private http:HttpClient,
    private router:Router
  ){}
  getAllUsers():Observable<Users |null>{
    return this.http.get<Users|null>(`${this.apiUrl}users`)
  };

  getUserById(id: string): Observable<Root> {
    return this.http.get<Root>(`${this.apiUrl}users/${encodeURIComponent(id)}`);
  }
  createNewUser(data:any):Observable<User|null>{
    return this.http.post<User|null>(`${this.apiUrl}users`,data)
  }

  // getUserById(id: string): User | undefined {
  //   return this.usersSubject.value.find((u) => u.id === id);
  // }


  deleteUser(id: number): Observable<any> {
    return this.http.delete<boolean>(`${this.apiUrl}users/${id}`);
  }

  // deleteSelectedUsers(ids: string[]): Observable<boolean> {
  //   const filtered = this.usersSubject.value.filter((u) => !ids.includes(u.id));
  //   this.usersSubject.next(filtered);
  //   return of(true);
  // }

  // updateUser(id: string, updatedData: Partial<User>): Observable<User | undefined> {
  //   const current = this.usersSubject.value;
  //   const index = current.findIndex((u) => u.id === id);
  //   if (index !== -1) {
  //     current[index] = { ...current[index], ...updatedData };
  //     this.usersSubject.next([...current]);
  //     return of(current[index]);
  //   }
  //   return of(undefined);
  // }
}
