package commands

import (
	"azor-chatdog/cli"
	"azor-chatdog/llm"
	"fmt"
)

// DisplayHistorySummary displays a summary of the session history
func DisplayHistorySummary(history []llm.Message, assistantName string) {
	cli.PrintInfo("\n=== Podsumowanie Historii ===")

	if len(history) == 0 {
		cli.PrintInfo("(Brak historii)")
		cli.PrintInfo("=============================\n")
		return
	}

	exchangeCount := len(history) / 2
	cli.PrintInfo(fmt.Sprintf("Liczba wymian: %d", exchangeCount))

	// Show last exchange if available
	if len(history) >= 2 {
		lastUserMsg := history[len(history)-2]
		lastAssistantMsg := history[len(history)-1]

		if len(lastUserMsg.Parts) > 0 && len(lastAssistantMsg.Parts) > 0 {
			cli.PrintInfo("\nOstatnia wymiana:")
			cli.PrintInfo(fmt.Sprintf("TY: %s", truncate(lastUserMsg.Parts[0].Text, 100)))
			cli.PrintAssistant(fmt.Sprintf("%s: %s", assistantName, truncate(lastAssistantMsg.Parts[0].Text, 100)))
		}
	}

	cli.PrintInfo("\n=============================\n")
}

func truncate(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen] + "..."
}
