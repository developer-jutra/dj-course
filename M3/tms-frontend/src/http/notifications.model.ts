export interface Notification {
  id: number;
  type: 'success' | 'info' | 'message' | 'warning';
  message: string;
  time: string;
  icon: string;
}
