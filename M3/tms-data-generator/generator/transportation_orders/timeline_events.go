package transportation_orders

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/brianvoe/gofakeit/v6"
)

// EventTemplate represents a template for generating timeline events.
type EventTemplate struct {
	EventType   EventType
	Title       string
	Description string
	ExecutedBy  string
}

// getEventTemplates returns event templates based on event type.
func getEventTemplates() map[EventType][]EventTemplate {
	employees := []string{
		"Sarah Johnson", "Mike Wilson", "David Chen", "Emily Rodriguez", "James Smith",
		"Maria Garcia", "Robert Brown", "Lisa Anderson", "John Martinez", "Anna White",
	}

	return map[EventType][]EventTemplate{
		EventOrderCreated: {
			{EventOrderCreated, "Order Created", "Order placed by customer", "System"},
			{EventOrderCreated, "Order Created", "Initial order creation and validation", "System"},
			{EventOrderCreated, "New Order Received", "Customer order received and registered", "System"},
		},
		EventPaymentConfirmed: {
			{EventPaymentConfirmed, "Payment Confirmed", "Payment successfully processed", "Payment System"},
			{EventPaymentConfirmed, "Payment Received", "Credit card payment processed", "Payment System"},
			{EventPaymentConfirmed, "Transaction Completed", "Payment transaction completed successfully", "Payment System"},
		},
		EventOrderApproved: {
			{EventOrderApproved, "Order Approved", "Order approved for processing", employees[rand.Intn(len(employees))]},
			{EventOrderApproved, "Order Validated", "Order review completed and approved for shipment preparation", employees[rand.Intn(len(employees))]},
			{EventOrderApproved, "Processing Authorized", "Order authorized for warehouse processing", employees[rand.Intn(len(employees))]},
		},
		EventPreparingShipment: {
			{EventPreparingShipment, "Preparing Shipment", "Shipment preparation started", employees[rand.Intn(len(employees))]},
			{EventPreparingShipment, "Warehouse Processing", "Items picked from warehouse and packaging initiated", employees[rand.Intn(len(employees))]},
			{EventPreparingShipment, "Packing in Progress", "Order items being packed for shipment", employees[rand.Intn(len(employees))]},
		},
		EventReadyForPickup: {
			{EventReadyForPickup, "Ready for Pickup", "Package ready for carrier pickup", employees[rand.Intn(len(employees))]},
			{EventReadyForPickup, "Awaiting Carrier", "Final quality check completed, package sealed and labeled", employees[rand.Intn(len(employees))]},
			{EventReadyForPickup, "Pickup Scheduled", "Package prepared and awaiting carrier collection", employees[rand.Intn(len(employees))]},
		},
		EventInTransit: {
			{EventInTransit, "In Transit", "Package picked up by carrier and in transit", "Logistics System"},
			{EventInTransit, "Shipment Departed", "Package departed from distribution center", "Logistics System"},
			{EventInTransit, "En Route", "Package is on the way to destination", "Logistics System"},
		},
		EventOutForDelivery: {
			{EventOutForDelivery, "Out for Delivery", "Package out for delivery to customer", "Delivery System"},
			{EventOutForDelivery, "Final Mile Delivery", "Package loaded on delivery vehicle", "Delivery System"},
			{EventOutForDelivery, "Delivery in Progress", "Driver en route to delivery address", "Delivery System"},
		},
		EventDelivered: {
			{EventDelivered, "Delivered", "Package delivered successfully to customer", "Delivery System"},
			{EventDelivered, "Delivery Completed", "Package received and signed by customer", "Delivery System"},
			{EventDelivered, "Order Fulfilled", "Delivery completed successfully", "Delivery System"},
		},
		EventCancelled: {
			{EventCancelled, "Order Cancelled", "Order cancelled by customer request", employees[rand.Intn(len(employees))]},
			{EventCancelled, "Cancellation Processed", "Order cancellation processed and refund initiated", "System"},
			{EventCancelled, "Order Voided", "Order cancelled due to customer request", employees[rand.Intn(len(employees))]},
		},
	}
}

