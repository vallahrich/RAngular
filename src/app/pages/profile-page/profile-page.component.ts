import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: User | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.user = this.authService.currentUserValue;
    
    if (!this.user) {
      this.router.navigate(['/auth']);
      return;
    }
    
    // Get fresh user data from the API
    this.userService.getUserById(this.user.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user data. Please try again.';
        this.loading = false;
        console.error('Error loading user data:', error);
        
        // If we can't load user data, we'll fall back to the stored user info
        this.user = this.authService.currentUserValue;
      }
    });
  }
  
  onProfileUpdated(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    
    // Refresh user data
    this.user = this.authService.currentUserValue;
    
    // Scroll to top to show the success message
    window.scrollTo(0, 0);
    
    // Auto-dismiss the message after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
  
  onError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    
    // Scroll to top to show the error message
    window.scrollTo(0, 0);
  }
}