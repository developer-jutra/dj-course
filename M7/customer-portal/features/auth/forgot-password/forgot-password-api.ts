import type { ForgotPasswordFormData, ResetPasswordFormData } from './forgot-password.model'

export async function forgotPassword(data: ForgotPasswordFormData): Promise<{ success: boolean; message: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('Password reset email sent to:', data.email)
  return {
    success: true,
    message: 'Password reset instructions have been sent to your email address.'
  }
}

export async function resetPassword(data: ResetPasswordFormData): Promise<{ success: boolean; message: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match')
  }
  
  console.log('Password reset successfully for token:', data.token)
  return {
    success: true,
    message: 'Your password has been reset successfully.'
  }
} 