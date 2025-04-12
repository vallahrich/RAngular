import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth-page',
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