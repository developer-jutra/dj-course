# Audio Commands Implementation

## Overview
Added two new audio commands to generate speech from chat sessions:
- `/audio last` - Generate audio from the assistant's last response
- `/audio all` - Generate audio from the entire conversation

### Additional System Dependencies (except Python dependencies in requirements.tsx file)

**macOS**: Audio playback should work out of the box using `afplay`.

**Linux**: You may need to install additional audio backends:
```bash
# For pydub playback
sudo apt-get install ffmpeg

# For ALSA playback (alternative)
sudo apt-get install alsa-utils
```

**Windows**: Should work with built-in `winsound` module.


## Usage

### Generate and play audio from last assistant response
```bash
/audio last
```

### Generate audio without auto-play
```bash
/audio last --no-play
```

### Generate audio from entire conversation
```bash
/audio all
```

### Customize pause between messages (in milliseconds)
```bash
/audio all --pause 1000
```

### Generate full conversation without playing
```bash
/audio all --pause 300 --no-play
```

## Output Files

Audio files are saved to `~/.azor/`:
- **Last response**: `~/.azor/{session-id}-last.wav`
- **Full conversation**: `~/.azor/{session-id}.wav`

## Voice Differentiation

The `/audio all` command uses different speech rates to distinguish between user and assistant:
- User messages: 150 words/minute (slower)
- Assistant messages: 170 words/minute (faster)

This creates an audible difference between the two speakers.

## Testing Instructions

1. **Start a chat session**:
   ```bash
   cd M1/azor-chatdog-py
   source .venv/bin/activate
   python src/run.py
   ```

2. **Have a short conversation**

3. **Test `/audio last` command**:
   ```
   /audio last
   ```
   - Should generate audio file: `~/.azor/{session-id}-last.wav`
   - Should play automatically (if `afplay` available on macOS)

4. **Test `/audio all` command**:
   ```
   /audio all
   ```
   - Should generate audio file: `~/.azor/{session-id}.wav`
   - Should play entire conversation with pauses between messages

5. **Test with custom pause**:
   ```
   /audio all --pause 1000
   ```
   - Should have 1 second pauses between messages

6. **Test without auto-play**:
   ```
   /audio last --no-play
   ```
   - Should only generate file without playing

7. **Verify files exist**:
   ```bash
   ls -lh ~/.azor/*.wav
   ```

## Troubleshooting

### No audio playback
- Check if audio file was created in `~/.azor/`
- Try opening the `.wav` file manually
- On macOS: `afplay ~/.azor/{session-id}-last.wav`
- On Linux: `aplay ~/.azor/{session-id}-last.wav`

### TTS engine not available
- Ensure `pyttsx3` is installed: `pip install pyttsx3`
- On macOS, pyttsx3 uses NSSpeechSynthesizer (built-in)
- On Linux, install `espeak`: `sudo apt-get install espeak`
- On Windows, uses SAPI5 (built-in)

### Possible audio quality issues
- `pyttsx3` is a basic offline TTS engine
- For better quality, use Coqui TTS, Microsoft Edge TTS or suno-bark

## Implementation Details

### Files Modified
- `src/commands/audio.py` - New module with audio generation logic
- `src/command_handler.py` - Added `/audio` command routing
- `src/cli/console.py` - Updated help text
- `requirements.txt` - Added `pyttsx3` and `pydub`

### Architecture
- Uses `TTS`, `edge-tts`, `pyttsx3` for text-to-speech synthesis (cross-platform)
- Uses `pydub` for audio manipulation and combining
- Saves files to `~/.azor/` (same location as session logs)
- Supports configurable pause duration between messages
- Different speech rates for user vs assistant voices
