package files

import (
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
)

var (
	// LogDir is the directory where session logs are stored
	LogDir string
	// OutputDir is the directory for output files (PDFs, etc.)
	OutputDir string
	// WALFile is the Write-Ahead Log file path
	WALFile string
)

func init() {
	// Initialize paths
	homeDir, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}

	LogDir = filepath.Join(homeDir, ".azor")
	OutputDir = filepath.Join(LogDir, "output")
	WALFile = filepath.Join(LogDir, "azor-wal.json")

	// Create directories
	if err := os.MkdirAll(LogDir, 0755); err != nil {
		panic(err)
	}
	if err := os.MkdirAll(OutputDir, 0755); err != nil {
		panic(err)
	}

	// Load environment variables
	_ = godotenv.Load()
}
