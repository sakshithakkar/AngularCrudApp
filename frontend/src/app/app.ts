// import { Component } from '@angular/core';
// import { RouterOutlet, RouterModule, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from './services/auth.service'; // adjust path as needed

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class App {}

