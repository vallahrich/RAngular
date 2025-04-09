import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Review } from '../../../../models/review.model';
import { ReviewService } from '../../../../services/review.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  @Input() restaurantId!: number;
  @Input() review: Review | null = null;
  @Output() reviewSubmitted = new EventEmitter<Review>();
  @Output() canceled = new EventEmitter<void>();
  
  reviewForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  
  get isEditing(): boolean {
    return !!this.review;
  }
  
  get currentUserId(): number {
    return this.authService.currentUserValue?.userId ?? 0;
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.maxLength(1000)]
    });
    
    if (this.review) {
      this.reviewForm.patchValue({
        rating: this.review.rating,
        comment: this.review.comment
      });
    }
  }