// generateEventChain generates a chain of events based on order status.
func generateEventChain(order TransportationOrder) []EventType {
	baseEvents := []EventType{EventOrderCreated, EventPaymentConfirmed, EventOrderApproved}

	switch order.Status {
	case OrderPending:
		// Only initial events
		return baseEvents[:1+rand.Intn(2)] // 1-2 events
	case OrderProcessing:
		// Up to preparing shipment
		chain := append(baseEvents, EventPreparingShipment)
		if rand.Float64() < 0.5 {
			return chain[:len(chain)-1] // Sometimes still in approval
		}
		return chain
	case OrderReadyForPickup:
		// Ready for pickup
		return append(baseEvents, EventPreparingShipment, EventReadyForPickup)
	case OrderInTransit:
		// In transit
		chain := append(baseEvents, EventPreparingShipment, EventReadyForPickup, EventInTransit)
		if rand.Float64() < 0.4 {
			chain = append(chain, EventOutForDelivery)
		}
		return chain
	case OrderDelivered:
		// Full chain to delivery
		chain := append(baseEvents, EventPreparingShipment, EventReadyForPickup, EventInTransit)
		// Sometimes add out for delivery before delivered
		if rand.Float64() < 0.6 {
			chain = append(chain, EventOutForDelivery)
		}
		chain = append(chain, EventDelivered)
		return chain
	case OrderCancelled:
		// Cancelled at some point
		cancelPoint := 1 + rand.Intn(len(baseEvents))
		chain := baseEvents[:cancelPoint]
		chain = append(chain, EventCancelled)
		return chain
	default:
		return baseEvents
	}
}

// GenerateOrderTimelineEvents generates timeline events for all orders.
func GenerateOrderTimelineEvents(orders []TransportationOrder) []OrderTimelineEvent {
	events := make([]OrderTimelineEvent, 0)
	eventID := 1
	templates := getEventTemplates()

	for _, order := range orders {
		eventChain := generateEventChain(order)

		// Generate events with progressive timestamps
		currentTime := order.OrderDate
		for _, eventType := range eventChain {
			// Get a random template for this event type
			templateList := templates[eventType]
			template := templateList[rand.Intn(len(templateList))]

			// Create employee name if needed
			executedBy := template.ExecutedBy
			if executedBy != "System" && executedBy != "Payment System" && executedBy != "Logistics System" && executedBy != "Delivery System" {
				executedBy = gofakeit.Name()
			}

			event := OrderTimelineEvent{
				ID:             eventID,
				OrderID:        order.ID,
				EventType:      eventType,
				EventTimestamp: currentTime,
				Title:          template.Title,
				Description:    template.Description,
				ExecutedBy:     executedBy,
			}

			events = append(events, event)
			eventID++

			// Increment time for next event (5 minutes to 8 hours)
			minutesToAdd := rand.Intn(480) + 5
			currentTime = currentTime.Add(time.Duration(minutesToAdd) * time.Minute)
		}
	}

	return events
}

// GenerateTimelineEventsInsertStatements generates SQL INSERT statements for timeline events.
func GenerateTimelineEventsInsertStatements(events []OrderTimelineEvent) string {
	if len(events) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(events) * 150)

	sb.WriteString("INSERT INTO order_timeline_events (id, order_id, event_type, event_timestamp, title, description, executed_by) VALUES\n")

	for i, event := range events {
		sb.WriteString(fmt.Sprintf("    (%d, %d, '%s', '%s', '%s', '%s', '%s')",
			event.ID,
			event.OrderID,
			event.EventType,
			event.EventTimestamp.Format("2006-01-02 15:04:05"),
			strings.ReplaceAll(event.Title, "'", "''"),
			strings.ReplaceAll(event.Description, "'", "''"),
			strings.ReplaceAll(event.ExecutedBy, "'", "''")))

		if i < len(events)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}
