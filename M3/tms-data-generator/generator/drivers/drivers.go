package drivers

import (
	"math/rand"
	"strconv"
	"strings"

	"github.com/brianvoe/gofakeit/v6"
)

// GenerateDrivers generates a list of mock drivers.
func GenerateDrivers(count int) []Driver {
	drivers := make([]Driver, 0, count)
	for i := 1; i <= count; i++ {
		drivers = append(drivers, Driver{
			ID:           i,
			FirstName:    gofakeit.FirstName(),
			LastName:     gofakeit.LastName(),
			Email:        gofakeit.Email(),
			Phone:        gofakeit.Phone(),
			ContractType: randomContractType(),
			Status:       randomDriverStatus(),
		})
	}
	return drivers
}

// GenerateInsertStatements generates a single INSERT statement for a slice of drivers.
func GenerateInsertStatements(drivers []Driver) string {
	if len(drivers) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(drivers) * 150) // Estimate and pre-allocate memory
	sb.WriteString("INSERT INTO drivers (id, first_name, last_name, email, phone, contract_type, status) VALUES\n")

	for i, d := range drivers {
		sb.WriteString("    (")
		sb.WriteString(strconv.Itoa(d.ID))
		sb.WriteString(", '")
		sb.WriteString(d.FirstName)
		sb.WriteString("', '")
		sb.WriteString(d.LastName)
		sb.WriteString("', '")
		sb.WriteString(d.Email)
		sb.WriteString("', '")
		sb.WriteString(d.Phone)
		sb.WriteString("', '")
		sb.WriteString(string(d.ContractType))
		sb.WriteString("', '")
		sb.WriteString(string(d.Status))
		sb.WriteString("')")

		if i < len(drivers)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}

func randomContractType() ContractType {
	types := []ContractType{Contractor, FullTime}
	return types[rand.Intn(len(types))]
}

func randomDriverStatus() DriverStatus {
	statuses := []DriverStatus{Active, OnRoute, Resting, OffDuty, SickLeave}
	return statuses[rand.Intn(len(statuses))]
}
