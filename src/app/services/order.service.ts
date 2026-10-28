import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { Order, Orders } from '../models/order.model';
import { Dashboard } from '../models/dashboard.model';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllOrders():Observable<Orders> {
    return this.http.get<Orders>(`${this.apiUrl}orders`);
  }
  deleteOrder(id:number):Observable<any>{
    return this.http.delete(`${this.apiUrl}orders/${id}`)
  }
  getTotalCLientsCount():Observable<Dashboard>{
    return this.http.get<Dashboard>(`${this.apiUrl}dashboard/kpi-card`)
  }
}
