package llm

import (
	"context"
	"errors"
	"fmt"
	"os"

	"google.golang.org/genai"
)

// GeminiChatSessionWrapper wraps Gemini chat session
type GeminiChatSessionWrapper struct {
	client  *genai.Client
	model   string
	history []Message
	sysInst string
}

// SendMessage sends a message to Gemini
func (g *GeminiChatSessionWrapper) SendMessage(text string) (*Response, error) {
	ctx := context.Background()

	// Add user message to history
	g.history = append(g.history, Message{
		Role:  "user",
		Parts: []Part{{Text: text}},
	})

	// Build messages for API
	var contents []*genai.Content
	for _, msg := range g.history {
		if len(msg.Parts) > 0 {
			contents = append(contents, &genai.Content{
				Role: msg.Role,
				Parts: []*genai.Part{
					{Text: msg.Parts[0].Text},
				},
			})
		}
	}

	// Generate content with system instruction
	resp, err := g.client.Models.GenerateContent(ctx, g.model, contents, &genai.GenerateContentConfig{
		SystemInstruction: &genai.Content{
			Parts: []*genai.Part{
				{Text: g.sysInst},
			},
		},
	})
	if err != nil {
		return nil, err
	}

	// Extract response text
	var responseText string
	if len(resp.Candidates) > 0 && resp.Candidates[0].Content != nil {
		for _, part := range resp.Candidates[0].Content.Parts {
			if part.Text != "" {
				responseText += part.Text
			}
		}
	}

	// Update history
	g.history = append(g.history, Message{
		Role:  "model",
		Parts: []Part{{Text: responseText}},
	})

	return &Response{Text: responseText}, nil
}

// GetHistory returns conversation history
func (g *GeminiChatSessionWrapper) GetHistory() []Message {
	return g.history
}

// GeminiLLMClient encapsulates all Google Gemini AI interactions
type GeminiLLMClient struct {
	modelName string
	apiKey    string
	client    *genai.Client
}

// NewGeminiLLMClient creates a new Gemini LLM client
func NewGeminiLLMClient(modelName, apiKey string) (*GeminiLLMClient, error) {
	if apiKey == "" {
		return nil, errors.New("API key cannot be empty")
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Gemini client: %w", err)
	}

	return &GeminiLLMClient{
		modelName: modelName,
		apiKey:    apiKey,
		client:    client,
	}, nil
}

// PreparingForUseMessageGemini returns a message indicating that Gemini client is being prepared
func PreparingForUseMessageGemini() string {
	return "🤖 Przygotowywanie klienta Gemini..."
}

// FromEnvironmentGemini creates a GeminiLLMClient from environment variables
func FromEnvironmentGemini() (*GeminiLLMClient, error) {
	modelName := os.Getenv("MODEL_NAME")
	if modelName == "" {
		modelName = "gemini-2.5-flash"
	}
	apiKey := os.Getenv("GEMINI_API_KEY")

	config, err := ValidateGeminiConfig(modelName, apiKey)
	if err != nil {
		return nil, err
	}

	return NewGeminiLLMClient(config.ModelName, config.GeminiAPIKey)
}

// CreateChatSession creates a new chat session
func (g *GeminiLLMClient) CreateChatSession(systemInstruction string, history []Message, thinkingBudget int) (ChatSession, error) {
	return &GeminiChatSessionWrapper{
		client:  g.client,
		model:   g.modelName,
		history: history,
		sysInst: systemInstruction,
	}, nil
}

// CountHistoryTokens counts tokens in history
func (g *GeminiLLMClient) CountHistoryTokens(history []Message) (int, error) {
	if len(history) == 0 {
		return 0, nil
	}

	ctx := context.Background()

	// Convert to Gemini content
	var contents []*genai.Content
	for _, msg := range history {
		if len(msg.Parts) > 0 {
			contents = append(contents, &genai.Content{
				Role: msg.Role,
				Parts: []*genai.Part{
					{Text: msg.Parts[0].Text},
				},
			})
		}
	}

	// Count tokens
	resp, err := g.client.Models.CountTokens(ctx, g.modelName, contents, nil)
	if err != nil {
		return 0, err
	}

	return int(resp.TotalTokens), nil
}

// GetModelName returns the model name
func (g *GeminiLLMClient) GetModelName() string {
	return g.modelName
}

// IsAvailable checks if the client is available
func (g *GeminiLLMClient) IsAvailable() bool {
	return g.client != nil && g.apiKey != ""
}

// ReadyForUseMessage returns a ready message
func (g *GeminiLLMClient) ReadyForUseMessage() string {
	maskedKey := "****"
	if len(g.apiKey) > 8 {
		maskedKey = fmt.Sprintf("%s...%s", g.apiKey[:4], g.apiKey[len(g.apiKey)-4:])
	}
	return fmt.Sprintf("✅ Klient Gemini gotowy do użycia (Model: %s, Key: %s)", g.modelName, maskedKey)
}
