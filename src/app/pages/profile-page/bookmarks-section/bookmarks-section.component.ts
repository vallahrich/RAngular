import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Restaurant } from '../../../models/restaurant.model';
import { BookmarkService } from '../../../services/bookmark.service';

@Component({
  selector: 'app-bookmarks-section',
  templateUrl: './bookmarks-section.component.html',
  styleUrls: ['./bookmarks-section.component.css']
})
export class BookmarksSectionComponent implements OnInit {
  @Input() userId!: number;
  @Output() error = new EventEmitter<string>();
  
  bookmarkedRestaurants: Restaurant[] = [];
  loading = true;
  
  constructor(private bookmarkService: BookmarkService) {}
  
  ngOnInit(): void {
    this.loadBookmarkedRestaurants();
  }
  
  loadBookmarkedRestaurants(): void {
    this.loading = true;
    this.bookmarkService.getBookmarkedRestaurants(this.userId).subscribe({
      next: (data) => {
        this.bookmarkedRestaurants = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error.emit('Failed to load bookmarked restaurants.');
        console.error('Error loading bookmarks:', err);
      }
    });
  }
  
  removeBookmark(restaurantId: number): void {
    if (confirm('Are you sure you want to remove this bookmark?')) {
      this.bookmarkService.removeBookmark(this.userId, restaurantId).subscribe({
        next: () => {
          this.bookmarkedRestaurants = this.bookmarkedRestaurants.filter(
            r => r.restaurantId !== restaurantId
          );
        },
        error: (err) => {
          this.error.emit('Failed to remove bookmark. Please try again.');
          console.error('Error removing bookmark:', err);
        }
      });
    }
  }
  
  getPriceRange(priceRange: string): string {
    switch(priceRange) {
      case 'L': return '$';
      case 'M': return '$$';
      case 'H': return '$$$';
      default: return '$';
    }
  }
}