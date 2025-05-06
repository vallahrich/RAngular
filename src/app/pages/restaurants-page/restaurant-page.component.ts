import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Restaurant } from '../../models/restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { RestaurantCardComponent } from '../../shared/ui/restaurant-card/restaurant-card.component';

@Component({
  selector: 'app-restaurants-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FilterBarComponent,
    RestaurantCardComponent
  ],
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.css']
})
export class RestaurantsPageComponent implements OnInit {
  restaurants: Restaurant[] = [];
  loading = false;
  error = '';
  isLoggedIn = false;
  username = '';
  
  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.username = this.authService.currentUserValue?.username || '';
    }
    // Load all restaurants initially
    this.loadAllRestaurants();
  }
  
  loadAllRestaurants(): void {
    this.loading = true;
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load restaurants. Please try again.';
        this.loading = false;
        console.error('Error loading restaurants:', error);
      }
    });
  }
  
  onFiltersApplied(filters: any): void {
    this.loading = true;
    
    const neighborhoods = filters.neighborhood ? [filters.neighborhood] : [];
    const cuisines = filters.cuisine ? [filters.cuisine] : [];
    const priceRanges = filters.priceRange ? [filters.priceRange] : [];
    const dietaryOptions = filters.dietaryOptions ? [filters.dietaryOptions] : [];
    
    this.restaurantService.filterRestaurants(
      neighborhoods,
      cuisines,
      priceRanges,
      dietaryOptions
    ).subscribe({
      next: (data) => {
        this.restaurants = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load restaurants. Please try again.';
        this.loading = false;
        console.error('Error filtering restaurants:', error);
      }
    });
  }
}