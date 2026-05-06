import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { AuthApiService } from '../../core/services/auth-api.service';
import { CartApiService } from '../../core/services/cart-api.service';

interface LoginApiResponse {
  token?: string;
  userId?: string;
  userID?: string;
  userid?: string;
  userName?: string;
  email?: string;
  data?: {
    token?: string;
    userId?: string;
    userID?: string;
    userid?: string;
    userName?: string;
    email?: string;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });

  isSubmitting = false;
  errorMessage = '';
  errorDetails: string[] = [];
  successMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authApi: AuthApiService,
    private readonly cartApi: CartApiService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    AOS.init({
      duration: 1000,
      once: true
    });

    this.loginForm.valueChanges.subscribe(() => {
      if (this.errorMessage || this.errorDetails.length) {
        this.errorMessage = '';
        this.errorDetails = [];
      }
    });
  }

  get emailControl() {
    return this.loginForm.controls.email;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.errorDetails = [];
    this.successMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.isSubmitting = true;

    this.authApi.login({
      email: email?.trim() || '',
      password: password || ''
    }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        const loginData = this.extractLoginData(response);
        if (!loginData.token) {
          this.errorMessage = 'تم تسجيل الدخول لكن لم يتم استلام token من الخادم.';
          return;
        }

        this.persistAuthData(loginData);
        this.cartApi.refreshCartCount(this.cartApi.getCurrentUserId());
        this.successMessage = 'تم تسجيل الدخول بنجاح. جاري تحويلك...';
        setTimeout(() => this.router.navigate(['/']), 900);
      },
      error: (error) => {
        this.isSubmitting = false;
        const apiErrors = error?.error?.errors;
        const apiMessage = error?.error?.message || error?.error?.title;
        this.errorMessage = apiMessage || 'فشل تسجيل الدخول. تأكد من البيانات وحاول مرة أخرى.';
        this.errorDetails = Array.isArray(apiErrors)
          ? apiErrors.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
          : [];
      }
    });
  }

  private extractLoginData(response: unknown): Required<Pick<LoginApiResponse, 'token'>> & Omit<LoginApiResponse, 'data' | 'token'> {
    const payload = (response ?? {}) as LoginApiResponse;
    const nested = payload.data ?? {};

    return {
      token: payload.token || nested.token || '',
      userId: payload.userId || payload.userID || payload.userid || nested.userId || nested.userID || nested.userid,
      userName: payload.userName || nested.userName,
      email: payload.email || nested.email
    };
  }

  private persistAuthData(loginData: { token: string; userId?: string; userName?: string; email?: string }): void {
    localStorage.setItem('auth_token', loginData.token);

    const user = {
      userId: loginData.userId || '',
      userName: loginData.userName || '',
      email: loginData.email || ''
    };
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
}
