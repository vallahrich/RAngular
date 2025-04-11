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
    // Convert model property names to match C# backend
    const apiReview = {
      reviewId: review.reviewId,
      userId: review.userId,
      restaurantId: review.restaurantId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    };
    
    return this.http.post<Review>(`${this.apiUrl}`, apiReview);
  }
  
  updateReview(review: Review): Observable<Review> {
    // Convert model property names to match C# backend
    const apiReview = {
      reviewId: review.reviewId,
      userId: review.userId,
      restaurantId: review.restaurantId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    };
    
    return this.http.put<Review>(`${this.apiUrl}`, apiReview);
  }

  deleteReview(userId: number, restaurantId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}/restaurant/${restaurantId}`);
  }
}