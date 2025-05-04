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

  public get authHeader(): string {
    return localStorage.getItem('authHeader') || '';
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  private createBasicAuthHeader(username: string, password: string): string {
    const credentials = `${username}:${password}`;
    const base64Credentials = btoa(credentials);
    return `Basic ${base64Credentials}`;
  }

  login(username: string, password: string): Observable<User> {
    // Create Basic Auth header for all future requests
    const authHeader = this.createBasicAuthHeader(username, password);
    
    // Make login request with the auth header
    const headers = new HttpHeaders({
      'Authorization': authHeader
    });

    return this.http.post<any>(`${this.apiUrl}/login`, 
      { username, passwordHash: password },
      { headers }
    ).pipe(
      tap(user => {
        // Store user details and auth header in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('authHeader', authHeader);
        this.currentUserSubject.next(user);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, {
      username,
      email,
      passwordHash: password
    });
  }

  logout(): void {
    // Remove user and auth header from local storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authHeader');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}