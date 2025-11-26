# TMS Data Generator

This tool generates a `tms-latest.sql` file with sample data.

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
