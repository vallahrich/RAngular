import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatTabsModule,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent {
  showLogin = true;
  returnUrl: string | null = null;
  
  constructor(private route: ActivatedRoute) {
    // Get return URL from route parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }
  
  tabChanged(index: number): void {
    this.showLogin = index === 0;
  }
}