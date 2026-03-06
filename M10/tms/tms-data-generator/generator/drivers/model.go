package drivers

// ContractType represents the type of contract a driver has.
type ContractType string

const (
	Contractor ContractType = "CONTRACTOR"
	FullTime   ContractType = "FULL_TIME"
)

// DriverStatus represents the current status of a driver.
type DriverStatus string

const (
	Active    DriverStatus = "ACTIVE"
	OnRoute   DriverStatus = "ON_ROUTE"
	Resting   DriverStatus = "RESTING"
	OffDuty   DriverStatus = "OFF_DUTY"
	SickLeave DriverStatus = "SICK_LEAVE"
)

// Driver represents a driver entity.
type Driver struct {
	ID           int
	FirstName    string
	LastName     string
	Email        string
	Phone        string
	ContractType ContractType
	Status       DriverStatus
}
