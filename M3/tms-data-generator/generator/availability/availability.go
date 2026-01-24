package availability

import (
	"math/rand"
	"strconv"
	"strings"
	"time"
)

// GenerateDriverAvailability generates realistic availability periods for drivers.
// Generates data for the last 60 days and next 30 days.
func GenerateDriverAvailability(driverCount int) []DriverAvailability {
	availabilities := make([]DriverAvailability, 0)
	id := 1

	now := time.Now()
	startDate := now.AddDate(0, 0, -60) // 60 days ago
	endDate := now.AddDate(0, 0, 30)    // 30 days ahead

	for driverID := 1; driverID <= driverCount; driverID++ {
		currentDate := startDate

		// Generate availability periods for this driver
		for currentDate.Before(endDate) {
			// Determine if this is a working day (70% chance) or off day
			if rand.Float64() < 0.7 {
				// Working day - generate shift
				shiftStart := time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(),
					8+rand.Intn(3), 0, 0, 0, time.UTC) // Start between 8-10 AM
				shiftEnd := shiftStart.Add(time.Duration(7+rand.Intn(3)) * time.Hour) // 7-9 hour shift

				availabilities = append(availabilities, DriverAvailability{
					ID:            id,
					DriverID:      driverID,
					StartDatetime: shiftStart,
					EndDatetime:   shiftEnd,
					Type:          DriverOnShift,
					Notes:         "Regular shift",
				})
				id++

				// Add break during shift (30% chance)
				if rand.Float64() < 0.3 {
					breakStart := shiftStart.Add(time.Duration(3+rand.Intn(2)) * time.Hour)
					breakEnd := breakStart.Add(30 * time.Minute)

					availabilities = append(availabilities, DriverAvailability{
						ID:            id,
						DriverID:      driverID,
						StartDatetime: breakStart,
						EndDatetime:   breakEnd,
						Type:          DriverBreak,
						Notes:         "Lunch break",
					})
					id++
				}

				// After shift - available for overtime (20% chance)
				if rand.Float64() < 0.2 {
					overtimeStart := shiftEnd
					overtimeEnd := overtimeStart.Add(time.Duration(2+rand.Intn(3)) * time.Hour)

					availabilities = append(availabilities, DriverAvailability{
						ID:            id,
						DriverID:      driverID,
						StartDatetime: overtimeStart,
						EndDatetime:   overtimeEnd,
						Type:          DriverAvailable,
						Notes:         "Available for overtime",
					})
					id++
				}
			} else {
				// Off day - various statuses
				status := randomDriverOffDayStatus()
				dayStart := time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(),
					0, 0, 0, 0, time.UTC)
				dayEnd := dayStart.Add(24 * time.Hour)

				notes := generateDriverStatusNotes(status)

				availabilities = append(availabilities, DriverAvailability{
					ID:            id,
					DriverID:      driverID,
					StartDatetime: dayStart,
					EndDatetime:   dayEnd,
					Type:          status,
					Notes:         notes,
				})
				id++

				// For vacation or sick leave, extend to multiple days (30% chance)
				if (status == DriverVacation || status == DriverSickLeave) && rand.Float64() < 0.3 {
					extraDays := 2 + rand.Intn(5) // 2-6 extra days
					for i := 1; i <= extraDays; i++ {
						if currentDate.AddDate(0, 0, i).Before(endDate) {
							extendedDayStart := dayStart.AddDate(0, 0, i)
							extendedDayEnd := extendedDayStart.Add(24 * time.Hour)

							availabilities = append(availabilities, DriverAvailability{
								ID:            id,
								DriverID:      driverID,
								StartDatetime: extendedDayStart,
								EndDatetime:   extendedDayEnd,
								Type:          status,
								Notes:         notes,
							})
							id++
						}
					}
					currentDate = currentDate.AddDate(0, 0, extraDays)
				}
			}

			currentDate = currentDate.AddDate(0, 0, 1)
		}
	}

	return availabilities
}

