package customers

// CustomerType represents the type of customer.
type CustomerType string

const (
	Individual CustomerType = "INDIVIDUAL"
	Business   CustomerType = "BUSINESS"
	VIP        CustomerType = "VIP"
)

// Customer represents a customer entity.
type Customer struct {
	ID           int
	FirstName    string
	LastName     string
	Email        string
	Phone        string
	CustomerType CustomerType
	Address      string
}
