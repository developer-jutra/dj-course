import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import { of, throwError, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthResponse, LoginCredentials } from './auth.model';
import { UserProfile, UserRole } from '../features/user-management/user.model';
import { MOCK_USERS } from '../mock/users.mock';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: WritableSignal<UserProfile | null> = signal(null);

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const user = MOCK_USERS[credentials.username];
    
    if (user && credentials.password === 'password') {
      const authResponse: AuthResponse = {
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: user,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', authResponse.token);
      this.currentUser.set(user);

      return of(authResponse).pipe(delay(500));
    }

    return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
  }

  forgotPassword(email: string): Observable<void> {
    // Note: In a real app, this would trigger a password reset email flow.
    // Here, we just simulate the process.
    const userExists = Object.values(MOCK_USERS).some(user => user.email === email);
    
    // To prevent email enumeration attacks, the service should always return a successful response.
    console.log(`Password reset requested for ${email}. User exists: ${userExists}`);
    
    return of(undefined).pipe(delay(1000));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  isAuthenticated = computed(() => this.currentUser() !== null);

  hasRole(roleName: string): boolean {
    const user = this.currentUser();
    return user?.role.some((role) => role.roleName === roleName) || false;
  }

  hasPermission(resource: string, action: string): boolean {
    // Simplified permission check - in real app, this would check against actual permissions
    return this.isAuthenticated();
  }
}