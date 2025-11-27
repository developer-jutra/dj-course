package main

import (
	"azor-chatdog/cli"
	"azor-chatdog/commands"
	"azor-chatdog/session"
	"fmt"
	"strings"
)

var validSlashCommands = []string{"/exit", "/quit", "/switch", "/help", "/session", "/pdf"}

// HandleCommand handles slash commands. Returns true if program should exit.
func HandleCommand(userInput string) bool {
	parts := strings.Fields(userInput)
	if len(parts) == 0 {
		return false
	}

	command := strings.ToLower(parts[0])
	manager := session.GetSessionManager()

	// Check if command is valid
	if !contains(validSlashCommands, command) {
		cli.PrintError(fmt.Sprintf("Błąd: Nieznana komenda: %s. Użyj /help.", command))
		current, _ := manager.GetCurrentSession()
		if current != nil {
			cli.DisplayHelp(current.SessionID())
		}
		return false
	}

	// Help command
	if command == "/help" {
		current, _ := manager.GetCurrentSession()
		if current != nil {
			cli.DisplayHelp(current.SessionID())
		}
		return false
	}

	// Exit commands
	if command == "/exit" || command == "/quit" {
		cli.PrintInfo("\nZakończenie czatu. Uruchamianie procedury finalnego zapisu...")
		return true
	}

	// Switch command
	if command == "/switch" {
		if len(parts) == 2 {
			newID := parts[1]
			current, _ := manager.GetCurrentSession()
			if current != nil && newID == current.SessionID() {
				cli.PrintInfo("Jesteś już w tej sesji.")
			} else {
				newSession, saveAttempted, previousSessionID, loadSuccessful, loadError, hasHistory := manager.SwitchToSession(newID)

				if saveAttempted {
					cli.PrintInfo(fmt.Sprintf("\nZapisuję bieżącą sesję: %s...", previousSessionID))
				}

				if !loadSuccessful {
					cli.PrintError(fmt.Sprintf("Nie można wczytać sesji o ID: %s. %v", newID, loadError))
				} else {
					cli.PrintInfo(fmt.Sprintf("\n--- Przełączono na sesję: %s ---", newSession.SessionID()))
					cli.DisplayHelp(newSession.SessionID())

					if hasHistory {
						commands.DisplayHistorySummary(newSession.GetHistory(), newSession.AssistantName())
					}
				}
			}
		} else {
			cli.PrintError("Błąd: Użycie: /switch <SESSION-ID>")
		}
		return false
	}

	// Session subcommands
	if command == "/session" {
		if len(parts) < 2 {
			cli.PrintError("Błąd: Komenda /session wymaga podkomendy (list, display, pop, clear, new).")
		} else {
			handleSessionSubcommand(strings.ToLower(parts[1]), manager)
		}
		return false
	}

	// PDF command
	if command == "/pdf" {
		cli.PrintInfo("Eksport do PDF nie jest jeszcze zaimplementowany w wersji Go.")
		return false
	}

	return false
}

func handleSessionSubcommand(subcommand string, manager *session.SessionManager) {
	current, _ := manager.GetCurrentSession()
	if current == nil {
		cli.PrintError("Brak aktywnej sesji.")
		return
	}

	switch subcommand {
	case "list":
		commands.ListSessionsCommand()

	case "display":
		commands.DisplayFullSession(current.GetHistory(), current.SessionID(), current.AssistantName())

	case "pop":
		success := current.PopLastExchange()
		if success {
			cli.PrintInfo(fmt.Sprintf("Usunięto ostatnią parę wpisów (TY i %s).", current.AssistantName()))
			commands.DisplayHistorySummary(current.GetHistory(), current.AssistantName())
		} else {
			cli.PrintError("Błąd: Historia jest pusta lub niekompletna (wymaga co najmniej jednej pary).")
		}

	case "clear":
		if err := current.ClearHistory(); err != nil {
			cli.PrintError(fmt.Sprintf("Błąd podczas czyszczenia historii: %v", err))
		} else {
			cli.PrintInfo("Historia bieżącej sesji została wyczyszczona.")
		}

	case "new":
		newSession, saveAttempted, previousSessionID, saveError := manager.CreateNewSession(true)

		if saveAttempted {
			cli.PrintInfo(fmt.Sprintf("\nZapisuję bieżącą sesję: %s przed rozpoczęciem nowej...", previousSessionID))
			if saveError != nil {
				cli.PrintError(fmt.Sprintf("Błąd podczas zapisu: %v", saveError))
			}
		}

		cli.PrintInfo(fmt.Sprintf("\n--- Rozpoczęto nową sesję: %s ---", newSession.SessionID()))
		cli.DisplayHelp(newSession.SessionID())

	case "remove":
		commands.RemoveSessionCommand(manager)

	default:
		cli.PrintError(fmt.Sprintf("Błąd: Nieznana podkomenda dla /session: %s. Użyj /help.", subcommand))
	}
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
