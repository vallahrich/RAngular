import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Restaurant } from '../../models/restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';
import { BookmarkService } from '../../services/bookmark.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantInfoComponent } from './restaurant-info/restaurant-info.component';
import { ReviewSectionComponent } from './review-section/review-section.component';

@Component({
  selector: 'app-restaurant-detail-page',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RestaurantInfoComponent,
    ReviewSectionComponent
  ],
  templateUrl: './restaurant-detail-page.component.html',
  styleUrls: ['./restaurant-detail-page.component.css']
})
export class RestaurantDetailPageComponent implements OnInit {
  restaurantId!: number;
  restaurant: Restaurant | null = null;
  isBookmarked = false;
  isLoggedIn = false;
  loading = true;
  error = '';
  
  get currentUserId(): number {
    return this.authService.currentUserValue?.userId ?? 0;
  }
  
  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private bookmarkService: BookmarkService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.restaurantId = +id;
        this.loadRestaurantDetails();
        
        if (this.isLoggedIn) {
          this.checkIfBookmarked();
        }
      }
    });
  }
  
  loadRestaurantDetails(): void {
    this.loading = true;
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (data) => {
        this.restaurant = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load restaurant details.';
        this.loading = false;
        console.error('Error loading restaurant:', error);
      }
    });
  }
  
  checkIfBookmarked(): void {
    this.bookmarkService.isBookmarked(this.currentUserId, this.restaurantId).subscribe({
      next: (data) => {
        this.isBookmarked = data;
      },
      error: (error) => {
        console.error('Error checking bookmark status:', error);
      }
    });
  }
  
  toggleBookmark(): void {
    if (this.isBookmarked) {
      this.bookmarkService.removeBookmark(this.currentUserId, this.restaurantId).subscribe({
        next: () => {
          this.isBookmarked = false;
        },
        error: (error) => {
          this.error = 'Failed to remove bookmark.';
          console.error('Error removing bookmark:', error);
        }
      });
    } else {
      this.bookmarkService.addBookmark(this.currentUserId, this.restaurantId).subscribe({
        next: () => {
          this.isBookmarked = true;
        },
        error: (error) => {
          this.error = 'Failed to add bookmark.';
          console.error('Error adding bookmark:', error);
        }
      });
    }
  }
}