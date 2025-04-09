import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/review`;

  constructor(private http: HttpClient) { }

  getReviewsByRestaurantId(restaurantId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/restaurant/${restaurantId}`);
  }

  getUserReviewForRestaurant(userId: number, restaurantId: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/user/${userId}/restaurant/${restaurantId}`);
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}`, review);
  }

  updateReview(review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}`, review);
  }

  deleteReview(userId: number, restaurantId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}/restaurant/${restaurantId}`);
  }
}