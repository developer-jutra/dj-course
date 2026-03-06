package customers

import (
	"fmt"
	"math/rand"
	"strings"

	"github.com/brianvoe/gofakeit/v6"
)

func GenerateCustomers(count int) []Customer {
	customers := make([]Customer, count)
	customerTypes := []CustomerType{Individual, Business, VIP}

	for i := 0; i < count; i++ {
		customers[i] = Customer{
			ID:           i + 1,
			FirstName:    gofakeit.FirstName(),
			LastName:     gofakeit.LastName(),
			Email:        gofakeit.Email(),
			Phone:        gofakeit.Phone(),
			CustomerType: customerTypes[rand.Intn(len(customerTypes))],
			Address:      gofakeit.Address().Address,
		}
	}
	return customers
}

func GenerateInsertStatements(customers []Customer) string {
	if len(customers) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("INSERT INTO customers (id, first_name, last_name, email, phone, customer_type, address) VALUES\n")

	for i, customer := range customers {
		sb.WriteString(fmt.Sprintf("(%d, '%s', '%s', '%s', '%s', '%s', '%s')",
			customer.ID,
			strings.ReplaceAll(customer.FirstName, "'", "''"),
			strings.ReplaceAll(customer.LastName, "'", "''"),
			strings.ReplaceAll(customer.Email, "'", "''"),
			strings.ReplaceAll(customer.Phone, "'", "''"),
			customer.CustomerType,
			strings.ReplaceAll(customer.Address, "'", "''")))
		if i < len(customers)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}
