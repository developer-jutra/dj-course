package llm

import (
	"errors"
	"os"
	"strconv"
)

// LlamaConfig holds validated Llama configuration
type LlamaConfig struct {
	ModelName      string
	ModelPath      string
	GPULayers      int
	ContextSize    int
}

// ValidateLlamaConfig validates Llama configuration from environment
func ValidateLlamaConfig(modelName, modelPath string, gpuLayers, contextSize int) (*LlamaConfig, error) {
	if modelPath == "" {
		return nil, errors.New("LLAMA_MODEL_PATH is required but not set")
	}
	if _, err := os.Stat(modelPath); os.IsNotExist(err) {
		return nil, errors.New("LLAMA_MODEL_PATH file does not exist: " + modelPath)
	}
	if modelName == "" {
		modelName = "llama-3.1-8b-instruct"
	}
	if gpuLayers == 0 {
		gpuLayers = 1
	}
	if contextSize == 0 {
		contextSize = 2048
	}
	return &LlamaConfig{
		ModelName:   modelName,
		ModelPath:   modelPath,
		GPULayers:   gpuLayers,
		ContextSize: contextSize,
	}, nil
}

// GetLlamaConfigFromEnv gets Llama config from environment variables
func GetLlamaConfigFromEnv() (*LlamaConfig, error) {
	modelName := os.Getenv("LLAMA_MODEL_NAME")
	if modelName == "" {
		modelName = os.Getenv("MODEL_NAME")
	}
	modelPath := os.Getenv("LLAMA_MODEL_PATH")

	gpuLayersStr := os.Getenv("LLAMA_GPU_LAYERS")
	gpuLayers, _ := strconv.Atoi(gpuLayersStr)
	if gpuLayers == 0 {
		gpuLayers = 1
	}

	contextSizeStr := os.Getenv("LLAMA_CONTEXT_SIZE")
	contextSize, _ := strconv.Atoi(contextSizeStr)
	if contextSize == 0 {
		contextSize = 2048
	}

	return ValidateLlamaConfig(modelName, modelPath, gpuLayers, contextSize)
}
