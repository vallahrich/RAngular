import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * This interceptor adds the Authorization header with Basic Authentication
 * to all outgoing HTTP requests except login/register requests
 * which already have their own authorization headers
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip if request is to login or register endpoints (they have their own auth headers)
    if (request.url.includes('/login') || request.url.includes('/register')) {
      return next.handle(request);
    }

    // Get the auth header from the service
    const authHeader = this.authService.authHeader;
    
    // If we have an auth header, add it to the request
    if (authHeader) {
      // Clone the request and add the new header
      const authReq = request.clone({
        headers: request.headers.set('Authorization', authHeader)
      });
      
      // Pass the cloned request to the next handler
      return next.handle(authReq);
    }
    
    // If no auth header, pass the original request through
    return next.handle(request);
  }
}