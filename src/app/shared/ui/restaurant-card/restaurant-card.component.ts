import { Component, Input } from '@angular/core';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css']
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
  
  getPriceRange(priceRange: string): string {
    switch(priceRange) {
      case 'L': return '$';
      case 'M': return '$$';
      case 'H': return '$$$';
      default: return '$';
    }
  }
}
