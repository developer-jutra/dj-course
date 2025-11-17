/**
 * Terminal output utilities
 * Color scheme matches Python version using colorama
 */

import chalk from 'chalk';

/**
 * Print error message in red (Fore.RED)
 */
export function printError(message: string): void {
  console.log(chalk.red(message));
}

/**
 * Print success message in green
 */
export function printSuccess(message: string): void {
  console.log(chalk.green(message));
}

/**
 * Print info message in default color (no color in Python version)
 */
export function printInfo(message: string): void {
  console.log(message);
}

/**
 * Print help message in yellow (Fore.YELLOW)
 */
export function printHelp(message: string): void {
  console.log(chalk.yellow(message));
}

/**
 * Print warning message in yellow
 */
export function printWarning(message: string): void {
  console.log(chalk.yellow(message));
}

/**
 * Print assistant message in cyan (Fore.CYAN)
 */
export function printAssistant(message: string): void {
  console.log(chalk.cyan(message));
}

/**
 * Print user message in blue (Fore.BLUE)
 */
export function printUser(message: string): void {
  console.log(chalk.blue(message));
}

/**
 * Display help information (matches Python version)
 */
export function displayHelp(sessionId?: string): void {
  if (sessionId) {
    printInfo(`Aktualna sesja (ID): ${sessionId}`);
  }
  printHelp('Dostępne komendy (slash commands):');
  printHelp('  /switch <ID>      - Przełącza na istniejącą sesję.');
  printHelp('  /help             - Wyświetla tę pomoc.');
  printHelp('  /exit, /quit      - Zakończenie czatu.');
  printHelp('\n  /session list     - Wyświetla listę dostępnych sesji.');
  printHelp('  /session display  - Wyświetla całą historię sesji.');
  printHelp('  /session pop      - Usuwa ostatnią parę wpisów (TY i asystent).');
  printHelp('  /session clear    - Czyści historię bieżącej sesji.');
  printHelp('  /session new      - Rozpoczyna nową sesję.');
}

/**
 * Print a separator line
 */
export function printSeparator(): void {
  console.log(chalk.gray('─'.repeat(60)));
}

/**
 * Clear the console
 */
export function clearConsole(): void {
  console.clear();
}
