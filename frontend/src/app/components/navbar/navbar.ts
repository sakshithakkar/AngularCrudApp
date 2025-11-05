import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark px-3 d-flex justify-content-between align-items-center">
      <div>
        <a class="navbar-brand text-light" routerLink="/users">User CRUD</a>
        <a class="nav-link text-light d-inline-block" routerLink="/categories">Categories</a>
        <a class="nav-link text-light d-inline-block" routerLink="/products">Products</a>
      </div>

      <div class="text-light d-flex align-items-center gap-3" *ngIf="user">
        <span>{{ user.email }}</span>
        <button class="btn btn-outline-light btn-sm" (click)="logout()">Logout</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.user$.subscribe((user : any) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
