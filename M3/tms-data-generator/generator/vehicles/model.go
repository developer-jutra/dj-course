package vehicles

// Vehicle represents a vehicle entity.
type Vehicle struct {
	ID               int
	Make             string
	Model            string
	Year             int
	FuelTankCapacity float64 // Maximum fuel capacity in liters
}
