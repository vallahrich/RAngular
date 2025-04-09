import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../models/restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  featuredRestaurants: Restaurant[] = [];
  isLoggedIn = false;
  loading = true;
  error = '';
  
  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadFeaturedRestaurants();
  }
  
  loadFeaturedRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (restaurants) => {
        this.featuredRestaurants = restaurants.slice(0, 6);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load featured restaurants.';
        this.loading = false;
        console.error('Error loading restaurants:', error);
      }
    });
  }
}