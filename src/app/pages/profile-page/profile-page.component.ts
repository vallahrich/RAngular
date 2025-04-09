import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: User | null = null;
  successMessage = '';
  errorMessage = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['/auth']);
    }
  }
  
  onProfileUpdated(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    
    // Refresh user data
    this.user = this.authService.currentUserValue;
  }
  
  onError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }
}