package files

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// Message represents a message in universal format
type Message struct {
	Role  string `json:"role"`
	Parts []Part `json:"parts"`
}

// Part represents a text part
type Part struct {
	Text string `json:"text"`
}

// SessionLogEntry represents a single entry in session log
type SessionLogEntry struct {
	Role      string `json:"role"`
	Timestamp string `json:"timestamp"` // Keep as string for compatibility with Python format
	Text      string `json:"text"`
}

// SessionLogData represents the complete session log file
type SessionLogData struct {
	SessionID  string            `json:"session_id"`
	Model      string            `json:"model"`
	SystemRole string            `json:"system_role"`
	History    []SessionLogEntry `json:"history"`
}

// SessionInfo represents metadata about a session
type SessionInfo struct {
	ID            string
	MessagesCount int
	LastActivity  string
	Error         string
}

// LoadSessionHistory loads session history from JSON file
func LoadSessionHistory(sessionID string) ([]Message, error) {
	logFilename := filepath.Join(LogDir, fmt.Sprintf("%s-log.json", sessionID))

	if _, err := os.Stat(logFilename); os.IsNotExist(err) {
		return []Message{}, fmt.Errorf("session log file '%s' does not exist. Starting new session", logFilename)
	}

	data, err := os.ReadFile(logFilename)
	if err != nil {
		return []Message{}, fmt.Errorf("cannot read log file '%s': %w", logFilename, err)
	}

	var logData SessionLogData
	if err := json.Unmarshal(data, &logData); err != nil {
		return []Message{}, fmt.Errorf("cannot decode log file '%s': %w", logFilename, err)
	}

	// Convert to universal format
	var history []Message
	for _, entry := range logData.History {
		history = append(history, Message{
			Role:  entry.Role,
			Parts: []Part{{Text: entry.Text}},
		})
	}

	return history, nil
}

// SaveSessionHistory saves session history to JSON file
func SaveSessionHistory(sessionID string, history []Message, systemPrompt, modelName string) error {
	if len(history) < 2 {
		// Don't save empty/incomplete sessions
		return nil
	}

	logFilename := filepath.Join(LogDir, fmt.Sprintf("%s-log.json", sessionID))

	// Convert to session log format
	var jsonHistory []SessionLogEntry
	for _, msg := range history {
		if len(msg.Parts) > 0 {
			jsonHistory = append(jsonHistory, SessionLogEntry{
				Role:      msg.Role,
				Timestamp: time.Now().Format("2006-01-02T15:04:05.000000"),
				Text:      msg.Parts[0].Text,
			})
		}
	}

	logData := SessionLogData{
		SessionID:  sessionID,
		Model:      modelName,
		SystemRole: systemPrompt,
		History:    jsonHistory,
	}

	data, err := json.MarshalIndent(logData, "", "    ")
	if err != nil {
		return fmt.Errorf("error marshaling session data: %w", err)
	}

	if err := os.WriteFile(logFilename, data, 0644); err != nil {
		return fmt.Errorf("error writing to file %s: %w", logFilename, err)
	}

	return nil
}

// ListSessions returns a list of available sessions with metadata
func ListSessions() []SessionInfo {
	files, err := os.ReadDir(LogDir)
	if err != nil {
		return []SessionInfo{}
	}

	var sessionIDs []string
	for _, f := range files {
		if strings.HasSuffix(f.Name(), "-log.json") && f.Name() != "azor-wal.json" {
			sessionID := strings.TrimSuffix(f.Name(), "-log.json")
			sessionIDs = append(sessionIDs, sessionID)
		}
	}
	sort.Strings(sessionIDs)

	var sessions []SessionInfo
	for _, sid := range sessionIDs {
		logPath := filepath.Join(LogDir, fmt.Sprintf("%s-log.json", sid))

		data, err := os.ReadFile(logPath)
		if err != nil {
			sessions = append(sessions, SessionInfo{
				ID:    sid,
				Error: "BŁĄD ODCZYTU PLIKU",
			})
			continue
		}

		var logData SessionLogData
		if err := json.Unmarshal(data, &logData); err != nil {
			sessions = append(sessions, SessionInfo{
				ID:    sid,
				Error: "BŁĄD ODCZYTU PLIKU",
			})
			continue
		}

		timeStr := "Brak aktywności"
		if len(logData.History) > 0 {
			lastMsg := logData.History[len(logData.History)-1]
			// Parse timestamp string
			if lastMsg.Timestamp != "" {
				// Try parsing Python ISO format
				t, err := time.Parse("2006-01-02T15:04:05.999999", lastMsg.Timestamp)
				if err == nil {
					timeStr = t.Format("2006-01-02 15:04")
				} else {
					// Try with timezone
					t, err = time.Parse(time.RFC3339, lastMsg.Timestamp)
					if err == nil {
						timeStr = t.Format("2006-01-02 15:04")
					}
				}
			}
		}

		sessions = append(sessions, SessionInfo{
			ID:            sid,
			MessagesCount: len(logData.History),
			LastActivity:  timeStr,
		})
	}

	return sessions
}

// RemoveSessionFile removes a session log file
func RemoveSessionFile(sessionID string) error {
	logFilename := filepath.Join(LogDir, fmt.Sprintf("%s-log.json", sessionID))

	if _, err := os.Stat(logFilename); os.IsNotExist(err) {
		return fmt.Errorf("session file for ID '%s' not found", sessionID)
	}

	if err := os.Remove(logFilename); err != nil {
		return fmt.Errorf("error removing session file '%s': %w", logFilename, err)
	}

	return nil
}
