package transportation_orders

import (
	"fmt"
	"math/rand"
	"strings"

	"github.com/brianvoe/gofakeit/v6"
)

// getProductNames returns a list of realistic product names.
func getProductNames() []string {
	return []string{
		"Laptop Computer", "Wireless Mouse", "Mechanical Keyboard", "USB-C Hub",
		"External SSD Drive", "Monitor 27-inch", "Webcam HD", "Desk Lamp LED",
		"Office Chair", "Standing Desk", "Notebook Set", "Pen Collection",
		"Wireless Headphones", "Smartphone Case", "Tablet Stand", "Cable Organizer",
		"Power Bank", "Phone Charger", "HDMI Cable", "Ethernet Cable",
		"Desk Mat", "Ergonomic Mouse Pad", "Monitor Arm", "Laptop Stand",
		"Backpack", "Messenger Bag", "Water Bottle", "Coffee Mug",
		"Desk Organizer", "File Cabinet", "Bookshelf", "Wall Clock",
		"Plant Pot", "Desk Fan", "Space Heater", "Air Purifier",
		"Bluetooth Speaker", "Smart Watch", "Fitness Tracker", "Action Camera",
		"Tripod Stand", "Camera Bag", "Memory Card", "Card Reader",
		"Graphics Tablet", "Stylus Pen", "Screen Protector", "Phone Holder",
		"Docking Station", "KVM Switch", "Surge Protector", "Extension Cord",
	}
}

// GenerateOrderItems generates order items for all transportation orders.
func GenerateOrderItems(orders []TransportationOrder) []OrderItem {
	items := make([]OrderItem, 0)
	itemID := 1
	productNames := getProductNames()

	for _, order := range orders {
		// Generate 1-4 products per order
		numProducts := rand.Intn(4) + 1
		var subtotal float64

		// Generate product items
		for i := 0; i < numProducts; i++ {
			productName := productNames[rand.Intn(len(productNames))]
			quantity := rand.Intn(3) + 1 // 1-3 items
			unitPrice := gofakeit.Float64Range(10, 1000)
			totalPrice := float64(quantity) * unitPrice

			item := OrderItem{
				ID:          itemID,
				OrderID:     order.ID,
				ProductName: productName,
				Quantity:    quantity,
				UnitPrice:   roundToTwoDecimals(unitPrice),
				TotalPrice:  roundToTwoDecimals(totalPrice),
				ItemType:    ItemProduct,
			}

			items = append(items, item)
			subtotal += item.TotalPrice
			itemID++
		}

		// Generate shipping cost (based on shipping method)
		var shippingCost float64
		switch order.ShippingMethod {
		case "Same Day Delivery":
			shippingCost = gofakeit.Float64Range(25, 50)
		case "Next Day Delivery":
			shippingCost = gofakeit.Float64Range(15, 30)
		case "Express Delivery":
			shippingCost = gofakeit.Float64Range(10, 20)
		case "Standard Delivery":
			shippingCost = gofakeit.Float64Range(5, 15)
		default: // Economy Shipping
			shippingCost = gofakeit.Float64Range(0, 10)
		}

		shippingItem := OrderItem{
			ID:          itemID,
			OrderID:     order.ID,
			ProductName: "Shipping",
			Quantity:    1,
			UnitPrice:   roundToTwoDecimals(shippingCost),
			TotalPrice:  roundToTwoDecimals(shippingCost),
			ItemType:    ItemShipping,
		}
		items = append(items, shippingItem)
		itemID++

		// Generate tax (typically 5-10% of subtotal)
		taxRate := gofakeit.Float64Range(0.05, 0.10)
		taxAmount := subtotal * taxRate

		taxItem := OrderItem{
			ID:          itemID,
			OrderID:     order.ID,
			ProductName: "Tax",
			Quantity:    1,
			UnitPrice:   roundToTwoDecimals(taxAmount),
			TotalPrice:  roundToTwoDecimals(taxAmount),
			ItemType:    ItemTax,
		}
		items = append(items, taxItem)
		itemID++
	}

	return items
}

// roundToTwoDecimals rounds a float64 to 2 decimal places.
func roundToTwoDecimals(value float64) float64 {
	return float64(int(value*100+0.5)) / 100
}

// GenerateOrderItemsInsertStatements generates SQL INSERT statements for order items.
func GenerateOrderItemsInsertStatements(items []OrderItem) string {
	if len(items) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(items) * 120)

	sb.WriteString("INSERT INTO order_items (id, order_id, product_name, quantity, unit_price, total_price, item_type) VALUES\n")

	for i, item := range items {
		sb.WriteString(fmt.Sprintf("    (%d, %d, '%s', %d, %.2f, %.2f, '%s')",
			item.ID,
			item.OrderID,
			strings.ReplaceAll(item.ProductName, "'", "''"),
			item.Quantity,
			item.UnitPrice,
			item.TotalPrice,
			item.ItemType))

		if i < len(items)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}
