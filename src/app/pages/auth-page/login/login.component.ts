import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() returnUrl: string | null = '/';
  @ViewChild('loginForm') loginForm!: NgForm;
  
  // Model for two-way binding
  loginModel = {
    username: '',
    password: ''
  };
  
  loading = false;
  error = '';
  hidePassword = true;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.currentUserValue) { 
      this.router.navigate(['/']);
    }
    
    // Check if redirected due to unauthorized access
    this.route.queryParams.subscribe(params => {
      if (params['unauthorized']) {
        this.error = 'Session expired or unauthorized access. Please login again.';
      }
    });
    
    // Pre-populate with standard credentials
    this.loginModel.username = 'john.doe';
    this.loginModel.password = 'VerySecret!';
  }
  
  onSubmit(): void {
    // Check if form is available and valid
    if (!this.loginForm || !this.loginForm.valid) {
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.authService.login(
      this.loginModel.username,
      this.loginModel.password
    ).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl || '/']);
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.status === 401 
          ? 'Invalid username or password' 
          : 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}