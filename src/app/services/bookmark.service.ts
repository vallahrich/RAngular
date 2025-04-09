import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bookmark } from '../models/bookmark.model';
import { Restaurant } from '../models/restaurant.model';
import { environment } from 'src/enviroments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private apiUrl = `${environment.apiUrl}/bookmark`;

  constructor(private http: HttpClient) { }

  getBookmarkedRestaurants(userId: number): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/user/${userId}/restaurants`);
  }

  isBookmarked(userId: number, restaurantId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${userId}/${restaurantId}`);
  }

  addBookmark(userId: number, restaurantId: number): Observable<any> {
    const bookmark: Bookmark = {
      userId,
      restaurantId,
      createdAt: new Date()
    };
    
    return this.http.post(`${this.apiUrl}`, bookmark);
  }

  removeBookmark(userId: number, restaurantId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${restaurantId}`);
  }
}