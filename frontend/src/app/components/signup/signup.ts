import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
})
export class SignupComponent {
  signupForm: FormGroup;
  successMessage = '';
  errorMessage = '';
    private apiUrl = 'http://[::1]:4000/api/auth/register';


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.http.post(this.apiUrl, this.signupForm.value).subscribe({
        next: () => {
          this.successMessage = 'Account created successfully!';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err.error?.message || 'Signup failed. Try again.';
        },
      });
    }
  }
}
