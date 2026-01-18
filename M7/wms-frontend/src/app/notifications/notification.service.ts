import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification } from './notification.model';
import { MOCK_NOTIFICATIONS } from '../mock/notifications.mock';

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  toastNotifications: WritableSignal<ToastNotification[]> = signal([]);

  getNotifications(): Observable<Notification[]> {
    return of(MOCK_NOTIFICATIONS);
  }

  showToast(notification: Omit<ToastNotification, 'id'>): void {
    const toast: ToastNotification = {
      ...notification,
      id: this.generateId(),
      duration: notification.duration || 5000
    };

    this.toastNotifications.update(toasts => [...toasts, toast]);

    // Auto dismiss after duration
    setTimeout(() => {
      this.dismissToast(toast.id);
    }, toast.duration);
  }

  dismissToast(id: string): void {
    this.toastNotifications.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  showSuccess(title: string, message?: string): void {
    this.showToast({ title, message, type: 'success' });
  }

  showError(title: string, message?: string): void {
    this.showToast({ title, message, type: 'error' });
  }

  showWarning(title: string, message?: string): void {
    this.showToast({ title, message, type: 'warning' });
  }

  showInfo(title: string, message?: string): void {
    this.showToast({ title, message, type: 'info' });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}