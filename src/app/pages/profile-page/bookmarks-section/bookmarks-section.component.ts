import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Restaurant } from '../../../models/restaurant.model';
import { BookmarkService } from '../../../services/bookmark.service';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

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
  
  constructor(
    private bookmarkService: BookmarkService,
    private dialog: MatDialog
  ) {}
  
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
    const restaurant = this.bookmarkedRestaurants.find(r => r.restaurantId === restaurantId);
    
    if (!restaurant) return;
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Remove Bookmark',
        message: `Are you sure you want to remove "${restaurant.name}" from your bookmarks?`,
        confirmText: 'Remove',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
    });
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