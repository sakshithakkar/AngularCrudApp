import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  private apiUrl = 'http://[::1]:4000/api/auth/login'; // update if needed

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.http.post<any>(this.apiUrl, this.loginForm.value).subscribe({
        next: (res) => {
          // Save token and user
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          this.authService.setUser(res.user);
          this.authService.setToken(res.token);

          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Invalid email or password.';
        },
      });
    }
  }
}
