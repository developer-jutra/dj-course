/**
 * Welcome message and ASCII art
 */

import chalk from 'chalk';

/**
 * Generate dog ASCII art with speech bubble
 */
function printAssistantArt(text: string): string {
  const textLength = text.length;
  const top = '   ' + '-'.repeat(textLength + 2) + '.';
  const middle = '  ( ' + text + ' )';
  const bottom = '   ' + '-'.repeat(textLength + 2) + "'";
  const tail1 = '      \\';
  const tail2 = '       \\';
  const dogArt = `
           ,////,
          /  ' ,)
         (ò____/
        /  ~ \\
       |  /   \`----.
       | |         |
      /   \\        |
     ~   / \\
    ~   |   \\
       /     \\
      '       '
`;

  return `${top}\n${middle}\n${bottom}\n${tail1}\n${tail2}${dogArt}`;
}

/**
 * Print welcome ASCII art and banner
 */
export function printWelcome(): void {
  const asciiArt = `
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║      █████╗ ███████╗ ██████╗ ██████╗                     ║
    ║     ██╔══██╗╚══███╔╝██╔═══██╗██╔══██╗                    ║
    ║     ███████║  ███╔╝ ██║   ██║██████╔╝                    ║
    ║     ██╔══██║ ███╔╝  ██║   ██║██╔══██╗                    ║
    ║     ██║  ██║███████╗╚██████╔╝██║  ██║                    ║
    ║     ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝                    ║
    ║                                                           ║
    ║               🐕 The ChatDog Assistant 🐕                 ║
    ║                                                           ║
    ║           Your friendly AI companion for chat!           ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
  `;

  console.log(chalk.cyan(asciiArt));
  console.log(printAssistantArt('Woof Woof!'));
}
