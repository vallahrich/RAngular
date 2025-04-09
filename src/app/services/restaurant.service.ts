import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = `${environment.apiUrl}/restaurant`;

  constructor(private http: HttpClient) { }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.apiUrl}/${id}`);
  }

  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/filter`);
  }

  filterRestaurants(
    neighborhood?: string[],
    cuisine?: string[],
    priceRange?: string[],
    dietaryOptions?: string[]
  ): Observable<Restaurant[]> {
    let params = new HttpParams();
    
    if (neighborhood && neighborhood.length > 0) {
      neighborhood.forEach(n => params = params.append('neighborhood', n));
    }
    
    if (cuisine && cuisine.length > 0) {
      cuisine.forEach(c => params = params.append('cuisine', c));
    }
    
    if (priceRange && priceRange.length > 0) {
      priceRange.forEach(p => params = params.append('priceRange', p));
    }
    
    if (dietaryOptions && dietaryOptions.length > 0) {
      dietaryOptions.forEach(d => params = params.append('dietaryOptions', d));
    }
    
    return this.http.get<Restaurant[]>(`${this.apiUrl}/filter`, { params });
  }
}