import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  private getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUser() {
    return this.userSubject.value;
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
