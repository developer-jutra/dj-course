# TMS Data Generator - Driver & Vehicle Availability Feature

## Overview

This document describes the implementation of the driver and vehicle availability tracking system added to the TMS Data Generator.

## Database Schema

### New Tables

#### `driver_availability`
Tracks time periods when drivers are available, on shift, on break, or unavailable.

```sql
CREATE TABLE driver_availability (
    id INT PRIMARY KEY,
    driver_id INT NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    availability_type VARCHAR(20) NOT NULL,
    notes VARCHAR(255),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);
```

**Availability Types:**
- `AVAILABLE` - Driver is available for assignment
- `ON_SHIFT` - Driver is actively working
- `BREAK` - Driver is on a break
- `OFF_DUTY` - Driver's day off
- `VACATION` - Driver is on vacation
- `SICK_LEAVE` - Driver is on sick leave
- `TRAINING` - Driver is in training

#### `vehicle_availability`
Tracks time periods when vehicles are available, in use, or in maintenance.

```sql
CREATE TABLE vehicle_availability (
    id INT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP NOT NULL,
    availability_type VARCHAR(20) NOT NULL,
    notes VARCHAR(255),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
```

**Availability Types:**
- `AVAILABLE` - Vehicle is ready for use
- `IN_USE` - Vehicle is currently being used
- `MAINTENANCE` - Vehicle is undergoing scheduled maintenance
- `REPAIR` - Vehicle is being repaired
- `INSPECTION` - Vehicle is undergoing inspection
- `OUT_OF_SERVICE` - Vehicle is out of service

### Indexes

For optimal query performance, the following indexes are created:

```sql
-- Driver availability indexes
CREATE INDEX idx_driver_availability_driver ON driver_availability(driver_id);
CREATE INDEX idx_driver_availability_dates ON driver_availability(start_datetime, end_datetime);
CREATE INDEX idx_driver_availability_type ON driver_availability(availability_type);

-- Vehicle availability indexes
CREATE INDEX idx_vehicle_availability_vehicle ON vehicle_availability(vehicle_id);
CREATE INDEX idx_vehicle_availability_dates ON vehicle_availability(start_datetime, end_datetime);
CREATE INDEX idx_vehicle_availability_type ON vehicle_availability(availability_type);
```

## Data Generation

### Time Range
- Historical data: Last 60 days
- Future data: Next 30 days
- Total: 90 days of availability data per driver/vehicle

### Driver Availability Generation

**Working Days (70% probability):**
- 8-hour shifts starting between 8-10 AM
- 30% chance of a lunch break (30 minutes)
- 20% chance of overtime availability (2-4 hours after shift)

**Off Days (30% probability):**
- Various status types: OFF_DUTY, VACATION, SICK_LEAVE, TRAINING
- Vacation and sick leave can extend 2-6 days (30% chance)

### Vehicle Availability Generation

**In Use (65% probability):**
- Active during business hours (7-9 AM start)
- 8-11 hour usage periods
- Available before/after use periods

**Available All Day (20% probability):**
- Standby status
- Ready for dispatch

**Maintenance/Repair (15% probability):**
- Various maintenance types
- Can extend 1-3 days (40% chance for maintenance/repair)

## Example Queries

### 1. Find Drivers Available Tomorrow Between 9:00-17:00

```sql
SELECT DISTINCT d.id, d.first_name, d.last_name, d.phone
FROM drivers d
WHERE NOT EXISTS (
    SELECT 1
    FROM driver_availability da
    WHERE da.driver_id = d.id
      AND da.availability_type NOT IN ('AVAILABLE', 'ON_SHIFT')
      AND da.start_datetime <= '2025-01-25 17:00:00'
      AND da.end_datetime >= '2025-01-25 09:00:00'
)
ORDER BY d.last_name;
```

### 2. Find Vehicles Available Now

```sql
SELECT v.id, v.make, v.model, v.year
FROM vehicles v
WHERE EXISTS (
    SELECT 1
    FROM vehicle_availability va
    WHERE va.vehicle_id = v.id
      AND va.availability_type = 'AVAILABLE'
      AND va.start_datetime <= NOW()
      AND va.end_datetime >= NOW()
)
ORDER BY v.make, v.model;
```

### 3. Get Driver Availability History

```sql
SELECT
    da.start_datetime,
    da.end_datetime,
    da.availability_type,
    da.notes,
    TIMESTAMPDIFF(HOUR, da.start_datetime, da.end_datetime) as duration_hours
FROM driver_availability da
WHERE da.driver_id = 1
ORDER BY da.start_datetime DESC
LIMIT 20;
```

### 4. Find Vehicles in Maintenance This Week

```sql
SELECT
    v.id,
    v.make,
    v.model,
    va.start_datetime,
    va.end_datetime,
    va.availability_type,
    va.notes
FROM vehicles v
JOIN vehicle_availability va ON v.id = va.vehicle_id
WHERE va.availability_type IN ('MAINTENANCE', 'REPAIR', 'INSPECTION')
  AND va.start_datetime >= CURDATE()
  AND va.start_datetime < DATE_ADD(CURDATE(), INTERVAL 7 DAY)
ORDER BY va.start_datetime;
```

### 5. Availability Statistics by Type (Last 30 Days)

```sql
SELECT
    availability_type,
    COUNT(*) as occurrence_count,
    SUM(TIMESTAMPDIFF(HOUR, start_datetime, end_datetime)) as total_hours
FROM driver_availability
WHERE start_datetime >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY availability_type
ORDER BY total_hours DESC;
```

## Implementation Details

### File Structure

```
generator/
├── availability/
│   ├── model.go              # Data structures and enums
│   └── availability.go       # Generation and SQL logic
```

### Key Functions

- `GenerateDriverAvailability(driverCount int)` - Generates realistic driver availability periods
- `GenerateVehicleAvailability(vehicleCount int)` - Generates realistic vehicle availability periods
- `GenerateDriverAvailabilityInsertStatements()` - Creates SQL INSERT statements
- `GenerateVehicleAvailabilityInsertStatements()` - Creates SQL INSERT statements
- `GenerateExampleQueries()` - Returns example queries for documentation

### Parallel Generation

Availability data is generated in parallel with transportation orders in Phase 2:
- Driver availability generation runs concurrently
- Vehicle availability generation runs concurrently
- No dependencies between these generations

## Data Characteristics

### Realistic Proportions

**Driver Availability:**
- ~70% working days (ON_SHIFT)
- ~15% available/on-call
- ~10% vacation/sick leave
- ~5% training/other

**Vehicle Availability:**
- ~65% in use during business hours
- ~20% available/standby
- ~15% maintenance/repair/inspection

### Smart Data Generation

- Multi-day events for vacation, sick leave, and major maintenance
- Realistic work hours (7-10 AM starts)
- Break periods during shifts
- Overtime opportunities after regular shifts
- Notes provide context for each availability period

## Usage

After running the generator with `task run`, the output file `output/tms-latest.sql` will contain:
- Table definitions
- Data for all entities (including availability)
- Example queries at the end of the file

The generated SQL file can be executed on any clean SQL database to populate it with realistic test data including comprehensive availability tracking.

## Query Performance

The indexes ensure efficient queries for:
- Finding available drivers/vehicles in a time range
- Looking up availability by driver/vehicle ID
- Filtering by availability type
- Time-based range queries

Common query patterns execute in O(log n) time due to B-tree indexes on datetime ranges and foreign keys.
