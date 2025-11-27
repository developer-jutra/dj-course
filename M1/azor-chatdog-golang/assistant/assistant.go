package assistant

// Assistant represents an AI assistant with system prompt and identity configuration.
// Encapsulates the assistant's behavior and name, independent of the underlying model.
type Assistant struct {
	systemPrompt string
	name         string
}

// NewAssistant creates a new Assistant with system prompt and name configuration.
func NewAssistant(systemPrompt, name string) *Assistant {
	return &Assistant{
		systemPrompt: systemPrompt,
		name:         name,
	}
}

// SystemPrompt returns the system prompt for this assistant.
func (a *Assistant) SystemPrompt() string {
	return a.systemPrompt
}

// Name returns the display name for this assistant.
func (a *Assistant) Name() string {
	return a.name
}
