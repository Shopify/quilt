export interface ToastDescription {
  content: string;
  error?: boolean;
  dismissible?: boolean;
  duration?: number;
  onDismiss?(): void;
}
