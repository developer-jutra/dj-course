package notifications

import "time"

// NotificationType represents the category of a notification.
type NotificationType string

const (
	Success NotificationType = "success"
	Info    NotificationType = "info"
	Message NotificationType = "message"
	Warning NotificationType = "warning"
)

// Notification represents a notification for an employee (user).
type Notification struct {
	ID        int
	UserID    int
	Type      NotificationType
	Message   string
	CreatedAt time.Time
	IsRead    bool
}
