package llm

import (
	"errors"
	"fmt"
)

// LlamaChatSession wraps a Llama chat session
// NOTE: This is a stub implementation. For full Llama support, install llama.cpp dependencies
type LlamaChatSession struct {
	systemInstruction string
	history           []Message
}

// SendMessage sends a message to Llama and returns response
// NOTE: Stub implementation - requires llama.cpp to be installed
func (l *LlamaChatSession) SendMessage(text string) (*Response, error) {
	// Add user message to history
	l.history = append(l.history, Message{
		Role:  "user",
		Parts: []Part{{Text: text}},
	})

	// Stub implementation - return error message
	errorMsg := "LLaMA support requires llama.cpp to be installed. Please use ENGINE=GEMINI or install llama.cpp dependencies."
	l.history = append(l.history, Message{
		Role:  "model",
		Parts: []Part{{Text: errorMsg}},
	})

	return &Response{Text: errorMsg}, nil
}

// GetHistory returns conversation history
func (l *LlamaChatSession) GetHistory() []Message {
	return l.history
}


// LlamaClient encapsulates all local Llama model interactions
// NOTE: Stub implementation - requires llama.cpp
type LlamaClient struct {
	modelName   string
	modelPath   string
	gpuLayers   int
	contextSize int
}

// NewLlamaClient creates a new Llama client
// NOTE: Stub implementation - requires llama.cpp
func NewLlamaClient(modelName, modelPath string, gpuLayers, contextSize int) (*LlamaClient, error) {
	if modelPath == "" {
		return nil, errors.New("model path cannot be empty")
	}

	return &LlamaClient{
		modelName:   modelName,
		modelPath:   modelPath,
		gpuLayers:   gpuLayers,
		contextSize: contextSize,
	}, nil
}

// PreparingForUseMessageLlama returns preparation message
func PreparingForUseMessageLlama() string {
	return "🦙 Przygotowywanie klienta llama.cpp..."
}

// FromEnvironmentLlama creates a Llama client from environment variables
func FromEnvironmentLlama() (*LlamaClient, error) {
	config, err := GetLlamaConfigFromEnv()
	if err != nil {
		return nil, err
	}

	return NewLlamaClient(config.ModelName, config.ModelPath, config.GPULayers, config.ContextSize)
}

// CreateChatSession creates a new chat session
// NOTE: Stub implementation
func (l *LlamaClient) CreateChatSession(systemInstruction string, history []Message, thinkingBudget int) (ChatSession, error) {
	return &LlamaChatSession{
		systemInstruction: systemInstruction,
		history:           history,
	}, nil
}

// CountHistoryTokens counts tokens in history
// NOTE: Stub implementation - uses approximation
func (l *LlamaClient) CountHistoryTokens(history []Message) (int, error) {
	if len(history) == 0 {
		return 0, nil
	}

	// Approximate token count (4 chars per token average)
	totalChars := 0
	for _, msg := range history {
		if len(msg.Parts) > 0 {
			totalChars += len(msg.Parts[0].Text)
		}
	}

	return totalChars / 4, nil
}

// GetModelName returns model name
func (l *LlamaClient) GetModelName() string {
	return l.modelName
}

// IsAvailable checks if client is available
func (l *LlamaClient) IsAvailable() bool {
	return true // Stub always returns true
}

// ReadyForUseMessage returns ready message
func (l *LlamaClient) ReadyForUseMessage() string {
	return fmt.Sprintf("✅ Klient llama.cpp gotowy do użycia (model lokalny: %s, Warstwy GPU: %d, Kontekst: %d)", l.modelName, l.gpuLayers, l.contextSize)
}
