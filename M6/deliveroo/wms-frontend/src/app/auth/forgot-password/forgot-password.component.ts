import { Component, inject, signal, output, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Heading2Component } from '../../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, Heading2Component],
  template: `
    <div class="flex items-center justify-center min-h-[400px]">
      <div class="card p-8 w-full max-w-md bg-white rounded-lg shadow-lg animate-fade-in">
        <div class="text-center mb-8">
          <div class="mx-auto h-16 w-16 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
            <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <ui-heading2 class="text-neutral-800">Forgot Password</ui-heading2>
          <p class="mt-2 text-neutral-600">Enter your email and we'll send you a reset link</p>
        </div>

        @if (submitted()) {
          <div class="bg-success-50 text-success-500 p-4 rounded-md mb-6 animate-fade-in">
            <p class="text-center font-medium">Reset link sent!</p>
            <p class="text-center text-sm mt-2">If an account exists with this email, you will receive password reset instructions.</p>
          </div>

          <div class="text-center mt-6">
            <button (click)="onBackToLogin()" class="btn btn-primary w-full">
              Return to Login
            </button>
          </div>
        } @else {
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                class="input mt-1"
                autocomplete="email" 
                [class.border-error-500]="isFieldInvalid('email')" />
              @if (isFieldInvalid('email')) {
                <p class="mt-1 text-sm text-error-500">Please enter a valid email address</p>
              }
            </div>
            <div>
              <button 
                type="submit" 
                [disabled]="isLoading() || !forgotPasswordForm.valid"
                class="btn btn-primary w-full py-3 flex justify-center items-center">
                @if (isLoading()) {
                  <span class="mr-2">
                    <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  </span>
                }
                Send Reset Link
              </button>
            </div>
            <div class="text-center mt-4">
              <a (click)="onBackToLogin()" class="cursor-pointer text-primary-500 hover:text-primary-600 transition-colors">
                Back to Login
              </a>
            </div>
          </form>
        }
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  forgotPasswordForm: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  submitted: WritableSignal<boolean> = signal(false);

  backToLogin = output<void>();

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const formControl = this.forgotPasswordForm.get(field);
    return formControl !== null && formControl.invalid && (formControl.dirty || formControl.touched);
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);
      const email = this.forgotPasswordForm.get('email')?.value;
      this.authService.forgotPassword(email).subscribe(() => {
        this.isLoading.set(false);
        this.submitted.set(true);
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  onBackToLogin(): void {
    this.backToLogin.emit();
  }
}