package files

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
)

// WALEntry represents a single entry in the Write-Ahead Log
type WALEntry struct {
	Timestamp  time.Time `json:"timestamp"`
	SessionID  string    `json:"session_id"`
	Model      string    `json:"model"`
	Prompt     string    `json:"prompt"`
	Response   string    `json:"response"`
	TokensUsed int       `json:"tokens_used"`
}

// AppendToWAL appends a transaction to the WAL file
func AppendToWAL(sessionID, prompt, responseText string, totalTokens int, modelName string) error {
	walEntry := WALEntry{
		Timestamp:  time.Now(),
		SessionID:  sessionID,
		Model:      modelName,
		Prompt:     prompt,
		Response:   responseText,
		TokensUsed: totalTokens,
	}

	// Read existing WAL data
	var data []WALEntry
	if info, err := os.Stat(WALFile); err == nil && info.Size() > 0 {
		fileData, err := os.ReadFile(WALFile)
		if err != nil {
			return fmt.Errorf("error reading WAL file: %w", err)
		}

		if err := json.Unmarshal(fileData, &data); err != nil {
			// WAL corrupted, reset it
			data = []WALEntry{}
		}
	}

	// Append new entry
	data = append(data, walEntry)

	// Write back to file
	jsonData, err := json.MarshalIndent(data, "", "    ")
	if err != nil {
		return fmt.Errorf("error marshaling WAL data: %w", err)
	}

	if err := os.WriteFile(WALFile, jsonData, 0644); err != nil {
		return fmt.Errorf("error writing to WAL file (%s): %w", WALFile, err)
	}

	return nil
}
