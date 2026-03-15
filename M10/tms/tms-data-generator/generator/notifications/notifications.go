package notifications

import (
	"math/rand"
	"strconv"
	"strings"
	"time"
)

var messagesByType = map[NotificationType][]string{
	Success: {
		"Payment received successfully",
		"Driver completed delivery",
		"Route optimization completed",
		"Order dispatched on time",
		"Vehicle inspection passed",
		"New contract signed",
		"Shipment delivered to customer",
	},
	Info: {
		"Order #%d has been shipped",
		"Truck maintenance scheduled",
		"Weather alert for active route",
		"New driver assigned to order",
		"Fleet report is ready",
		"System maintenance tonight at 23:00",
		"Route updated due to road closure",
	},
	Message: {
		"New message from dispatcher",
		"Customer inquiry received",
		"Driver availability request",
		"Team meeting scheduled for tomorrow",
		"Feedback received on last delivery",
		"Support ticket updated",
		"New comment on order",
	},
	Warning: {
		"3 orders are delayed",
		"Low fuel alert for assigned truck",
		"Traffic delay on scheduled route",
		"Driver license expires soon",
		"Vehicle overdue for maintenance",
		"Order approaching deadline",
		"Unconfirmed delivery attempt",
	},
}

var allTypes = []NotificationType{Success, Info, Message, Warning}

// GenerateNotifications generates a list of mock notifications for employees.
// user_id is assigned from a fixed pool (1–50) with no FK dependency.
func GenerateNotifications(count int) []Notification {
	notifications := make([]Notification, 0, count)
	now := time.Now()

	for i := 1; i <= count; i++ {
		notifType := allTypes[rand.Intn(len(allTypes))]
		messages := messagesByType[notifType]
		msg := messages[rand.Intn(len(messages))]

		// For info messages with a placeholder, substitute a fake order number
		if strings.Contains(msg, "%d") {
			msg = strings.Replace(msg, "%d", strconv.Itoa(10000+rand.Intn(90000)), 1)
		}

		// CreatedAt: random point in the last 7 days
		secondsAgo := rand.Int63n(7 * 24 * 60 * 60)
		createdAt := now.Add(-time.Duration(secondsAgo) * time.Second)

		notifications = append(notifications, Notification{
			ID:        i,
			UserID:    1 + rand.Intn(50),
			Type:      notifType,
			Message:   msg,
			CreatedAt: createdAt,
			IsRead:    rand.Float32() < 0.3,
		})
	}

	return notifications
}

// GenerateInsertStatements generates a single bulk INSERT statement for notifications.
func GenerateInsertStatements(notifications []Notification) string {
	if len(notifications) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(notifications) * 120)
	sb.WriteString("INSERT INTO notifications (id, user_id, type, message, created_at, is_read) VALUES\n")

	for i, n := range notifications {
		sb.WriteString("    (")
		sb.WriteString(strconv.Itoa(n.ID))
		sb.WriteString(", ")
		sb.WriteString(strconv.Itoa(n.UserID))
		sb.WriteString(", '")
		sb.WriteString(string(n.Type))
		sb.WriteString("', '")
		sb.WriteString(strings.ReplaceAll(n.Message, "'", "''"))
		sb.WriteString("', '")
		sb.WriteString(n.CreatedAt.Format("2006-01-02 15:04:05"))
		sb.WriteString("', ")
		if n.IsRead {
			sb.WriteString("true)")
		} else {
			sb.WriteString("false)")
		}

		if i < len(notifications)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}
