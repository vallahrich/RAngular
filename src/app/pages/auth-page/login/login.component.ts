import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
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
    
    // Pre-populate with standard credentials from Lecture 9
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