// GenerateVehicleAvailability generates realistic availability periods for vehicles.
// Generates data for the last 60 days and next 30 days.
func GenerateVehicleAvailability(vehicleCount int) []VehicleAvailability {
	availabilities := make([]VehicleAvailability, 0)
	id := 1

	now := time.Now()
	startDate := now.AddDate(0, 0, -60) // 60 days ago
	endDate := now.AddDate(0, 0, 30)    // 30 days ahead

	for vehicleID := 1; vehicleID <= vehicleCount; vehicleID++ {
		currentDate := startDate

		// Generate availability periods for this vehicle
		for currentDate.Before(endDate) {
			// Determine vehicle status for the day
			statusRoll := rand.Float64()

			if statusRoll < 0.65 {
				// In use during business hours (65%)
				useStart := time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(),
					7+rand.Intn(3), 0, 0, 0, time.UTC) // Start between 7-9 AM
				useEnd := useStart.Add(time.Duration(8+rand.Intn(4)) * time.Hour) // 8-11 hours

				availabilities = append(availabilities, VehicleAvailability{
					ID:            id,
					VehicleID:     vehicleID,
					StartDatetime: useStart,
					EndDatetime:   useEnd,
					Type:          VehicleInUse,
					Notes:         "Active delivery route",
				})
				id++

				// Available before and after use
				dayStart := time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(),
					0, 0, 0, 0, time.UTC)

				if useStart.After(dayStart) {
					availabilities = append(availabilities, VehicleAvailability{
						ID:            id,
						VehicleID:     vehicleID,
						StartDatetime: dayStart,
						EndDatetime:   useStart,
						Type:          VehicleAvailable,
						Notes:         "Ready for dispatch",
					})
					id++
				}

				if useEnd.Hour() < 23 {
					availabilities = append(availabilities, VehicleAvailability{
						ID:            id,
						VehicleID:     vehicleID,
						StartDatetime: useEnd,
						EndDatetime:   time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(), 23, 59, 59, 0, time.UTC),
						Type:          VehicleAvailable,
						Notes:         "Available for night shift",
					})
					id++
				}
			} else if statusRoll < 0.85 {
				// Available all day (20%)
				dayStart := time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(),
					0, 0, 0, 0, time.UTC)
				dayEnd := dayStart.Add(24 * time.Hour)

				availabilities = append(availabilities, VehicleAvailability{
					ID:            id,
					VehicleID:     vehicleID,
					StartDatetime: dayStart,
					EndDatetime:   dayEnd,
					Type:          VehicleAvailable,
					Notes:         "Standby - ready for use",
				})
				id++
			} else {
				// Maintenance/Repair/Inspection (15%)
				status := randomVehicleMaintenanceStatus()
				dayStart := time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(),
					0, 0, 0, 0, time.UTC)
				dayEnd := dayStart.Add(24 * time.Hour)

				notes := generateVehicleStatusNotes(status)

				availabilities = append(availabilities, VehicleAvailability{
					ID:            id,
					VehicleID:     vehicleID,
					StartDatetime: dayStart,
					EndDatetime:   dayEnd,
					Type:          status,
					Notes:         notes,
				})
				id++

				// Maintenance/repair might take multiple days (40% chance)
				if (status == VehicleMaintenance || status == VehicleRepair) && rand.Float64() < 0.4 {
					extraDays := 1 + rand.Intn(3) // 1-3 extra days
					for i := 1; i <= extraDays; i++ {
						if currentDate.AddDate(0, 0, i).Before(endDate) {
							extendedDayStart := dayStart.AddDate(0, 0, i)
							extendedDayEnd := extendedDayStart.Add(24 * time.Hour)

							availabilities = append(availabilities, VehicleAvailability{
								ID:            id,
								VehicleID:     vehicleID,
								StartDatetime: extendedDayStart,
								EndDatetime:   extendedDayEnd,
								Type:          status,
								Notes:         notes,
							})
							id++
						}
					}
					currentDate = currentDate.AddDate(0, 0, extraDays)
				}
			}

			currentDate = currentDate.AddDate(0, 0, 1)
		}
	}

	return availabilities
}

// GenerateDriverAvailabilityInsertStatements generates INSERT statement for driver availability.
func GenerateDriverAvailabilityInsertStatements(availabilities []DriverAvailability) string {
	if len(availabilities) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(availabilities) * 200)
	sb.WriteString("INSERT INTO driver_availability (id, driver_id, start_datetime, end_datetime, availability_type, notes) VALUES\n")

	for i, a := range availabilities {
		sb.WriteString("    (")
		sb.WriteString(strconv.Itoa(a.ID))
		sb.WriteString(", ")
		sb.WriteString(strconv.Itoa(a.DriverID))
		sb.WriteString(", '")
		sb.WriteString(a.StartDatetime.Format("2006-01-02 15:04:05"))
		sb.WriteString("', '")
		sb.WriteString(a.EndDatetime.Format("2006-01-02 15:04:05"))
		sb.WriteString("', '")
		sb.WriteString(string(a.Type))
		sb.WriteString("', '")
		sb.WriteString(escapeSQL(a.Notes))
		sb.WriteString("')")

		if i < len(availabilities)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}

