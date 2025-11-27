package commands

import (
	"azor-chatdog/cli"
)

// PrintWelcome prints the welcome message
func PrintWelcome() {
	cli.PrintInfo("===================================")
	cli.PrintInfo("   AZOR the CHATDOG - Go Edition")
	cli.PrintInfo("===================================\n")
}
