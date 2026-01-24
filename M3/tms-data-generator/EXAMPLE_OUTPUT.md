# Example Generated SQL Output

This document shows examples of what the generated SQL looks like for the availability tables.

## Driver Availability Sample

```sql
INSERT INTO driver_availability (id, driver_id, start_datetime, end_datetime, availability_type, notes) VALUES
    (1, 1, '2024-11-25 08:00:00', '2024-11-25 16:00:00', 'ON_SHIFT', 'Regular shift'),
    (2, 1, '2024-11-25 12:00:00', '2024-11-25 12:30:00', 'BREAK', 'Lunch break'),
    (3, 1, '2024-11-26 00:00:00', '2024-11-27 00:00:00', 'OFF_DUTY', 'Day off'),
    (4, 1, '2024-11-27 09:00:00', '2024-11-27 17:00:00', 'ON_SHIFT', 'Regular shift'),
    (5, 1, '2024-11-27 17:00:00', '2024-11-27 20:00:00', 'AVAILABLE', 'Available for overtime'),
    (6, 2, '2024-11-25 00:00:00', '2024-11-30 00:00:00', 'VACATION', 'Annual leave'),
    (7, 3, '2024-11-25 08:30:00', '2024-11-25 16:30:00', 'ON_SHIFT', 'Regular shift'),
    (8, 3, '2024-11-26 00:00:00', '2024-11-27 00:00:00', 'SICK_LEAVE', 'Medical leave');
```

### Key Patterns:

1. **Regular Work Day**: Driver has ON_SHIFT period (8-9 hours)
2. **Break During Shift**: BREAK period (30 minutes) during work hours
3. **Overtime**: AVAILABLE period after regular shift
4. **Day Off**: OFF_DUTY for full 24-hour period
5. **Multi-day Vacation**: Single entry spanning multiple days
6. **Sick Leave**: Can extend across multiple days

## Vehicle Availability Sample

```sql
INSERT INTO vehicle_availability (id, vehicle_id, start_datetime, end_datetime, availability_type, notes) VALUES
    (1, 1, '2024-11-25 00:00:00', '2024-11-25 08:00:00', 'AVAILABLE', 'Ready for dispatch'),
    (2, 1, '2024-11-25 08:00:00', '2024-11-25 17:00:00', 'IN_USE', 'Active delivery route'),
    (3, 1, '2024-11-25 17:00:00', '2024-11-25 23:59:59', 'AVAILABLE', 'Available for night shift'),
    (4, 2, '2024-11-25 00:00:00', '2024-11-27 00:00:00', 'MAINTENANCE', 'Scheduled maintenance'),
    (5, 3, '2024-11-25 00:00:00', '2024-11-26 00:00:00', 'AVAILABLE', 'Standby - ready for use'),
    (6, 4, '2024-11-25 00:00:00', '2024-11-28 00:00:00', 'REPAIR', 'Engine repair'),
    (7, 5, '2024-11-25 07:30:00', '2024-11-25 15:30:00', 'IN_USE', 'Active delivery route');
```

### Key Patterns:

1. **Active Day**: Vehicle AVAILABLE morning → IN_USE during day → AVAILABLE evening
2. **Multi-day Maintenance**: Single MAINTENANCE entry spanning 2-3 days
3. **Standby**: AVAILABLE for full day when not scheduled
4. **Repairs**: REPAIR status can last several days
5. **Split Availability**: Vehicle can have multiple periods in one day

## Data Distribution

### Driver Availability Types (Approximate)
- ON_SHIFT: ~50%
- OFF_DUTY: ~20%
- AVAILABLE: ~15%
- BREAK: ~8%
- VACATION: ~4%
- SICK_LEAVE: ~2%
- TRAINING: ~1%

### Vehicle Availability Types (Approximate)
- IN_USE: ~50%
- AVAILABLE: ~35%
- MAINTENANCE: ~7%
- INSPECTION: ~4%
- REPAIR: ~3%
- OUT_OF_SERVICE: ~1%

## Generated SQL File Structure

```
output/tms-latest.sql
│
├── Timestamp comment
├── Banner/header
├── DROP TABLE statements
├── CREATE TABLE statements
├── CREATE INDEX statements
├── INSERT INTO vehicles
├── INSERT INTO drivers
├── INSERT INTO customers
├── INSERT INTO driver_availability    ← NEW
├── INSERT INTO vehicle_availability   ← NEW
├── INSERT INTO transportation_orders
├── INSERT INTO order_timeline_events
├── INSERT INTO order_items
└── Example queries (commented)        ← NEW
```

## Typical Data Volume

With default configuration:
- **Drivers**: 20
- **Vehicles**: 50
- **Driver Availability Records**: ~1,800 (20 drivers × 90 days × ~1 record/day)
- **Vehicle Availability Records**: ~4,500 (50 vehicles × 90 days × ~1 record/day)

Note: Actual counts vary due to multi-day events and split-day schedules.

## Query Examples in Generated File

The generator automatically includes commented query examples at the end of the SQL file:

```sql
-- ========================================
-- Example Availability Queries
-- ========================================

-- Query 1: Find drivers available tomorrow between 9:00-17:00
-- Query 2: Find vehicles available now
-- Query 3: Get driver availability history for driver ID 1
-- Query 4: Find vehicles in maintenance this week
-- Query 5: Count availability by type for all drivers last 30 days
```

These queries are ready to use - just uncomment and adjust dates as needed.
