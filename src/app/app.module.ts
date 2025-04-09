import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Shared Components
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RestaurantCardComponent } from './shared/ui/restaurant-card/restaurant-card.component';
import { ReviewItemComponent } from './shared/ui/review-item/review-item.component';

// Page Components
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { LoginComponent } from './pages/auth-page/login/login.component';
import { RegisterComponent } from './pages/auth-page/register/register.component';
import { RestaurantsPageComponent } from './pages/restaurants-page/restaurants-page.component';
import { FilterBarComponent } from './pages/restaurants-page/filter-bar/filter-bar.component';
import { RestaurantDetailPageComponent } from './pages/restaurant-detail-page/restaurant-detail-page.component';
import { RestaurantInfoComponent } from './pages/restaurant-detail-page/restaurant-info/restaurant-info.component';
import { ReviewSectionComponent } from './pages/restaurant-detail-page/review-section/review-section.component';
import { ReviewFormComponent } from './pages/restaurant-detail-page/review-section/review-form/review-form.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ProfileInfoComponent } from './pages/profile-page/profile-info/profile-info.component';
import { PasswordSectionComponent } from './pages/profile-page/password-section/password-section.component';
import { BookmarksSectionComponent } from './pages/profile-page/bookmarks-section/bookmarks-section.component';

@NgModule({
  declarations: [
    AppComponent,
    // Shared Components
    HeaderComponent,
    FooterComponent,
    RestaurantCardComponent,
    ReviewItemComponent,
    // Page Components
    HomePageComponent,
    AuthPageComponent,
    LoginComponent,
    RegisterComponent,
    RestaurantsPageComponent,
    FilterBarComponent,
    RestaurantDetailPageComponent,
    RestaurantInfoComponent,
    ReviewSectionComponent,
    ReviewFormComponent,
    ProfilePageComponent,
    ProfileInfoComponent,
    PasswordSectionComponent,
    BookmarksSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }