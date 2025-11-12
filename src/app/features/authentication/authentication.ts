import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { saveLoginData } from '../../store/auth/auth.action';
import { BASE_URL } from '../../shared/app-constants';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  private store = inject(Store);

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

  private async postJson(url: string, body: any) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  }

  protected async submitLogin() {
    this.error = this.success = null;
    if (!this.loginModel.username.trim() || !this.loginModel.password) {
      this.error = 'Please enter username and password.';
      return;
    }
    this.loading = true;
    try {
      const url = `${BASE_URL}/users/login`;
      const { ok, data } = await this.postJson(url, this.loginModel);
      if (!ok) {
        this.error = (data && (data.message || data.error)) || 'Login failed';
        return;
      }
      // Dispatch login data to NgRx store
      this.store.dispatch(saveLoginData({ loginData: data }));
      this.success = 'Login successful.';
    } catch (e: any) {
      this.error = e?.message || String(e);
    } finally {
      this.loading = false;
    }
  }

  protected async submitRegister() {
    this.error = this.success = null;
    if (!this.registerModel.username.trim() || !this.registerModel.email.trim() || !this.registerModel.password) {
      this.error = 'Please complete username, email and password.';
      return;
    }
    this.loading = true;
    try {
      const url = `${BASE_URL}/users/register`;
      const { ok, data } = await this.postJson(url, this.registerModel);
      if (!ok) {
        this.error = (data && (data.message || data.error)) || 'Registration failed';
        return;
      }
      this.success = 'Registration successful. You can now log in.';
      // Optionally prefill login fields
      this.loginModel.username = this.registerModel.username;
      this.mode = 'login';
    } catch (e: any) {
      this.error = e?.message || String(e);
    } finally {
      this.loading = false;
    }
  }
}
