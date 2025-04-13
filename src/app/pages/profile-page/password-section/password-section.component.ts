import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-password-section',
  templateUrl: './password-section.component.html',
  styleUrls: ['./password-section.component.css']
})
export class PasswordSectionComponent implements OnInit {
  @Input() userId!: number;
  @Output() passwordUpdated = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  @ViewChild('passwordForm') passwordForm!: NgForm;
  
  // Model for two-way binding
  passwordModel = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  loading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  passwordsNotMatching = false;
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    // Initialize if needed
  }
  
  checkPasswordMatch(): void {
    this.passwordsNotMatching = 
      this.passwordModel.newPassword !== this.passwordModel.confirmPassword &&
      this.passwordModel.confirmPassword.length > 0;
  }
  
  onSubmit(): void {
    // Check if form is available and valid
    if (!this.passwordForm || !this.passwordForm.valid || this.passwordsNotMatching) {
      return;
    }
    
    this.loading = true;
    
    this.userService.updatePassword(
      this.userId,
      this.passwordModel.currentPassword,
      this.passwordModel.newPassword
    ).subscribe({
      next: () => {
        this.loading = false;
        // Reset form
        this.passwordModel = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        // Reset form state
        if (this.passwordForm) {
          this.passwordForm.resetForm();
        }
        this.passwordUpdated.emit('Password updated successfully!');
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 400) {
          this.error.emit('Current password is incorrect.');
        } else {
          this.error.emit('Failed to update password. Please try again.');
        }
        console.error('Error updating password:', err);
      }
    });
  }
}