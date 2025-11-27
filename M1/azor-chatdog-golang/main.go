package main

import (
	"os"
	"os/signal"
	"syscall"
)

func main() {
	// Register cleanup handler for graceful shutdown
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigs
		Cleanup()
		os.Exit(0)
	}()

	// Initialize chat
	if err := InitChat(); err != nil {
		os.Exit(1)
	}

	// Run main loop
	MainLoop()

	// Cleanup
	Cleanup()
}
