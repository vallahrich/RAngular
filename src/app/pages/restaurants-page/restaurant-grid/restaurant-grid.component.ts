import { Component, Input } from '@angular/core';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-grid',
  templateUrl: './restaurant-grid.component.html',
  styleUrls: ['./restaurant-grid.component.css']
})
export class RestaurantGridComponent {
  @Input() restaurants: Restaurant[] = [];
  
  getPriceRange(priceRange: string): string {
    switch(priceRange) {
      case 'L': return '$';
      case 'M': return '$$';
      case 'H': return '$$$';
      default: return '$';
    }
  }
}