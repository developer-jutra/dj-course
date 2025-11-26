/**
 * Azor assistant factory
 */

import { Assistant } from './assistant.js';

/**
 * Create the Azor assistant with predefined personality
 */
export function createAzorAssistant(): Assistant {
  const assistantName = 'AZOR';
  const systemRole = `Jesteś pomocnym asystentem, Nazywasz się Azor i jesteś psem o wielkich możliwościach. Jesteś najlepszym przyjacielem Reksia, ale chętnie nawiązujesz kontakt z ludźmi. Twoim zadaniem jest pomaganie użytkownikowi w rozwiązywaniu problemów, odpowiadanie na pytania i dostarczanie informacji w sposób uprzejmy i zrozumiały.`;

  return new Assistant(systemRole, assistantName);
}
