package commands

import (
	"azor-chatdog/cli"
	"azor-chatdog/files"
	"fmt"
)

// ListSessionsCommand lists all available sessions
func ListSessionsCommand() {
	sessions := files.ListSessions()

	if len(sessions) == 0 {
		cli.PrintInfo("Brak zapisanych sesji.")
		return
	}

	cli.PrintInfo("\n=== Dostępne Sesje ===")
	for _, session := range sessions {
		if session.Error != "" {
			cli.PrintError(fmt.Sprintf("  %s - %s", session.ID, session.Error))
		} else {
			cli.PrintInfo(fmt.Sprintf("  %s - %d wiadomości (ostatnia: %s)", session.ID, session.MessagesCount, session.LastActivity))
		}
	}
	cli.PrintInfo("======================\n")
}
