package cli

import (
	"azor-chatdog/files"
	"fmt"
	"os"

	"github.com/fatih/color"
)

var (
	red    = color.New(color.FgRed).SprintFunc()
	cyan   = color.New(color.FgCyan).SprintFunc()
	yellow = color.New(color.FgYellow).SprintFunc()
	white  = color.New(color.FgWhite, color.Bold).SprintFunc()
)

// PrintError prints an error message in red
func PrintError(message string) {
	fmt.Println(red(message))
}

// PrintAssistant prints an assistant message in cyan
func PrintAssistant(message string) {
	fmt.Println(cyan(message))
}

// PrintUser prints a user message in blue
func PrintUser(message string) {
	fmt.Println(message)
}

// PrintInfo prints an informational message
func PrintInfo(message string) {
	fmt.Println(message)
}

// PrintHelp prints a help message in yellow
func PrintHelp(message string) {
	fmt.Println(yellow(message))
}

// DisplayHelp displays a short help message
func DisplayHelp(sessionID string) {
	PrintInfo(fmt.Sprintf("Aktualna sesja (ID): %s", sessionID))
	PrintInfo(fmt.Sprintf("Pliki sesji są zapisywane na bieżąco w: %s", files.LogDir))
	PrintHelp("Dostępne komendy (slash commands):")
	PrintHelp("  /switch <ID>      - Przełącza na istniejącą sesję.")
	PrintHelp("  /help             - Wyświetla tę pomoc.")
	PrintHelp("  /exit, /quit      - Zakończenie czatu.")
	PrintHelp("\n  /session list     - Wyświetla listę dostępnych sesji.")
	PrintHelp("  /session display  - Wyświetla całą historię sesji.")
	PrintHelp("  /session pop      - Usuwa ostatnią parę wpisów (TY i asystent).")
	PrintHelp("  /session clear    - Czyści historię bieżącej sesji.")
	PrintHelp("  /session new      - Rozpoczyna nową sesję.")
}

// DisplayFinalInstructions displays instructions for continuing the session
func DisplayFinalInstructions(sessionID string) {
	PrintInfo("\n--- Instrukcja Kontynuacji Sesji ---")
	PrintInfo(fmt.Sprintf("Aby kontynuować tę sesję (ID: %s) później, użyj komendy:", sessionID))
	fmt.Printf("\n    %s\n\n", white(fmt.Sprintf("%s --session-id=%s", os.Args[0], sessionID)))
	fmt.Println("--------------------------------------\n")
}
