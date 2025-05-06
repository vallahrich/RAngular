import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf, DatePipe } from '@angular/common';

import { Review } from '../../../models/review.model';

@Component({
  selector: 'app-review-item',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    NgIf,
    DatePipe
  ],
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