import { Injectable } from '@angular/core';
import {environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageHistoryResponse, Root, SentMessageResponse } from '../models/message.model';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl=environment.apiUrl;
  constructor(private http:HttpClient) {}
  getALlMessages():Observable<Root>{
    return this.http.get<Root>(`${this.apiUrl}messages`)
  }
  sendMessage(message: string, receiverId: number, propertyId = 1): Observable<SentMessageResponse> {
    return this.http.post<SentMessageResponse>(`${this.apiUrl}messages`, {
      message,
      receiver_id: receiverId,
      property_id: propertyId
    });
  }
  getMessageHistory(userId: number): Observable<MessageHistoryResponse> {
    return this.http.get<MessageHistoryResponse>(`${this.apiUrl}messages/history/${userId}`)
  }
  markMessageAsRead(messageId:number):Observable<any>{
    return this.http.patch(`${this.apiUrl}messages/${messageId}/read`, {})
  }
}
