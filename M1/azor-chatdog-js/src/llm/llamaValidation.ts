/**
 * LLaMA configuration validation using Zod
 */

import { z } from 'zod';
import fs from 'fs';
import path from 'path';

/**
 * LLaMA configuration schema
 */
export const LlamaConfigSchema = z.object({
  engine: z.literal('LLAMA').default('LLAMA'),
  modelName: z.string().min(1, 'Model name is required'),
  llamaModelPath: z
    .string()
    .min(1, 'LLaMA model path is required')
    .refine((p) => fs.existsSync(p), {
      message: 'LLaMA model file does not exist',
    })
    .refine((p) => path.extname(p).toLowerCase() === '.gguf', {
      message: 'LLaMA model must be a .gguf file',
    }),
  llamaGpuLayers: z.number().int().min(0).default(1),
  llamaContextSize: z.number().int().min(1).default(2048),
});

export type LlamaConfig = z.infer<typeof LlamaConfigSchema>;

/**
 * Validate and parse LLaMA configuration from environment
 */
export function validateLlamaConfig(): LlamaConfig {
  const config = {
    engine: 'LLAMA' as const,
    modelName: process.env.MODEL_NAME || 'llama-3.1-8b-instruct',
    llamaModelPath: process.env.LLAMA_MODEL_PATH || '',
    llamaGpuLayers: parseInt(process.env.LLAMA_GPU_LAYERS || '1', 10),
    llamaContextSize: parseInt(process.env.LLAMA_CONTEXT_SIZE || '2048', 10),
  };

  return LlamaConfigSchema.parse(config);
}
