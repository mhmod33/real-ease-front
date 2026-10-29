import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';
import { Order, Orders } from '../models/order.model';
import { ClientsCount, Dashboard, TransactionsCount } from '../models/dashboard.model';
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
  getTotalCLientsCount():Observable<ClientsCount>{
    return this.http.get<ClientsCount>(`${this.apiUrl}orders/total-clients`)
  }
  getTotalTransactions():Observable<TransactionsCount>{
    return this.http.get<TransactionsCount>(`${this.apiUrl}orders/total-price`)
  }
  changeStatus(ids: number[],status:string):Observable<any>{
    return this.http.patch<any>(`${this.apiUrl}orders/change-status-multiple`,{ids: ids,status: status})
  }
  deleteMultipleOrders(ids: number[]):Observable<any>{
    return this.http.request('delete', `${this.apiUrl}orders/delete-multiple`, { body: { ids: ids } });
  }

}
