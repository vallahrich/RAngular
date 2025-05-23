import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Auth interceptor to add authorization headers to outgoing requests
 * and handle unauthorized responses
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Skip adding auth header for login/register requests
  if (req.url.includes('/api/user/login') || 
      req.url.includes('/api/user/register')) {
    return next(req);
  }
  
  // Get auth header from localStorage
  const authHeader = localStorage.getItem('authHeader');
  
  // If auth header exists, add it to the request
  if (authHeader) {
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', authHeader)
    });
    
    // Forward the modified request and handle errors
    return next(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          // Clear auth data
          localStorage.removeItem('authHeader');
          localStorage.removeItem('currentUser');
          
          // Redirect to login
          router.navigate(['/auth'], { 
            queryParams: { unauthorized: true }
          });
        }
        
        return throwError(() => error);
      })
    );
  }
  
  // If no auth header, just forward the request as is
  return next(req);
};