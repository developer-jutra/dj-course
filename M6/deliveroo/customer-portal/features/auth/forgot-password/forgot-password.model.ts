export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  token: string
  password: string
  confirmPassword: string
} 