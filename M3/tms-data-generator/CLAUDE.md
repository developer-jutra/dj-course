# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Transportation Management System (TMS) SQL data generator** written in Go. It generates realistic test data for a logistics/delivery system with vehicles, drivers, customers, and orders. The output is a single `output/tms-latest.sql` file containing schema + INSERT statements.

## Common Commands

All operations use the Task runner (`Taskfile.yaml`):

- `task` or `task run` - Build binary and execute generator (default)
- `task run-go` - Direct `go run` execution (faster for development, no binary created)
- `task build` - Only compile the binary to `bin/tms-data-generator`
- `task clean` - Remove `bin/` and `output/` directories

Direct Go commands (if Task unavailable):
```bash
go run ./cmd/tms-data-generator        # Run without building
go build -o bin/tms-data-generator ./cmd/tms-data-generator  # Build binary
```

## Architecture

### Domain Model (6 Core Entities)

- **Vehicles**: Fleet management (make/model/year/fuel capacity)
- **Drivers**: Employee records with contract types and status
- **Customers**: Three types (INDIVIDUAL/BUSINESS/VIP) with contact info
- **Orders**: Delivery jobs linking customers to addresses with status tracking
- **Driver Availability**: Time-based tracking of driver availability, shifts, breaks, vacation, etc.
- **Vehicle Availability**: Time-based tracking of vehicle availability, usage, maintenance, repairs, etc.

### File Structure Pattern

Each domain follows the same 3-file structure:
```
generator/{domain}/
├── model.go      # Struct definitions and enums
├── {domain}.go   # Generate*() + GenerateInsertStatements() functions
```

### Concurrent Generation

`generator/generator.go` uses **goroutines + sync.WaitGroup** to generate all domains in parallel. Orders generation depends on customers (passed as parameter to maintain referential integrity).

The generator logs timing information for each domain and overall execution.

## Key Implementation Patterns

### SQL Generation Strategy

- **Single large INSERT statements** per table (not individual INSERTs per row)
- **String escaping**: Use `strings.ReplaceAll(value, "'", "''")` for SQL injection safety
- **Memory optimization**: `strings.Builder` with `Grow()` for pre-allocation
- **Formatted output**: Proper indentation and line breaks for readability

### Configuration

All entity counts centralized in `generator/config/count.go`:
```go
const (
    VEHICLES  = 50
    DRIVERS   = 20
    ORDERS    = 1000
    CUSTOMERS = 500
)
```

### Data Generation

- Uses `github.com/brianvoe/gofakeit/v6` library for realistic fake data
- Relationships handled by passing dependent entities as function parameters
- Realistic ranges via modulo operations (e.g., `i%5` for bounded randomness)

## Adding New Domains

1. Create `generator/{domain}/model.go` with structs and enums
2. Create `generator/{domain}/{domain}.go` with `Generate*()` and `GenerateInsertStatements()` functions
3. Add count constant to `generator/config/count.go`
4. Wire into `generator/generator.go` parallel execution (add goroutine)
5. Update `schema/create-tms-schema.sql` with table definitions

## Schema vs Generated SQL

⚠️ **Important**: `schema/create-tms-schema.sql` is embedded at the start of the generated SQL file. This file must contain all table definitions (CREATE TABLE statements) for all domains being generated. Currently incomplete - only has vehicles/drivers tables.

## Output

- Generated file: `output/tms-latest.sql`
- Contains timestamp, banner, schema (DROP/CREATE TABLE), and INSERT statements
- File size typically ~200KB with default configuration

## Dependencies

- Single external dependency: `github.com/brianvoe/gofakeit/v6`
- Go 1.24+ required (see `go.mod`)
- Task runner for build automation
