import { Injectable } from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly refreshUrl = `${environment.apiBaseUrl || ''}/auth/refresh`;
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private httpNoInterceptor: HttpClient;

  constructor(private httpBackend: HttpBackend) {
    this.httpNoInterceptor = new HttpClient(httpBackend);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthRefreshRequest = req.url.includes('/auth/refresh');
    const token = localStorage.getItem('authToken');

    let authReq = req.clone({ withCredentials: true });
    if (token && !isAuthRefreshRequest) {
      authReq = authReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401 || isAuthRefreshRequest || !token) {
          return throwError(() => error);
        }

        return this.handle401Error(authReq, next);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((newToken): newToken is string => !!newToken),
        take(1),
        switchMap(newToken => {
          const retryReq = req.clone({
            withCredentials: true,
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });
          return next.handle(retryReq);
        })
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.httpNoInterceptor.post<any>(this.refreshUrl, {}, { withCredentials: true }).pipe(
      switchMap(response => {
        const payload = response?.data ?? response ?? {};
        const newToken = payload.token ?? payload.accessToken ?? '';
        if (!newToken) {
          throw new Error('Missing access token from refresh response');
        }

        localStorage.setItem('authToken', newToken);
        this.refreshTokenSubject.next(newToken);

        const retryReq = req.clone({
          withCredentials: true,
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          }
        });
        return next.handle(retryReq);
      }),
      catchError(refreshError => {
        this.clearAuthStorage();
        return throwError(() => refreshError);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private clearAuthStorage(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authUserName');
    localStorage.removeItem('authRole');
    localStorage.removeItem('authUserId');
  }
}
