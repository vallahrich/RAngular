import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { environment } from 'src/enviroments/enviroment';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  login(username: string, password: string): Observable<User> {
    // In a real app, you would hash the password before sending
    const request: LoginRequest = { username, passwordHash: password };
    
    return this.http.post<User>(`${this.apiUrl}/login`, request).pipe(
      tap(user => {
        // Store user details and jwt token in local storage to keep user logged in
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    // In a real app, you would hash the password before sending
    const request: RegisterRequest = {
      username,
      email,
      passwordHash: password
    };
    
    return this.http.post<User>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}