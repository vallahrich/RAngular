import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Review } from '../../../models/review.model';

@Component({
  selector: 'app-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.css']
})
export class ReviewItemComponent {
  @Input() review!: Review;
  @Input() isOwnReview = false;
  @Output() editReview = new EventEmitter<Review>();
  @Output() deleteReview = new EventEmitter<Review>();
  
  getRatingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
  
  onEdit(): void {
    this.editReview.emit(this.review);
  }
  
  onDelete(): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.deleteReview.emit(this.review);
    }
  }
}
