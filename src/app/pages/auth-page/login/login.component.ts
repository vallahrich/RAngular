import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.currentUserValue) { 
      this.router.navigate(['/']);
    }
  }
  
  onSubmit(): void {
    // Check if form is available and valid
    if (!this.loginForm || !this.loginForm.valid) {
      return;
    }

    this.loading = true;
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