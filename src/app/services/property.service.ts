import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Property, Properties } from '../models/property.model';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface PropertyFilters {
  type?: string;
  max_price?: number;
  min_price?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  constructor(private http: HttpClient) {}

  apiUrl = environment.apiUrl;

  getProperties(filters: PropertyFilters = {}): Observable<Properties> {
    let params = new HttpParams();
    if (filters.type) params = params.set('type', filters.type);
    if (filters.max_price !== undefined) {
      params = params.set('max_price', filters.max_price);
    }
    if (filters.min_price !== undefined) {
      params = params.set('min_price', filters.min_price);
    }
    if (filters.search) params = params.set('search', filters.search);

    return this.http.get<Properties>(`${this.apiUrl}properties`, { params });
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
  createProperty(data:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}properties`,data)
  }
}
