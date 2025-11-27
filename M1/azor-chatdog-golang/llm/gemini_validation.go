package llm

import (
	"errors"
)

// GeminiConfig holds validated Gemini configuration
type GeminiConfig struct {
	ModelName    string
	GeminiAPIKey string
}

// ValidateGeminiConfig validates Gemini configuration from environment
func ValidateGeminiConfig(modelName, apiKey string) (*GeminiConfig, error) {
	if apiKey == "" {
		return nil, errors.New("GEMINI_API_KEY is required but not set")
	}
	if modelName == "" {
		modelName = "gemini-2.5-flash"
	}
	return &GeminiConfig{
		ModelName:    modelName,
		GeminiAPIKey: apiKey,
	}, nil
}
