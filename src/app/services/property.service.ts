import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Property ,Properties} from '../models/property.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  constructor(private http: HttpClient) {

  }
  apiUrl=environment.apiUrl
  
  
  getProperties():Observable <Properties> {
    return this.http.get<Properties>(`${this.apiUrl}properties`);
  }

  getPropertyById(id: number): Observable<Property | undefined> {
    return this.http.get<Property | undefined>(`${this.apiUrl}properties/${id}`);
  }

  updateProperty(id: number, data: Partial<Property>): Observable<Property | undefined> {
    return this.http.put<Property | undefined>(`${this.apiUrl}properties/${id}`, data);
  }   
  

  deleteProperty(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}properties/${id}`);
  }
}
