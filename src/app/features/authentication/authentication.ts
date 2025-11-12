import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-authentication',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  protected mode: number = 0; // 0 for login, 1 for register
  protected loading = false;
  protected loginForm!: FormGroup;
  protected registerForm!: FormGroup;
  protected hideLoginPassword = true;
  protected hideRegisterPassword = true;
  protected hideConfirmPassword = true;

  constructor() {
    this.initializeForms();
  }

  private initializeForms() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['USER', Validators.required],
    });
  }

  protected toggleMode(m: number) {
    this.mode = m;
  }

  protected submitLogin() {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please fill in all fields correctly.', 'Close', { duration: 3000 });
      return;
    }
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('Login successful!', 'Close', { duration: 2000 });
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        const errorMsg = (err && (err.error?.message || err.error?.error)) || 'Login failed';
        this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  protected submitRegister() {
    if (this.registerForm.invalid) {
      this.snackBar.open('Please fill in all fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      this.snackBar.open('Passwords do not match.', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const formValue = this.registerForm.value;
    const registerData = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.snackBar.open('Registration successful! Please log in.', 'Close', { duration: 3000 });
        this.loginForm.patchValue({ username: formValue.username });
        this.mode = 0; // Switch to login mode
        this.registerForm.reset();
        this.loading = false;
      },
      error: (err) => {
        const errorMsg = (err && (err.error?.message || err.error?.error)) || 'Registration failed';
        this.snackBar.open(errorMsg, 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  protected toggleLoginPasswordVisibility() {
    this.hideLoginPassword = !this.hideLoginPassword;
  }

  protected toggleRegisterPasswordVisibility() {
    this.hideRegisterPassword = !this.hideRegisterPassword;
  }

  protected toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
