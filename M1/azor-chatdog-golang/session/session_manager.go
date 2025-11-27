package session

import (
	"azor-chatdog/assistant"
	"azor-chatdog/files"
	"azor-chatdog/llm"
	"errors"
)

var globalSessionManager *SessionManager

// SessionManager orchestrates session lifecycle
type SessionManager struct {
	currentSession *ChatSession
}

// NewSessionManager creates a new session manager
func NewSessionManager() *SessionManager {
	return &SessionManager{}
}

// GetSessionManager returns the global session manager
func GetSessionManager() *SessionManager {
	if globalSessionManager == nil {
		globalSessionManager = NewSessionManager()
	}
	return globalSessionManager
}

// GetCurrentSession returns the current active session
func (sm *SessionManager) GetCurrentSession() (*ChatSession, error) {
	if sm.currentSession == nil {
		return nil, errors.New("no active session. Call CreateNewSession() or SwitchToSession() first")
	}
	return sm.currentSession, nil
}

// HasActiveSession returns true if there's an active session
func (sm *SessionManager) HasActiveSession() bool {
	return sm.currentSession != nil
}

// CreateNewSession creates a new session
func (sm *SessionManager) CreateNewSession(saveCurrent bool) (*ChatSession, bool, string, error) {
	saveAttempted := false
	previousSessionID := ""
	var saveError error

	// Save current session if requested
	if saveCurrent && sm.currentSession != nil {
		saveAttempted = true
		previousSessionID = sm.currentSession.SessionID()
		saveError = sm.currentSession.SaveToFile()
	}

	// Create new session
	asst := assistant.CreateAzorAssistant()
	newSession, err := NewChatSession(asst, "", []llm.Message{})
	if err != nil {
		return nil, saveAttempted, previousSessionID, err
	}

	sm.currentSession = newSession

	return newSession, saveAttempted, previousSessionID, saveError
}

// SwitchToSession switches to an existing session
func (sm *SessionManager) SwitchToSession(sessionID string) (*ChatSession, bool, string, bool, error, bool) {
	saveAttempted := false
	previousSessionID := ""

	// Save current session
	if sm.currentSession != nil {
		saveAttempted = true
		previousSessionID = sm.currentSession.SessionID()
		_ = sm.currentSession.SaveToFile()
	}

	// Load new session
	asst := assistant.CreateAzorAssistant()
	newSession, err := LoadFromFile(asst, sessionID)
	if err != nil {
		return nil, saveAttempted, previousSessionID, false, err, false
	}

	// Successfully loaded
	sm.currentSession = newSession
	hasHistory := !newSession.IsEmpty()

	return newSession, saveAttempted, previousSessionID, true, nil, hasHistory
}

// RemoveCurrentSessionAndCreateNew removes current session and creates new one
func (sm *SessionManager) RemoveCurrentSessionAndCreateNew() (*ChatSession, string, bool, error) {
	if sm.currentSession == nil {
		return nil, "", false, errors.New("no session is active to remove")
	}

	removedSessionID := sm.currentSession.SessionID()

	// Remove the session file
	removeErr := files.RemoveSessionFile(removedSessionID)

	// Create new session
	asst := assistant.CreateAzorAssistant()
	newSession, err := NewChatSession(asst, "", []llm.Message{})
	if err != nil {
		return nil, removedSessionID, removeErr == nil, err
	}

	sm.currentSession = newSession

	return newSession, removedSessionID, removeErr == nil, removeErr
}

// InitializeFromCLI initializes session from CLI arguments
func (sm *SessionManager) InitializeFromCLI(cliSessionID string) (*ChatSession, error) {
	if cliSessionID != "" {
		asst := assistant.CreateAzorAssistant()
		session, err := LoadFromFile(asst, cliSessionID)

		if err != nil {
			// Fallback to new session
			session, _ = NewChatSession(asst, "", []llm.Message{})
		}

		sm.currentSession = session
		return session, err
	}

	// Create new session
	asst := assistant.CreateAzorAssistant()
	session, err := NewChatSession(asst, "", []llm.Message{})
	if err != nil {
		return nil, err
	}

	sm.currentSession = session
	return session, nil
}

// CleanupAndSave saves the current session if it has content
func (sm *SessionManager) CleanupAndSave() {
	if sm.currentSession == nil {
		return
	}

	if sm.currentSession.IsEmpty() {
		return
	}

	_ = sm.currentSession.SaveToFile()
}
