/**
 * Gemini configuration validation using Zod
 */

import { z } from 'zod';

/**
 * Gemini configuration schema
 */
export const GeminiConfigSchema = z.object({
  engine: z.literal('GEMINI').default('GEMINI'),
  modelName: z.string().min(1, 'Model name is required'),
  geminiApiKey: z.string().min(1, 'Gemini API key is required'),
});

export type GeminiConfig = z.infer<typeof GeminiConfigSchema>;

/**
 * Validate and parse Gemini configuration from environment
 */
export function validateGeminiConfig(): GeminiConfig {
  const config = {
    engine: 'GEMINI' as const,
    modelName: process.env.MODEL_NAME || 'gemini-2.5-flash',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  };

  return GeminiConfigSchema.parse(config);
}
