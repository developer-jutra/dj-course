package vehicles

import (
	"strconv"
	"strings"

	"github.com/brianvoe/gofakeit/v6"
)

// GenerateVehicles returns the list of mock vehicles.
func GenerateVehicles(count int) []Vehicle {
	vehicles := make([]Vehicle, 0, count)
	for i := 1; i <= count; i++ {
		car := gofakeit.Car()
		vehicles = append(vehicles, Vehicle{
			ID:               i,
			Make:             car.Brand,
			Model:            car.Model,
			Year:             2020 + (i % 5),                           // Generate years from 2020-2024
			FuelTankCapacity: 50.0 + float64(i%70) + float64(i%10)*0.1, // Generate capacity between 50-120 liters
			// Make:  car.Brand,
			// Model: car.Model,
		})
	}
	return vehicles
}

// GenerateInsertStatements generates a single INSERT statement for a slice of vehicles.
func GenerateInsertStatements(vehicles []Vehicle) string {
	if len(vehicles) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(vehicles) * 50) // Estimate and pre-allocate memory
	sb.WriteString("INSERT INTO vehicles (id, make, model, year, fuel_tank_capacity) VALUES\n")

	for i, v := range vehicles {
		sb.WriteString("    (")
		sb.WriteString(strconv.Itoa(v.ID))
		sb.WriteString(", '")
		sb.WriteString(v.Make)
		sb.WriteString("', '")
		sb.WriteString(v.Model)
		sb.WriteString("', ")
		sb.WriteString(strconv.Itoa(v.Year))
		sb.WriteString(", ")
		sb.WriteString(strconv.FormatFloat(v.FuelTankCapacity, 'f', 1, 64))
		sb.WriteString(")")
		if i < len(vehicles)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}
