import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  @Input() user!: User;
  @Output() profileUpdated = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  
  profileForm!: FormGroup;
  loading = false;
  submitted = false;
  isEditing = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      username: [this.user.username, [Validators.required, Validators.minLength(3)]]
    });
  }
  
  // Convenience getter for form fields
  get f() { return this.profileForm.controls; }
  
  startEditing(): void {
    this.isEditing = true;
  }
  
  cancelEditing(): void {
    this.isEditing = false;
    this.profileForm.patchValue({
      username: this.user.username
    });
    this.submitted = false;
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.profileForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const updatedUser: User = {
      ...this.user,
      username: this.f['username'].value
    };
    
    this.userService.updateUser(updatedUser).subscribe({
      next: (data) => {
        // Update local storage and current user
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          const updatedCurrentUser = {
            ...currentUser,
            username: data.username
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
          // Force refresh of the user in the auth service
          this.authService.logout();
          this.authService.login(data.username, this.user.passwordHash).subscribe();
        }
        
        this.loading = false;
        this.isEditing = false;
        this.profileUpdated.emit('Profile updated successfully!');
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.error.emit('Username is already taken.');
        } else {
          this.error.emit('Failed to update profile. Please try again.');
        }
        console.error('Error updating profile:', err);
      }
    });
  }
  
  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.loading = true;
      this.userService.deleteUser(this.user.userId).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          this.error.emit('Failed to delete account. Please try again.');
          console.error('Error deleting account:', err);
        }
      });
    }
  }
}