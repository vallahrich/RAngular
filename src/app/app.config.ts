import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { RestaurantsPageComponent } from './pages/restaurants-page/restaurant-page.component';
import { RestaurantDetailPageComponent } from './pages/restaurant-detail-page/restaurant-detail-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AuthGuard } from './guards/auth.guard';

// Define routes here instead of importing from app-routing.module.ts
const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'restaurants', component: RestaurantsPageComponent },
  { path: 'restaurant/:id', component: RestaurantDetailPageComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
  // Redirect any unmatched routes to home
  { path: '**', redirectTo: '' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient()]
};