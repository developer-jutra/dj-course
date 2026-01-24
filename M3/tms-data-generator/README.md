# TMS Data Generator

This tool generates a `tms-latest.sql` file with realistic sample data for a Transportation Management System (TMS).

## Features

- **Vehicles**: Fleet with make, model, year, and fuel capacity
- **Drivers**: Employee records with contracts and status
- **Customers**: Individual, business, and VIP customers
- **Transportation Orders**: Delivery orders with items and timeline tracking
- **Driver Availability**: Time-based tracking of driver shifts, breaks, vacation, sick leave, and training
- **Vehicle Availability**: Time-based tracking of vehicle usage, maintenance, repairs, and inspections

Generated data includes:
- 90 days of availability data (60 days historical + 30 days future)
- Realistic work patterns and schedules
- Proper referential integrity between all tables
- Example SQL queries for common availability lookups

For detailed information about the availability feature, see [AVAILABILITY_FEATURE.md](./AVAILABILITY_FEATURE.md).

## Usage

### Task

First, make sure `task` is installed and available in your PATH.

For commands, see `./Taskfile.yaml`.

```bash
task run
```

### Run without Compiling

To run the generator without creating a separate executable binary, use `go run`. This command compiles and runs the program in one step.

```bash
go run ./cmd/tms-data-generator
```

or with task:

```bash
task go-run
```

### Compile and Run

If you want to build a standalone executable, use the `go build` command. This is useful for distributing the application.

```bash
go build -o tms-data-generator ./cmd/tms-data-generator
./bin/tms-data-generator
```

or with task (build first is automatic):

```bash
task # default
task run
```
