import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HomePageComponent } from './home-page.component';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let restaurantServiceSpy: jasmine.SpyObj<RestaurantService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const restSpy = jasmine.createSpyObj('RestaurantService', ['getAllRestaurants']);
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomePageComponent],
      providers: [
        { provide: RestaurantService, useValue: restSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    restaurantServiceSpy = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    restaurantServiceSpy.getAllRestaurants.and.returnValue(of([]));
    authServiceSpy.isLoggedIn.and.returnValue(false);
    
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});