// GenerateVehicleAvailabilityInsertStatements generates INSERT statement for vehicle availability.
func GenerateVehicleAvailabilityInsertStatements(availabilities []VehicleAvailability) string {
	if len(availabilities) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.Grow(len(availabilities) * 200)
	sb.WriteString("INSERT INTO vehicle_availability (id, vehicle_id, start_datetime, end_datetime, availability_type, notes) VALUES\n")

	for i, a := range availabilities {
		sb.WriteString("    (")
		sb.WriteString(strconv.Itoa(a.ID))
		sb.WriteString(", ")
		sb.WriteString(strconv.Itoa(a.VehicleID))
		sb.WriteString(", '")
		sb.WriteString(a.StartDatetime.Format("2006-01-02 15:04:05"))
		sb.WriteString("', '")
		sb.WriteString(a.EndDatetime.Format("2006-01-02 15:04:05"))
		sb.WriteString("', '")
		sb.WriteString(string(a.Type))
		sb.WriteString("', '")
		sb.WriteString(escapeSQL(a.Notes))
		sb.WriteString("')")

		if i < len(availabilities)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}

// Helper functions

func randomDriverOffDayStatus() DriverAvailabilityType {
	roll := rand.Float64()
	if roll < 0.60 {
		return DriverOffDuty
	} else if roll < 0.75 {
		return DriverAvailable
	} else if roll < 0.85 {
		return DriverVacation
	} else if roll < 0.95 {
		return DriverSickLeave
	}
	return DriverTraining
}

func randomVehicleMaintenanceStatus() VehicleAvailabilityType {
	roll := rand.Float64()
	if roll < 0.40 {
		return VehicleMaintenance
	} else if roll < 0.70 {
		return VehicleInspection
	} else if roll < 0.90 {
		return VehicleRepair
	}
	return VehicleOutOfService
}

func generateDriverStatusNotes(status DriverAvailabilityType) string {
	notes := map[DriverAvailabilityType][]string{
		DriverOffDuty:   {"Day off", "Weekend", "Scheduled rest day"},
		DriverAvailable: {"On-call", "Available for urgent deliveries", "Standby"},
		DriverVacation:  {"Annual leave", "Vacation time", "Paid time off"},
		DriverSickLeave: {"Medical leave", "Sick day", "Doctor's appointment"},
		DriverTraining:  {"Safety training", "Vehicle operation course", "Compliance training", "Skills development"},
	}

	if notesList, ok := notes[status]; ok {
		return notesList[rand.Intn(len(notesList))]
	}
	return ""
}

func generateVehicleStatusNotes(status VehicleAvailabilityType) string {
	notes := map[VehicleAvailabilityType][]string{
		VehicleMaintenance: {
			"Scheduled maintenance",
			"Oil change and inspection",
			"Tire rotation",
			"Preventive maintenance",
			"Regular service",
		},
		VehicleRepair: {
			"Engine repair",
			"Brake system repair",
			"Transmission service",
			"Electrical system repair",
			"Body work",
		},
		VehicleInspection: {
			"Annual inspection",
			"Safety inspection",
			"Emissions test",
			"DOT inspection",
			"Pre-trip inspection",
		},
		VehicleOutOfService: {
			"Major repair needed",
			"Awaiting parts",
			"Accident damage",
			"Failed inspection",
		},
	}

	if notesList, ok := notes[status]; ok {
		return notesList[rand.Intn(len(notesList))]
	}
	return ""
}

func escapeSQL(s string) string {
	return strings.ReplaceAll(s, "'", "''")
}

// GenerateExampleQueries returns example SQL queries for availability checking.
func GenerateExampleQueries() string {
	var sb strings.Builder

	sb.WriteString("\n-- ========================================\n")
	sb.WriteString("-- Example Availability Queries\n")
	sb.WriteString("-- ========================================\n\n")

	sb.WriteString("-- Query 1: Find drivers available tomorrow between 9:00-17:00\n")
	sb.WriteString("-- (Adjust date to tomorrow's date)\n")
	sb.WriteString("/*\n")
	sb.WriteString("SELECT DISTINCT d.id, d.first_name, d.last_name, d.phone\n")
	sb.WriteString("FROM drivers d\n")
	sb.WriteString("WHERE NOT EXISTS (\n")
	sb.WriteString("    SELECT 1\n")
	sb.WriteString("    FROM driver_availability da\n")
	sb.WriteString("    WHERE da.driver_id = d.id\n")
	sb.WriteString("      AND da.availability_type NOT IN ('AVAILABLE', 'ON_SHIFT')\n")
	sb.WriteString("      AND da.start_datetime <= '2025-01-25 17:00:00'\n")
	sb.WriteString("      AND da.end_datetime >= '2025-01-25 09:00:00'\n")
	sb.WriteString(")\n")
	sb.WriteString("ORDER BY d.last_name;\n")
	sb.WriteString("*/\n\n")

	sb.WriteString("-- Query 2: Find vehicles available now\n")
	sb.WriteString("/*\n")
	sb.WriteString("SELECT v.id, v.make, v.model, v.year\n")
	sb.WriteString("FROM vehicles v\n")
	sb.WriteString("WHERE EXISTS (\n")
	sb.WriteString("    SELECT 1\n")
	sb.WriteString("    FROM vehicle_availability va\n")
	sb.WriteString("    WHERE va.vehicle_id = v.id\n")
	sb.WriteString("      AND va.availability_type = 'AVAILABLE'\n")
	sb.WriteString("      AND va.start_datetime <= NOW()\n")
	sb.WriteString("      AND va.end_datetime >= NOW()\n")
	sb.WriteString(")\n")
	sb.WriteString("ORDER BY v.make, v.model;\n")
	sb.WriteString("*/\n\n")

	sb.WriteString("-- Query 3: Get driver availability history for driver ID 1\n")
	sb.WriteString("/*\n")
	sb.WriteString("SELECT \n")
	sb.WriteString("    da.start_datetime,\n")
	sb.WriteString("    da.end_datetime,\n")
	sb.WriteString("    da.availability_type,\n")
	sb.WriteString("    da.notes,\n")
	sb.WriteString("    TIMESTAMPDIFF(HOUR, da.start_datetime, da.end_datetime) as duration_hours\n")
	sb.WriteString("FROM driver_availability da\n")
	sb.WriteString("WHERE da.driver_id = 1\n")
	sb.WriteString("ORDER BY da.start_datetime DESC\n")
	sb.WriteString("LIMIT 20;\n")
	sb.WriteString("*/\n\n")

	sb.WriteString("-- Query 4: Find vehicles in maintenance this week\n")
	sb.WriteString("/*\n")
	sb.WriteString("SELECT \n")
	sb.WriteString("    v.id,\n")
	sb.WriteString("    v.make,\n")
	sb.WriteString("    v.model,\n")
	sb.WriteString("    va.start_datetime,\n")
	sb.WriteString("    va.end_datetime,\n")
	sb.WriteString("    va.availability_type,\n")
	sb.WriteString("    va.notes\n")
	sb.WriteString("FROM vehicles v\n")
	sb.WriteString("JOIN vehicle_availability va ON v.id = va.vehicle_id\n")
	sb.WriteString("WHERE va.availability_type IN ('MAINTENANCE', 'REPAIR', 'INSPECTION')\n")
	sb.WriteString("  AND va.start_datetime >= CURDATE()\n")
	sb.WriteString("  AND va.start_datetime < DATE_ADD(CURDATE(), INTERVAL 7 DAY)\n")
	sb.WriteString("ORDER BY va.start_datetime;\n")
	sb.WriteString("*/\n\n")

	sb.WriteString("-- Query 5: Count availability by type for all drivers last 30 days\n")
	sb.WriteString("/*\n")
	sb.WriteString("SELECT \n")
	sb.WriteString("    availability_type,\n")
	sb.WriteString("    COUNT(*) as occurrence_count,\n")
	sb.WriteString("    SUM(TIMESTAMPDIFF(HOUR, start_datetime, end_datetime)) as total_hours\n")
	sb.WriteString("FROM driver_availability\n")
	sb.WriteString("WHERE start_datetime >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)\n")
	sb.WriteString("GROUP BY availability_type\n")
	sb.WriteString("ORDER BY total_hours DESC;\n")
	sb.WriteString("*/\n\n")

	return sb.String()
}
