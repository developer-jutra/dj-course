package commands

import (
	"azor-chatdog/cli"
	"azor-chatdog/session"
	"fmt"
)

// RemoveSessionCommand removes the current session
func RemoveSessionCommand(manager *session.SessionManager) {
	newSession, removedID, success, err := manager.RemoveCurrentSessionAndCreateNew()

	if !success || err != nil {
		if err != nil {
			cli.PrintError(fmt.Sprintf("Błąd podczas usuwania sesji: %v", err))
		} else {
			cli.PrintError("Nie udało się usunąć sesji.")
		}
		return
	}

	cli.PrintInfo(fmt.Sprintf("Usunięto sesję: %s", removedID))
	cli.PrintInfo(fmt.Sprintf("Rozpoczęto nową sesję: %s", newSession.SessionID()))
	cli.DisplayHelp(newSession.SessionID())
}
