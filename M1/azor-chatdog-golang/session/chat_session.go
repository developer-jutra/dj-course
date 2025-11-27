package session

import (
	"azor-chatdog/assistant"
	"azor-chatdog/files"
	"azor-chatdog/llm"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/google/uuid"
)

const maxContextTokens = 32768

// EngineMapping maps engine names to client creation functions
var EngineMapping = map[string]func() (llm.LLMClient, error){
	"LLAMA_CPP": func() (llm.LLMClient, error) {
		return llm.FromEnvironmentLlama()
	},
	"GEMINI": func() (llm.LLMClient, error) {
		return llm.FromEnvironmentGemini()
	},
}

// ChatSession manages everything related to a single chat session
type ChatSession struct {
	assistant      *assistant.Assistant
	sessionID      string
	history        []llm.Message
	llmClient      llm.LLMClient
	llmChatSession llm.ChatSession
}

// NewChatSession creates a new chat session
func NewChatSession(asst *assistant.Assistant, sessionID string, history []llm.Message) (*ChatSession, error) {
	if sessionID == "" {
		sessionID = uuid.New().String()
	}

	session := &ChatSession{
		assistant: asst,
		sessionID: sessionID,
		history:   history,
	}

	if err := session.initializeLLMSession(); err != nil {
		return nil, err
	}

	return session, nil
}

// initializeLLMSession creates or recreates the LLM chat session
func (c *ChatSession) initializeLLMSession() error {
	// Get engine from environment
	engine := strings.ToUpper(os.Getenv("ENGINE"))
	if engine == "" {
		engine = "GEMINI"
	}

	// Validate engine
	clientFactory, ok := EngineMapping[engine]
	if !ok {
		validEngines := make([]string, 0, len(EngineMapping))
		for k := range EngineMapping {
			validEngines = append(validEngines, k)
		}
		return fmt.Errorf("ENGINE must be one of: %s, got: %s", strings.Join(validEngines, ", "), engine)
	}

	// Initialize LLM client if needed
	if c.llmClient == nil {
		var err error
		c.llmClient, err = clientFactory()
		if err != nil {
			return err
		}
	}

	// Create chat session
	var err error
	c.llmChatSession, err = c.llmClient.CreateChatSession(
		c.assistant.SystemPrompt(),
		c.history,
		0, // thinking budget
	)
	if err != nil {
		return err
	}

	return nil
}

// LoadFromFile loads a session from disk
func LoadFromFile(asst *assistant.Assistant, sessionID string) (*ChatSession, error) {
	history, err := files.LoadSessionHistory(sessionID)
	if err != nil {
		return nil, err
	}

	// Convert files.Message to llm.Message
	llmHistory := make([]llm.Message, len(history))
	for i, msg := range history {
		llmHistory[i] = llm.Message{
			Role: msg.Role,
			Parts: []llm.Part{
				{Text: msg.Parts[0].Text},
			},
		}
	}

	return NewChatSession(asst, sessionID, llmHistory)
}

// SaveToFile saves the session to disk
func (c *ChatSession) SaveToFile() error {
	// Sync history from LLM session
	if c.llmChatSession != nil {
		c.history = c.llmChatSession.GetHistory()
	}

	// Convert llm.Message to files.Message
	filesHistory := make([]files.Message, len(c.history))
	for i, msg := range c.history {
		filesHistory[i] = files.Message{
			Role: msg.Role,
			Parts: []files.Part{
				{Text: msg.Parts[0].Text},
			},
		}
	}

	return files.SaveSessionHistory(
		c.sessionID,
		filesHistory,
		c.assistant.SystemPrompt(),
		c.llmClient.GetModelName(),
	)
}

// SendMessage sends a message and returns response
func (c *ChatSession) SendMessage(text string) (*llm.Response, error) {
	if c.llmChatSession == nil {
		return nil, errors.New("LLM session not initialized")
	}

	response, err := c.llmChatSession.SendMessage(text)
	if err != nil {
		return nil, err
	}

	// Sync history
	c.history = c.llmChatSession.GetHistory()

	// Log to WAL
	totalTokens := c.CountTokens()
	_ = files.AppendToWAL(
		c.sessionID,
		text,
		response.Text,
		totalTokens,
		c.llmClient.GetModelName(),
	)

	return response, nil
}

// GetHistory returns conversation history
func (c *ChatSession) GetHistory() []llm.Message {
	if c.llmChatSession != nil {
		c.history = c.llmChatSession.GetHistory()
	}
	return c.history
}

// ClearHistory clears all conversation history
func (c *ChatSession) ClearHistory() error {
	c.history = []llm.Message{}
	if err := c.initializeLLMSession(); err != nil {
		return err
	}
	return c.SaveToFile()
}

// PopLastExchange removes the last user-assistant exchange
func (c *ChatSession) PopLastExchange() bool {
	currentHistory := c.GetHistory()

	if len(currentHistory) < 2 {
		return false
	}

	// Remove last 2 entries
	c.history = currentHistory[:len(currentHistory)-2]

	// Reinitialize LLM session
	if err := c.initializeLLMSession(); err != nil {
		return false
	}

	_ = c.SaveToFile()

	return true
}

// CountTokens counts total tokens in history
func (c *ChatSession) CountTokens() int {
	if c.llmClient == nil {
		return 0
	}
	count, _ := c.llmClient.CountHistoryTokens(c.history)
	return count
}

// IsEmpty checks if session has any complete exchanges
func (c *ChatSession) IsEmpty() bool {
	return len(c.history) < 2
}

// GetRemainingTokens calculates remaining tokens
func (c *ChatSession) GetRemainingTokens() int {
	total := c.CountTokens()
	return maxContextTokens - total
}

// GetTokenInfo gets comprehensive token information
func (c *ChatSession) GetTokenInfo() (int, int, int) {
	total := c.CountTokens()
	remaining := maxContextTokens - total
	return total, remaining, maxContextTokens
}

// AssistantName gets the assistant's display name
func (c *ChatSession) AssistantName() string {
	return c.assistant.Name()
}

// SessionID returns the session ID
func (c *ChatSession) SessionID() string {
	return c.sessionID
}
