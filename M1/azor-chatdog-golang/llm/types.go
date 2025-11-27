package llm

// Message represents a single message in universal format
type Message struct {
	Role  string `json:"role"`
	Parts []Part `json:"parts"`
}

// Part represents a text part of a message
type Part struct {
	Text string `json:"text"`
}

// Response represents the response from an LLM
type Response struct {
	Text string
}

// ChatSession is a universal interface for chat sessions
type ChatSession interface {
	SendMessage(text string) (*Response, error)
	GetHistory() []Message
}

// LLMClient is a universal interface for LLM clients
type LLMClient interface {
	CreateChatSession(systemInstruction string, history []Message, thinkingBudget int) (ChatSession, error)
	CountHistoryTokens(history []Message) (int, error)
	GetModelName() string
	IsAvailable() bool
	ReadyForUseMessage() string
}
