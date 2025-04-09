import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  
  passwordForm!: FormGroup;
  loading = false;
  submitted = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  
  // Custom validator for password matching
  passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      g.get('confirmPassword')?.setErrors({ 'matching': true });
    }
    
    return null;
  }
  
  // Convenience getter for form fields
  get f() { return this.passwordForm.controls; }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.passwordForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    this.userService.updatePassword(
      this.userId,
      this.f['currentPassword'].value,
      this.f['newPassword'].value
    ).subscribe({
      next: () => {
        this.loading = false;
        this.passwordForm.reset();
        this.submitted = false;
        this.passwordUpdated.emit('Password updated successfully!');
      },
      error: (err) => {
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