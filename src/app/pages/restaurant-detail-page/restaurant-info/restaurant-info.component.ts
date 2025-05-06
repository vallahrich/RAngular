import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-info',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.css']
})
export class RestaurantInfoComponent {
  @Input() restaurant!: Restaurant;
  
  getPriceRange(priceRange: string): string {
    switch(priceRange) {
      case 'L': return '$ (Budget)';
      case 'M': return '$$ (Moderate)';
      case 'H': return '$$$ (Luxury)';
      default: return '$ (Budget)';
    }
  }
}