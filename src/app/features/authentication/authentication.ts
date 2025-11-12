import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  private authService = inject(AuthService);
  private router = inject(Router);

  // mode: 'login' or 'register'
  protected mode: 'login' | 'register' = 'login';
  protected loading = false;
  protected error: string | null = null;
  protected success: string | null = null;

  protected loginModel = { username: '', password: '' };
  protected registerModel = { username: '', email: '', password: '', role: 'USER' };

  protected toggleMode(m: 'login' | 'register') {
    this.mode = m;
    this.error = null;
    this.success = null;
  }

  protected submitLogin() {
    this.error = this.success = null;
    if (!this.loginModel.username.trim() || !this.loginModel.password) {
      this.error = 'Please enter username and password.';
      return;
    }
    this.loading = true;
    this.authService.login(this.loginModel).subscribe({
      next: () => {
        this.success = 'Login successful.';
        this.loading = false;
        // Redirect to home page after successful login
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = (err && (err.error?.message || err.error?.error)) || 'Login failed';
        this.loading = false;
      },
    });
  }

  protected submitRegister() {
    this.error = this.success = null;
    if (!this.registerModel.username.trim() || !this.registerModel.email.trim() || !this.registerModel.password) {
      this.error = 'Please complete username, email and password.';
      return;
    }
    this.loading = true;
    this.authService.register(this.registerModel).subscribe({
      next: () => {
        this.success = 'Registration successful. You can now log in.';
        // Optionally prefill login fields
        this.loginModel.username = this.registerModel.username;
        this.mode = 'login';
        this.loading = false;
      },
      error: (err) => {
        this.error = (err && (err.error?.message || err.error?.error)) || 'Registration failed';
        this.loading = false;
      },
    });
  }
}
