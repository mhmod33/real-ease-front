import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { Orders } from '../models/order.model';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllOrders():Observable<Orders> {
    return this.http.get<Orders>(`${this.apiUrl}orders`);
  }
}
