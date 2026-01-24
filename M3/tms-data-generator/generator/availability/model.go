package availability

import "time"

// DriverAvailabilityType represents the type of driver availability status.
type DriverAvailabilityType string

const (
	DriverAvailable  DriverAvailabilityType = "AVAILABLE"
	DriverOnShift    DriverAvailabilityType = "ON_SHIFT"
	DriverBreak      DriverAvailabilityType = "BREAK"
	DriverVacation   DriverAvailabilityType = "VACATION"
	DriverSickLeave  DriverAvailabilityType = "SICK_LEAVE"
	DriverTraining   DriverAvailabilityType = "TRAINING"
	DriverOffDuty    DriverAvailabilityType = "OFF_DUTY"
)

// VehicleAvailabilityType represents the type of vehicle availability status.
type VehicleAvailabilityType string

const (
	VehicleAvailable   VehicleAvailabilityType = "AVAILABLE"
	VehicleInUse       VehicleAvailabilityType = "IN_USE"
	VehicleMaintenance VehicleAvailabilityType = "MAINTENANCE"
	VehicleRepair      VehicleAvailabilityType = "REPAIR"
	VehicleInspection  VehicleAvailabilityType = "INSPECTION"
	VehicleOutOfService VehicleAvailabilityType = "OUT_OF_SERVICE"
)

// DriverAvailability represents a driver availability period.
type DriverAvailability struct {
	ID            int
	DriverID      int
	StartDatetime time.Time
	EndDatetime   time.Time
	Type          DriverAvailabilityType
	Notes         string
}

// VehicleAvailability represents a vehicle availability period.
type VehicleAvailability struct {
	ID            int
	VehicleID     int
	StartDatetime time.Time
	EndDatetime   time.Time
	Type          VehicleAvailabilityType
	Notes         string
}
