package commands

import (
	"azor-chatdog/cli"
	"azor-chatdog/llm"
	"fmt"
)

// DisplayFullSession displays the full session history
func DisplayFullSession(history []llm.Message, sessionID, assistantName string) {
	cli.PrintInfo(fmt.Sprintf("\n=== Historia Sesji: %s ===", sessionID))

	if len(history) == 0 {
		cli.PrintInfo("(Brak historii)")
		cli.PrintInfo("=============================\n")
		return
	}

	for _, msg := range history {
		if len(msg.Parts) == 0 {
			continue
		}

		text := msg.Parts[0].Text
		if msg.Role == "user" {
			cli.PrintInfo(fmt.Sprintf("\nTY: %s", text))
		} else {
			cli.PrintAssistant(fmt.Sprintf("\n%s: %s", assistantName, text))
		}
	}

	cli.PrintInfo("\n=============================\n")
}
