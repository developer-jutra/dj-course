package transportation_orders

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"tms-data-generator/generator/customers"

	"github.com/brianvoe/gofakeit/v6"
)

// GenerateTransportationOrders generates transportation orders with realistic data.
func GenerateTransportationOrders(count int, customers []customers.Customer) []TransportationOrder {
	orders := make([]TransportationOrder, count)
	shippingMethods := []string{"Standard Delivery", "Express Delivery", "Next Day Delivery", "Same Day Delivery", "Economy Shipping"}

	now := time.Now()
	oneYearAgo := now.AddDate(-1, 0, 0)
	twoWeeksAgo := now.AddDate(0, 0, -14)

	for i := 0; i < count; i++ {
		// Generate random order date within the last year
		orderDate := gofakeit.DateRange(oneYearAgo, now)

		// Determine status based on order age
		var status OrderStatus
		if orderDate.Before(twoWeeksAgo) {
			// Historical orders (older than 2 weeks) should be completed or cancelled
			if rand.Float64() < 0.9 { // 90% delivered, 10% cancelled
				status = OrderDelivered
			} else {
				status = OrderCancelled
			}
		} else {
			// Recent orders (last 2 weeks) - minority in progress
			if rand.Float64() < 0.3 { // 30% still in progress
				statuses := []OrderStatus{OrderPending, OrderProcessing, OrderInTransit, OrderReadyForPickup}
				status = statuses[rand.Intn(len(statuses))]
			} else {
				status = OrderDelivered
			}
		}

		// Expected delivery is 2-7 days after order date
		expectedDelivery := orderDate.AddDate(0, 0, rand.Intn(6)+2)

		// Generate shipping address
		address := gofakeit.Address()

		// Randomly select a customer
		customerIndex := rand.Intn(len(customers))

		orders[i] = TransportationOrder{
			ID:               i + 1,
			OrderNumber:      fmt.Sprintf("#%05d", i+1),
			CustomerID:       customers[customerIndex].ID,
			Status:           status,
			Amount:           0, // Will be calculated from order items
			OrderDate:        orderDate,
			ExpectedDelivery: expectedDelivery,
			ShippingAddress:  address.Address,
			ShippingCity:     address.City,
			ShippingState:    address.State,
			ShippingZipCode:  address.Zip,
			ShippingMethod:   shippingMethods[rand.Intn(len(shippingMethods))],
			TrackingNumber:   fmt.Sprintf("SR%04d", i+1),
		}
	}

	return orders
}

// UpdateOrderAmounts updates the Amount field based on order items.
func UpdateOrderAmounts(orders []TransportationOrder, orderItems []OrderItem) {
	// Create a map to sum up items by order ID
	orderTotals := make(map[int]float64)

	for _, item := range orderItems {
		orderTotals[item.OrderID] += item.TotalPrice
	}

	// Update order amounts
	for i := range orders {
		if total, exists := orderTotals[orders[i].ID]; exists {
			orders[i].Amount = total
		}
	}
}

// GenerateInsertStatements generates SQL INSERT statements for transportation orders.
func GenerateInsertStatements(orders []TransportationOrder) string {
	if len(orders) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(orders) * 200) // Pre-allocate approximate size

	sb.WriteString("INSERT INTO transportation_orders (id, order_number, customer_id, status, amount, order_date, expected_delivery, shipping_address, shipping_city, shipping_state, shipping_zip_code, shipping_method, tracking_number) VALUES\n")

	for i, order := range orders {
		sb.WriteString(fmt.Sprintf("    (%d, '%s', %d, '%s', %.2f, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')",
			order.ID,
			order.OrderNumber,
			order.CustomerID,
			order.Status,
			order.Amount,
			order.OrderDate.Format("2006-01-02 15:04:05"),
			order.ExpectedDelivery.Format("2006-01-02"),
			strings.ReplaceAll(order.ShippingAddress, "'", "''"),
			strings.ReplaceAll(order.ShippingCity, "'", "''"),
			strings.ReplaceAll(order.ShippingState, "'", "''"),
			order.ShippingZipCode,
			strings.ReplaceAll(order.ShippingMethod, "'", "''"),
			order.TrackingNumber))

		if i < len(orders)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}
