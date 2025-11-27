package cli

import (
	"flag"
	"os"
	"strings"
)

// GetSessionIDFromCLI retrieves session ID from command line arguments
func GetSessionIDFromCLI() string {
	// Check for --session-id flag
	sessionID := flag.String("session-id", "", "Session ID to load")
	flag.Parse()

	if *sessionID != "" {
		return *sessionID
	}

	// Also check for format --session-id=VALUE
	for _, arg := range os.Args[1:] {
		if strings.HasPrefix(arg, "--session-id=") {
			return strings.TrimPrefix(arg, "--session-id=")
		}
	}

	return ""
}
