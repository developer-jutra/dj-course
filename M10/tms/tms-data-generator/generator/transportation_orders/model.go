package transportation_orders

import (
	"time"
)

// OrderStatus represents the current status of a transportation order.
type OrderStatus string

const (
	OrderPending        OrderStatus = "PENDING"
	OrderProcessing     OrderStatus = "PROCESSING"
	OrderInTransit      OrderStatus = "IN_TRANSIT"
	OrderReadyForPickup OrderStatus = "READY_FOR_PICKUP"
	OrderDelivered      OrderStatus = "DELIVERED"
	OrderCancelled      OrderStatus = "CANCELLED"
)

// TransportationOrder represents a transportation order entity.
type TransportationOrder struct {
	ID               int
	OrderNumber      string
	CustomerID       int
	Status           OrderStatus
	Amount           float64
	OrderDate        time.Time
	ExpectedDelivery time.Time
	ShippingAddress  string
	ShippingCity     string
	ShippingState    string
	ShippingZipCode  string
	ShippingMethod   string
	TrackingNumber   string
}

// EventType represents the type of timeline event.
type EventType string

const (
	EventOrderCreated      EventType = "ORDER_CREATED"
	EventPaymentConfirmed  EventType = "PAYMENT_CONFIRMED"
	EventOrderApproved     EventType = "ORDER_APPROVED"
	EventPreparingShipment EventType = "PREPARING_SHIPMENT"
	EventReadyForPickup    EventType = "READY_FOR_PICKUP"
	EventInTransit         EventType = "IN_TRANSIT"
	EventOutForDelivery    EventType = "OUT_FOR_DELIVERY"
	EventDelivered         EventType = "DELIVERED"
	EventCancelled         EventType = "CANCELLED"
)

// OrderTimelineEvent represents a timeline event for an order.
type OrderTimelineEvent struct {
	ID             int
	OrderID        int
	EventType      EventType
	EventTimestamp time.Time
	Title          string
	Description    string
	ExecutedBy     string
}

// ItemType represents the type of order item.
type ItemType string

const (
	ItemProduct  ItemType = "PRODUCT"
	ItemShipping ItemType = "SHIPPING"
	ItemTax      ItemType = "TAX"
)

// OrderItem represents an item in an order.
type OrderItem struct {
	ID          int
	OrderID     int
	ProductName string
	Quantity    int
	UnitPrice   float64
	TotalPrice  float64
	ItemType    ItemType
}
