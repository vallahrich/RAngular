import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from 'src/environments/enviroment';

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

  /**
   * Returns the Authorization header value for Basic Authentication
   * Format: "Basic <base64-encoded-username-password>"
   */
  public get authHeader(): string {
    // If no user is logged in, return empty string
    if (!this.currentUserValue) {
      return '';
    }

    // Otherwise, create the Basic Authentication header
    // Format is "username:password" encoded in base64
    const username = this.currentUserValue.username;
    const password = this.currentUserValue.passwordHash; // In real app, we wouldn't store passwords
    
    // Encode the credentials in base64
    const credentials = `${username}:${password}`;
    const base64Credentials = btoa(credentials);
    
    // Return the full header value
    return `Basic ${base64Credentials}`;
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  login(username: string, password: string): Observable<User> {
    // Create headers with Basic Authentication for the login request
    const credentials = `${username}:${password}`;
    const base64Credentials = btoa(credentials);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${base64Credentials}`
    });

    // Use the [AllowAnonymous] endpoint to authenticate
    return this.http.post<User>(`${this.apiUrl}/login`, 
      { username, passwordHash: password },
      { headers }
    ).pipe(
      tap(user => {
        // Store user details in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    // For registration, we also need to use Basic Authentication
    const credentials = `${username}:${password}`;
    const base64Credentials = btoa(credentials);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${base64Credentials}`
    });

    return this.http.post<User>(`${this.apiUrl}/register`, {
      username,
      email,
      passwordHash: password
    }, { headers });
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