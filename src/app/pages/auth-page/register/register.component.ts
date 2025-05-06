/**
 * Register Component
 *
 * Manages new user registration through a form interface.
 * Handles form state, validation, and registration API calls.
 *
 * Key features:
 * - Input validation for username, email, and password
 * - Password strength requirements enforcement
 * - Password confirmation matching validation
 * - Loading state management during registration
 * - Success/failure messaging
 * - Automatically redirects to login view after successful registration
 * - Emits completion event to parent component for tab switching
 */
import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// Add these Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @Output() registered = new EventEmitter<boolean>();
  @ViewChild('registerForm') registerForm!: NgForm;
  
  // Model for two-way binding
  registerModel = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  loading = false;
  error = '';
  success = '';
  hidePassword = true;
  hideConfirmPassword = true;
  passwordsNotMatching = false;
  
  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    // Initialize if needed
  }
  
  checkPasswordMatch(): void {
    this.passwordsNotMatching = 
      this.registerModel.password !== this.registerModel.confirmPassword &&
      this.registerModel.confirmPassword.length > 0;
  }
  
  onSubmit(): void {
    // Check if form is available and valid
    if (!this.registerForm || !this.registerForm.valid) {
      return;
    }
    
    // Check password match manually
    if (this.registerModel.password !== this.registerModel.confirmPassword) {
      this.passwordsNotMatching = true;
      return;
    }

    this.loading = true;
    this.authService.register(
      this.registerModel.username,
      this.registerModel.email,
      this.registerModel.password
    ).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful! You can now login.';
        this.error = '';
        
        // Notify parent component to switch to login view
        setTimeout(() => {
          this.registered.emit(true);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.error = 'Username or email already exists.';
        } else {
          this.error = 'Registration failed. Please try again.';
        }
        this.loading = false;
        this.success = '';
      }
    });
  }
}