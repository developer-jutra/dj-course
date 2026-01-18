import { Component, effect, ElementRef, inject, signal, viewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { Heading2Component, Heading4Component } from '../ui-library/Typography/Typography.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ForgotPasswordComponent, Heading2Component, Heading4Component],
  template: `
    <div class="relative min-h-screen">
      <video
        #videoPlayer
        class="absolute top-0 left-0 z-0 h-full w-full object-cover"
        autoplay
        loop
        muted
        playsinline
      >
        <source src="assets/deliveroo-background.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-black/75"></div>
      <div class="relative z-10 flex min-h-screen items-center justify-center p-4">
        @if (showForgotPassword()) {
          <div
            class="w-full max-w-md rounded-xl border border-white/10 bg-blue-950/50 p-8 text-white shadow-2xl backdrop-blur-lg"
          >
            <app-forgot-password (backToLogin)="showForgotPassword.set(false)"></app-forgot-password>
          </div>
        } @else {
          <div
            class="w-full max-w-md space-y-8 rounded-xl border border-white/10 bg-blue-950/50 p-8 text-white shadow-2xl backdrop-blur-lg"
          >
            <div class="text-center">
              <img src="assets/deliveroo-logo.png" alt="Deliveroo Logo" class="mx-auto mb-4 h-24" />
              <ui-heading2>Warehouse Management System</ui-heading2>
              <p class="mt-2">Sign in to your account</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="space-y-6">
                <div>
                  <label for="username" class="block text-sm font-medium"> Username </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    formControlName="username"
                    class="input mt-1"
                    placeholder="Enter your username"
                  />
                  @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                    <div class="mt-1 text-sm text-error-400">Username is required</div>
                  }
                </div>

                <div>
                  <label for="password" class="block text-sm font-medium"> Password </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    formControlName="password"
                    class="input mt-1"
                    placeholder="Enter your password"
                  />
                  @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                    <div class="mt-1 text-sm text-error-400">Password is required</div>
                  }
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      formControlName="rememberMe"
                      class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label for="remember-me" class="ml-2 block text-sm"> Remember me </label>
                  </div>
                  <div class="text-sm">
                    <a
                      (click)="showForgotPassword.set(true)"
                      class="cursor-pointer font-medium text-primary-400 hover:text-primary-300"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                @if (error()) {
                  <div class="text-center text-sm text-error-400">
                    {{ error() }}
                  </div>
                }

                <button type="submit" [disabled]="loginForm.invalid || loading()" class="btn btn-primary w-full">
                  @if (loading()) {
                    <span class="mr-2 inline-block h-4 w-4 animate-spin">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  }
                  {{ loading() ? 'Signing in...' : 'Sign in' }}
                </button>
              </div>
            </form>

            <div class="mt-6 rounded-lg bg-black/20 p-4">
              <ui-heading4 class="mb-2">Demo Credentials:</ui-heading4>
              <div class="space-y-1 text-xs">
                <div><strong>Manager:</strong> manager / password</div>
                <div><strong>Coordinator:</strong> coordinator / password</div>
                <div><strong>Worker:</strong> worker / password</div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string> = signal('');
  showForgotPassword: WritableSignal<boolean> = signal(false);
  videoPlayer = viewChild<ElementRef<HTMLVideoElement>>('videoPlayer');

  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    effect(() => {
      const player = this.videoPlayer();
      if (player) {
        const videoElement = player.nativeElement;
        videoElement.muted = true;
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Autoplay was prevented by the browser policy. This is expected behavior on some browsers and cannot be bypassed without user interaction.', error);
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        this.error.set(error.message || 'Login failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}