import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
  readonly signupForm = this.formBuilder.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/[a-z]/),
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/[^A-Za-z0-9]/)
    ]],
    terms: [false, [Validators.requiredTrue]]
  });

  isSubmitting = false;
  errorMessage = '';
  errorDetails: string[] = [];
  successMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authApi: AuthApiService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    AOS.init({
      duration: 1000,
      once: true
    });

    this.signupForm.valueChanges.subscribe(() => {
      if (this.errorMessage || this.errorDetails.length) {
        this.errorMessage = '';
        this.errorDetails = [];
      }
    });
  }

  get fullNameControl() {
    return this.signupForm.controls.fullName;
  }

  get emailControl() {
    return this.signupForm.controls.email;
  }

  get passwordControl() {
    return this.signupForm.controls.password;
  }

  get passwordRulesErrors(): string[] {
    const control = this.passwordControl;
    if (!control.touched || !control.errors) {
      return [];
    }

    const errors: string[] = [];
    if (control.errors['minlength']) {
      errors.push('كلمة المرور لازم تكون 8 أحرف على الأقل.');
    }
    if (control.errors['pattern']) {
      const value = String(control.value || '');
      if (!/[a-z]/.test(value)) {
        errors.push('لازم تحتوي على حرف صغير واحد على الأقل (a-z).');
      }
      if (!/[A-Z]/.test(value)) {
        errors.push('لازم تحتوي على حرف كبير واحد على الأقل (A-Z).');
      }
      if (!/[^A-Za-z0-9]/.test(value)) {
        errors.push('لازم تحتوي على رمز خاص واحد على الأقل (مثل !@#$).');
      }
    }

    return errors;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.errorDetails = [];
    this.successMessage = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.signupForm.getRawValue();

    this.isSubmitting = true;

    this.authApi.register({
      fullName: fullName?.trim() || '',
      email: email?.trim() || '',
      password: password || ''
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'تم إنشاء الحساب بنجاح. جاري تحويلك لتسجيل الدخول...';
        this.signupForm.reset({ terms: false });
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (error) => {
        this.isSubmitting = false;
        const apiErrors = error?.error?.errors;
        const apiMessage = error?.error?.message || error?.error?.title;
        this.errorMessage = apiMessage || 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.';
        this.errorDetails = Array.isArray(apiErrors)
          ? apiErrors.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
          : [];
      }
    });
  }
}
