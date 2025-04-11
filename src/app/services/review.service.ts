// File: src/app/services/review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/review`;

  constructor(private http: HttpClient) { }

  getReviewsByRestaurantId(restaurantId: number): Observable<Review[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurant/${restaurantId}`).pipe(
      map(reviews => {
        // Map to our Review interface, handling any nested objects
        return reviews.map(rawReview => {
          // Extract username safely using optional chaining and type assertion
          const usernameFromResponse = rawReview.username || 
            (rawReview.hasOwnProperty('user') ? (rawReview as any).user?.username : undefined);
          
          const cleanReview: Review = {
            reviewId: rawReview.reviewId,
            userId: rawReview.userId,
            restaurantId: rawReview.restaurantId,
            rating: rawReview.rating,
            comment: rawReview.comment || "",
            createdAt: rawReview.createdAt,
            username: usernameFromResponse
          };
          return cleanReview;
        });
      }),
      catchError(error => {
        console.error('Error fetching reviews:', error);
        return throwError(() => error);
      })
    );
  }

  getUserReviewForRestaurant(userId: number, restaurantId: number): Observable<Review> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/restaurant/${restaurantId}`).pipe(
      map(rawReview => {
        // Extract username safely using optional chaining and type assertion
        const usernameFromResponse = rawReview.username || 
          (rawReview.hasOwnProperty('user') ? (rawReview as any).user?.username : undefined);
        
        // Clean up the review object to match our interface
        const cleanReview: Review = {
          reviewId: rawReview.reviewId,
          userId: rawReview.userId,
          restaurantId: rawReview.restaurantId,
          rating: rawReview.rating,
          comment: rawReview.comment || "",
          createdAt: rawReview.createdAt,
          username: usernameFromResponse
        };
        return cleanReview;
      }),
      catchError(error => {
        // Only log errors that aren't 404 (not found)
        if (error.status !== 404) {
          console.error('Error fetching user review:', error);
        }
        return throwError(() => error);
      })
    );
  }

  createReview(review: Review): Observable<Review> {
    // Format the review exactly as the backend expects it
    const apiReview = {
      reviewId: 0, // Always use 0 for new reviews
      userId: review.userId,
      restaurantId: review.restaurantId,
      rating: Number(review.rating), // Ensure rating is a number
      comment: review.comment || "", // Ensure comment is never null
      createdAt: typeof review.createdAt === 'string' 
        ? review.createdAt 
        : (review.createdAt ? review.createdAt.toISOString() : new Date().toISOString())
    };
    
    console.log('Creating review with payload:', JSON.stringify(apiReview));
    
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    
    return this.http.post<any>(this.apiUrl, apiReview, { headers }).pipe(
      map(rawResponse => {
        // Extract username safely using optional chaining and type assertion
        const usernameFromResponse = rawResponse.username || 
          (rawResponse.hasOwnProperty('user') ? (rawResponse as any).user?.username : undefined);
        
        // Clean up the response to match our interface
        const cleanResponse: Review = {
          reviewId: rawResponse.reviewId,
          userId: rawResponse.userId,
          restaurantId: rawResponse.restaurantId,
          rating: rawResponse.rating,
          comment: rawResponse.comment || "",
          createdAt: rawResponse.createdAt,
          username: usernameFromResponse
        };
        return cleanResponse;
      }),
      catchError(error => {
        console.error('Error creating review:', error);
        if (error.status === 400) {
          console.error('Review validation failed. Request payload:', apiReview);
        }
        return throwError(() => error);
      })
    );
  }
  
  updateReview(review: Review): Observable<Review> {
    // Format the review exactly as the backend expects it
    const apiReview = {
      reviewId: review.reviewId,
      userId: review.userId,
      restaurantId: review.restaurantId,
      rating: Number(review.rating), // Ensure rating is a number
      comment: review.comment || "", // Ensure comment is never null
      createdAt: typeof review.createdAt === 'string' 
        ? review.createdAt 
        : (review.createdAt ? review.createdAt.toISOString() : new Date().toISOString())
    };
    
    console.log('Updating review with payload:', JSON.stringify(apiReview));
    
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    
    return this.http.put<any>(this.apiUrl, apiReview, { headers }).pipe(
      map(rawResponse => {
        // Extract username safely using optional chaining and type assertion
        const usernameFromResponse = rawResponse.username || 
          (rawResponse.hasOwnProperty('user') ? (rawResponse as any).user?.username : undefined);
        
        // Clean up the response to match our interface
        const cleanResponse: Review = {
          reviewId: rawResponse.reviewId,
          userId: rawResponse.userId,
          restaurantId: rawResponse.restaurantId,
          rating: rawResponse.rating,
          comment: rawResponse.comment || "",
          createdAt: rawResponse.createdAt,
          username: usernameFromResponse
        };
        return cleanResponse;
      }),
      catchError(error => {
        console.error('Error updating review:', error);
        return throwError(() => error);
      })
    );
  }

  deleteReview(userId: number, restaurantId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}/restaurant/${restaurantId}`).pipe(
      catchError(error => {
        console.error('Error deleting review:', error);
        return throwError(() => error);
      })
    );
  }
}