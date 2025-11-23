# TMS Data Generator - AI Agent Instructions

## Project Overview
This is a **Transportation Management System (TMS) SQL data generator** written in Go. It generates realistic test data for a logistics/delivery system with vehicles, drivers, customers, and orders. The output is a single `output/tms-latest.sql` file containing schema + INSERT statements.

## Architecture & Data Flow

### Domain Model (4 core entities)
- **Vehicles**: Fleet management (make/model/year/fuel capacity)
- **Drivers**: Employee records with contract types and status
- **Customers**: Three types (INDIVIDUAL/BUSINESS/VIP) with contact info
- **Orders**: Delivery jobs linking customers to addresses with status tracking

### Generation Pattern
Each domain follows the same 3-file structure:
```
generator/{domain}/
├── model.go      # Struct definitions and enums
├── {domain}.go   # Generate*() + GenerateInsertStatements() functions
```

### Concurrent Generation
`generator/generator.go` uses **goroutines + sync.WaitGroup** to generate all domains in parallel, with timing logs. Orders generation depends on customers (passed as parameter).

## Key Implementation Patterns

### SQL Generation Strategy
- **Single large INSERT statements** per table (not individual INSERTs)
- **String escaping**: Use `strings.ReplaceAll(value, "'", "''")` for SQL injection safety
- **Memory optimization**: `strings.Builder` with `Grow()` for pre-allocation
- **Formatted output**: Proper indentation and line breaks for readability

### Configuration
All counts centralized in `generator/config/count.go`:
```go
const (
    VEHICLES = 50; DRIVERS = 20; ORDERS = 1000; CUSTOMERS = 500
)
```

### Build System (Task-based)
Use `Taskfile.yaml` for all operations:
- `task` or `task run` - Build binary and run (default)
- `task run-go` - Direct `go run` execution (faster for development)
- `task clean` - Remove `bin/` and `output/` directories

## Development Workflows

### Adding New Domains
1. Create `generator/{domain}/model.go` with structs and enums
2. Create `generator/{domain}/{domain}.go` with `Generate*()` functions
3. Add constants to `generator/config/count.go`
4. Wire into `generator/generator.go` parallel execution
5. Update schema if table structure changes

### Modifying Data Generation
- **Fake data**: Uses `github.com/brianvoe/gofakeit/v6` library extensively
- **Relationships**: Pass dependent entities as function parameters (e.g., customers → orders)
- **Realistic ranges**: Use modulo operations for bounded randomness (`i%5` for years)

### Schema vs Generated SQL
⚠️ **Current gap**: `schema/create-tms-schema.sql` only contains vehicles/drivers tables, but code generates customers/orders. The schema file is incomplete and should be updated when adding new domains.

## File Structure Conventions
- `cmd/tms-data-generator/main.go` - Single-purpose entry point
- `generator/copyrights.go` - Contains the Polish delivery company banner
- `output/tms-latest.sql` - Generated file (1600+ lines with sample data)
- Binary output always goes to `bin/tms-data-generator`

## Testing & Debugging
- **Performance monitoring**: Generator prints timing for each domain
- **Concurrency info**: Logs `GOMAXPROCS` value
- **Output validation**: Check generated SQL syntax and row counts match config constants
- Use `task run-go` for faster iteration during development

## External Dependencies
- Single external dependency: `github.com/brianvoe/gofakeit/v6` for realistic fake data
- Go 1.24+ required (see `go.mod`)
- Task runner preferred over direct go commands