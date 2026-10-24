import { Injectable } from '@angular/core';
import {environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Root } from '../models/message.model';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) {}
  getALlMessages():Observable<Root>{
    return this.http.get<Root>(`${this.apiUrl}messages`)
  }
  sendMessage(message: string, receiverId: number): Observable<Root> {
    return this.http.post<Root>(`${this.apiUrl}messages`, {
      message,
      receiver_id: receiverId,
      property_id:1
    });
  }
}
