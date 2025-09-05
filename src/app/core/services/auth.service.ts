import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://dummyjson.com/auth';

  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) { }


  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((user: User) => {
        if (user.accessToken && user.refreshToken) {
          localStorage.setItem(this.accessTokenKey, user.accessToken);
          localStorage.setItem(this.refreshTokenKey, user.refreshToken);
        }
      })
    );
  }

  refreshToken(): Observable<{ accessToken: string, refreshToken: string }> {
    const currentRefreshToken = this.getRefreshToken();

    if (!currentRefreshToken) {
      this.logout();
      return throwError(() => new Error('No se encontró refresh token.'));
    }

    return this.http.post<{ accessToken: string, refreshToken: string }>(`${this.apiUrl}/refresh`, {
      refreshToken: currentRefreshToken
    }).pipe(
      tap((tokens) => {
        localStorage.setItem(this.accessTokenKey, tokens.accessToken);
        localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}