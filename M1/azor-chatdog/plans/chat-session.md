(initial prompt for the refactoring plan, `claude-4.5-sonnet`/`MAX`)
> I need you to analyze all .py python files and plan a following refactor - dump the plan here: @chat-session.md 
>
> situation now (poor):
> - application is a terminal-based chat that talks via agentic ai, users open sessions and talk with models inside these
> - session info is scattered across many files and even global variables, it's extremely difficult to do things now
> 
> expected improvement
> - there's ia stub `class ChatSession` in @session_manager.py which should become the de facto implementation for a single chat session
> - it should include the session id (and have everything related to managing that ID, loading the session from other files, etc.
> - it should include the chat history (all messages)
> - chat session would know how to dump itself into a file, how to load itself from a file, etc.
> - whenever needed, the `SessionManager` nearby would help in orchestrating stuff (when needed).
> 
> You're siposed to make a draft of the refactor which includes which functions/methods, with details, should be moved OR removed OR added, and when.
> 
> Someone would later on execute this plan, so it needs to be very careful.


# ChatSession Refactoring Plan

## Executive Summary

This refactoring consolidates scattered session state and logic into a cohesive `ChatSession` class, eliminating global variables and creating clear ownership boundaries.

## Current State Problems

### 1. Scattered Session State
- **config.py**: Global variables (`SESSION_ID`, `conversation_history`, `chat_session`)
- **session_manager.py**: Stub `ChatSession` class + unused `SessionManager` class + standalone functions
- **Multiple files**: Direct access to `config.SESSION_ID` and `config.conversation_history`

### 2. Unclear Ownership
- LLM chat session object created in 4+ different places
- Session loading/saving logic split between `session_files.py` and calling code
- No single point of truth for session state

### 3. Global State Dependencies
- 15+ places directly access `config.SESSION_ID`
- 10+ places directly access `config.conversation_history`
- Makes testing difficult and increases coupling

## Target Architecture

```
┌─────────────────────────────────────────┐
│         SessionManager                  │
│  - current_session: ChatSession         │
│  - create_new_session()                 │
│  - switch_to_session(id)                │
│  - get_current_session()                │
└─────────────────────────────────────────┘
                 │
                 │ manages
                 ▼
┌─────────────────────────────────────────┐
│         ChatSession                     │
│  - session_id: str                      │
│  - history: list[types.Content]         │
│  - _llm_chat_session: ChatSession       │
│  + __init__(session_id?, history?)      │
│  + load_from_file(session_id)           │
│  + save_to_file()                       │
│  + send_message(text) -> Response       │
│  + get_history() -> list[Content]       │
│  + clear_history()                      │
│  + pop_last_exchange()                  │
│  + count_tokens() -> int                │
│  + is_empty() -> bool                   │
└─────────────────────────────────────────┘
```

---

## Phase 1: Implement Core ChatSession Class

### File: `src/session_manager.py`

#### Step 1.1: Expand ChatSession Class - Core Structure

**Location**: Lines 16-25 in `session_manager.py`

**Action**: REPLACE the stub ChatSession class with:

```python
class ChatSession:
    """
    Manages everything related to a single chat session.
    Encapsulates session ID, conversation history, and LLM chat session.
    """
    
    def __init__(self, session_id: str | None = None, history: list[types.Content] | None = None):
        """
        Initialize a chat session.
        
        Args:
            session_id: Unique session identifier. If None, generates a new UUID.
            history: Initial conversation history. If None, starts empty.
        """
        self.session_id = session_id or str(uuid.uuid4())
        self._history = history or []
        self._llm_chat_session = None
        self._initialize_llm_session()
    
    def _initialize_llm_session(self):
        """
        Creates or recreates the Google GenAI chat session with current history.
        This should be called after any history modification.
        """
        from assistant.azor import SYSTEM_ROLE
        
        self._llm_chat_session = llm_client.client.chats.create(
            model=llm_client.MODEL_NAME,
            history=self._history,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_ROLE,
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            )
        )
```

**Rationale**: 
- Centralizes LLM session creation logic (currently duplicated in 4 places)
- Makes history and session_id first-class attributes
- Private `_llm_chat_session` to control access

---

#### Step 1.2: Add File I/O Methods

**Location**: Add to ChatSession class (after `_initialize_llm_session`)

**Action**: ADD new methods:

```python
    @classmethod
    def load_from_file(cls, session_id: str) -> tuple['ChatSession | None', str | None]:
        """
        Loads a session from disk.
        
        Args:
            session_id: ID of the session to load
            
        Returns:
            tuple: (ChatSession object or None, error_message or None)
        """
        history, error = session_files.load_session_history(session_id)
        
        if error:
            return None, error
        
        session = cls(session_id=session_id, history=history)
        return session, None
    
    def save_to_file(self) -> tuple[bool, str | None]:
        """
        Saves this session to disk.
        Only saves if history has at least one complete exchange.
        
        Returns:
            tuple: (success: bool, error_message: str | None)
        """
        # Sync history from LLM session before saving
        if self._llm_chat_session:
            self._history = self._llm_chat_session.get_history()
        
        return session_files.save_session_history(self.session_id, self._history)
```

**Rationale**:
- Session owns its persistence logic
- `@classmethod` for loading allows factory pattern
- Auto-syncs history before saving

**Dependencies**:
- `session_files.load_session_history()` (already exists)
- `session_files.save_session_history()` (already exists)

---

#### Step 1.3: Add Conversation Methods

**Location**: Add to ChatSession class (after `save_to_file`)

**Action**: ADD new methods:

```python
    def send_message(self, text: str):
        """
        Sends a message to the LLM and returns the response.
        Updates internal history automatically.
        
        Args:
            text: User's message
            
        Returns:
            Response object from Google GenAI
        """
        if not self._llm_chat_session:
            raise RuntimeError("LLM session not initialized")
        
        response = self._llm_chat_session.send_message(text)
        
        # Sync history after message
        self._history = self._llm_chat_session.get_history()
        
        return response
    
    def get_history(self) -> list[types.Content]:
        """Returns the current conversation history."""
        # Always sync from LLM session to ensure consistency
        if self._llm_chat_session:
            self._history = self._llm_chat_session.get_history()
        return self._history
    
    def clear_history(self):
        """Clears all conversation history and reinitializes the LLM session."""
        self._history = []
        self._initialize_llm_session()
    
    def pop_last_exchange(self) -> bool:
        """
        Removes the last user-assistant exchange from history.
        
        Returns:
            bool: True if successful, False if insufficient history
        """
        current_history = self.get_history()
        
        if len(current_history) < 2:
            return False
        
        # Remove last 2 entries (user + assistant)
        self._history = current_history[:-2]
        
        # Reinitialize LLM session with modified history
        self._initialize_llm_session()
        
        return True
```

**Rationale**:
- Encapsulates all history manipulation
- Auto-syncs with LLM session
- Clear API for common operations

---

#### Step 1.4: Add Utility Methods

**Location**: Add to ChatSession class (after `pop_last_exchange`)

**Action**: ADD new methods:

```python
    def count_tokens(self) -> int:
        """
        Counts total tokens in the conversation history.
        
        Returns:
            int: Total token count
        """
        return llm_client.count_history_tokens(self._history)
    
    def is_empty(self) -> bool:
        """
        Checks if session has any complete exchanges.
        
        Returns:
            bool: True if history has less than 2 entries
        """
        return len(self._history) < 2
    
    def get_remaining_tokens(self) -> int:
        """
        Calculates remaining tokens based on context limit.
        
        Returns:
            int: Remaining token count
        """
        total = self.count_tokens()
        return config.MAX_CONTEXT_TOKENS - total
```

**Rationale**:
- Consolidates token counting logic
- Provides session introspection
- Makes token management explicit

**Dependencies**:
- `llm_client.count_history_tokens()` (already exists)
- `config.MAX_CONTEXT_TOKENS` (already exists)

---

## Phase 2: Implement SessionManager

### File: `src/session_manager.py`

#### Step 2.1: Rewrite SessionManager Class

**Location**: Lines 27-37 in `session_manager.py`

**Action**: REPLACE existing SessionManager class with:

```python
class SessionManager:
    """
    Orchestrates session lifecycle and manages the current active session.
    Provides high-level operations for session management.
    """
    
    def __init__(self):
        """Initializes with no active session."""
        self._current_session: ChatSession | None = None
    
    def get_current_session(self) -> ChatSession:
        """
        Returns the current active session.
        
        Raises:
            RuntimeError: If no session is active
        """
        if not self._current_session:
            raise RuntimeError("No active session. Call create_new_session() or switch_to_session() first.")
        return self._current_session
    
    def has_active_session(self) -> bool:
        """Returns True if there's an active session."""
        return self._current_session is not None
    
    def create_new_session(self, save_current: bool = True) -> ChatSession:
        """
        Creates a new session, optionally saving the current one.
        
        Args:
            save_current: If True, saves current session before creating new one
            
        Returns:
            ChatSession: The newly created session
        """
        # Save current session if requested
        if save_current and self._current_session:
            console.print_info(f"\nZapisuję bieżącą sesję: {self._current_session.session_id} przed rozpoczęciem nowej...")
            success, error = self._current_session.save_to_file()
            if not success:
                console.print_error(f"Błąd podczas zapisu: {error}")
        
        # Create new session
        new_session = ChatSession()
        self._current_session = new_session
        
        console.print_info(f"\n--- Rozpoczęto nową sesję: {new_session.session_id} ---")
        console.display_help(new_session.session_id)
        
        return new_session
    
    def switch_to_session(self, session_id: str) -> tuple[ChatSession | None, str | None]:
        """
        Switches to an existing session by ID.
        Saves current session before switching.
        
        Args:
            session_id: ID of the session to load
            
        Returns:
            tuple: (ChatSession or None, error_message or None)
        """
        # Save current session
        if self._current_session:
            console.print_info(f"\nZapisuję bieżącą sesję: {self._current_session.session_id}...")
            self._current_session.save_to_file()
        
        # Load new session
        new_session, error = ChatSession.load_from_file(session_id)
        
        if error:
            console.print_error(f"Nie można wczytać sesji o ID: {session_id}. {error}")
            raise Exception(f'Failed to load session (ID: {session_id}) from file {file_path}. {error}')
        
        self._current_session = new_session
        
        console.print_info(f"\n--- Przełączono na sesję: {new_session.session_id} ---")
        console.display_help(new_session.session_id)
        
        if not new_session.is_empty():
            from commands.session_summary import display_history_summary
            display_history_summary(new_session.get_history())
        
        return new_session, error
    
    def initialize_from_cli(self, cli_session_id: str | None) -> ChatSession:
        """
        Initializes a session based on CLI arguments.
        Either loads an existing session or creates a new one.
        
        Args:
            cli_session_id: Session ID from CLI, or None for new session
            
        Returns:
            ChatSession: The initialized session
        """
        if cli_session_id:
            session, error = ChatSession.load_from_file(cli_session_id)
            
            if error:
                console.print_error(error)
                # Fallback to new session
                session = ChatSession()
                console.print_info(f"Rozpoczęto nową sesję z ID: {session.session_id}")
            
            self._current_session = session
            
            console.display_help(session.session_id)
            if not session.is_empty():
                from commands.session_summary import display_history_summary
                display_history_summary(session.get_history())
        else:
            print("Rozpoczynanie nowej sesji.")
            session = ChatSession()
            self._current_session = session
            console.display_help(session.session_id)
        
        return session
    
    def cleanup_and_save(self):
        """
        Cleanup method to be called on program exit.
        Saves the current session if it has content.
        """
        if not self._current_session:
            return
        
        session = self._current_session
        
        if session.is_empty():
            console.print_info(f"\nSesja jest pusta/niekompletna. Pominięto finalny zapis.")
        else:
            console.print_info(f"\nFinalny zapis historii sesji: {session.session_id}")
            session.save_to_file()
            console.display_final_instructions(session.session_id)
```

**Rationale**:
- Clear separation: SessionManager orchestrates, ChatSession executes
- Single point of control for active session
- Handles all session lifecycle events

---

## Phase 3: Refactor Standalone Functions

### File: `src/session_manager.py`

#### Step 3.1: Remove Standalone Functions

**Location**: Lines 45-164 in `session_manager.py`

**Action**: DELETE the following functions:
- `manage_session_history(action: str)` (lines 45-83)
- `start_new_session(save_old: bool)` (lines 86-110)
- `switch_session(new_session_id: str)` (lines 113-145)
- `cleanup_and_save_final()` (lines 148-163)

**Rationale**: All functionality moved into ChatSession and SessionManager classes

---

#### Step 3.2: Add Module-Level Session Manager Instance

**Location**: After class definitions in `session_manager.py`

**Action**: ADD at module level:

```python
# Global session manager instance
# This replaces the global variables in config.py
_session_manager: SessionManager | None = None

def get_session_manager() -> SessionManager:
    """
    Returns the global session manager instance.
    Creates it if it doesn't exist.
    """
    global _session_manager
    if _session_manager is None:
        _session_manager = SessionManager()
    return _session_manager
```

**Rationale**:
- Provides singleton access pattern
- Lazy initialization
- Easy to test (can reset for unit tests)

---

## Phase 4: Update config.py

### File: `src/config.py`

#### Step 4.1: Remove Global Session State

**Location**: Lines 13-16 in `config.py`

**Action**: DELETE these lines:
```python
SESSION_ID = str(uuid.uuid4())
conversation_history: list[types.Content] = []
chat_session = None
```

**Action**: KEEP these lines (they're configuration, not state):
```python
LOG_DIR = os.path.join(os.path.expanduser('~'), '.azor')
WAL_FILE = os.path.join(LOG_DIR, 'azor-wal.json')
MAX_CONTEXT_TOKENS = 32768
```

**Rationale**:
- Removes global mutable state
- Keeps true configuration values
- Forces code to use SessionManager

---

## Phase 5: Update chat.py

### File: `src/chat.py`

#### Step 5.1: Refactor init_chat()

**Location**: Lines 18-52 in `chat.py`

**Action**: REPLACE function with:

```python
def init_chat():
    """Initializes a new session or loads an existing one."""
    from commands.welcome import print_welcome
    
    print_welcome()
    
    # Get session manager
    manager = session_manager.get_session_manager()
    
    # Initialize session based on CLI args
    cli_session_id = cli.args.get_session_id_from_cli()
    session = manager.initialize_from_cli(cli_session_id)
    
    # Register cleanup handler
    atexit.register(lambda: manager.cleanup_and_save())
```

**Rationale**:
- Delegates all logic to SessionManager
- Much simpler and clearer
- No direct access to global state

**Removed Dependencies**:
- `config.SESSION_ID` ❌
- `config.conversation_history` ❌
- `config.chat_session` ❌

---

#### Step 5.2: Refactor main_loop()

**Location**: Lines 54-105 in `chat.py`

**Action**: REPLACE function with:

```python
def main_loop():
    """Main loop of the interactive chat."""
    manager = session_manager.get_session_manager()

    while True:
        try:
            user_input = get_user_input()

            if not user_input:
                continue

            if user_input.startswith('/'):
                should_exit = command_handler.handle_command(user_input)
                if should_exit:
                    break 
                continue
            
            # Conversation with the model
            session = manager.get_current_session()
            
            # Send message
            response = session.send_message(user_input)
            
            # Count tokens
            total_tokens = session.count_tokens()
            remaining_tokens = session.get_remaining_tokens()
            
            # Save to WAL
            append_to_wal(session.session_id, user_input, response.text, total_tokens)

            # Display response
            console.print_assistant(f"\n{ASSISTANT_NAME}: {response.text}")
            console.print_info(f"Tokens: {total_tokens} (Pozostało: {remaining_tokens} / {config.MAX_CONTEXT_TOKENS})")

            # Save session
            success, error = session.save_to_file()
            if not success and error:
                console.print_error(f"Error saving session: {error}")

        except KeyboardInterrupt:
            console.print_info("\nPrzerwano przez użytkownika (Ctrl+C). Uruchamianie procedury finalnego zapisu...")
            break
        except EOFError:
            console.print_info("\nWyjście (Ctrl+D).")
            break
        except Exception as e:
            console.print_error(f"\nWystąpił nieoczekiwany błąd: {e}")
            import traceback
            traceback.print_exc()
            break
```

**Rationale**:
- Uses SessionManager and ChatSession
- No global state access
- Clearer flow

**Changes**:
- `config.chat_session.send_message()` → `session.send_message()`
- `llm_client.count_history_tokens()` → `session.count_tokens()`
- Direct token calculation → `session.get_remaining_tokens()`
- `config.SESSION_ID` → `session.session_id`

---

## Phase 6: Update command_handler.py

### File: `src/command_handler.py`

#### Step 6.1: Refactor Command Handler

**Location**: Lines 9-58 in `command_handler.py`

**Action**: REPLACE `handle_command()` function:

```python
def handle_command(user_input: str) -> bool:
    """
    Handles slash commands. Returns True if program should exit.
    """
    import session_manager
    
    parts = user_input.split()
    command = parts[0].lower()

    # Validate command
    if command not in VALID_SLASH_COMMANDS:
        console.print_error(f"Błąd: Nieznana komenda: {command}. Użyj /help.")
        return False

    manager = session_manager.get_session_manager()
    
    # Exit commands
    if command in ['/exit', '/quit']:
        console.print_info("\nZakończenie czatu. Uruchamianie procedury finalnego zapisu...")
        return True
    
    # Switch command
    elif command == '/switch':
        if len(parts) == 2:
            new_id = parts[1]
            current = manager.get_current_session()
            if new_id == current.session_id:
                console.print_info("Jesteś już w tej sesji.")
            else:
                manager.switch_to_session(new_id)
        else:
            console.print_error("Błąd: Użycie: /switch <SESSION-ID>")
            
    # Help command
    elif command == '/help':
        current = manager.get_current_session()
        console.display_help(current.session_id)

    # Session subcommands
    elif command == '/session':
        if len(parts) < 2:
            console.print_error("Błąd: Komenda /session wymaga podkomendy (list, display, pop, clear, new).")
        else:
            handle_session_subcommand(parts[1].lower(), manager)

    return False


def handle_session_subcommand(subcommand: str, manager):
    """Handles /session subcommands."""
    from commands.session_display import display_full_session
    
    current = manager.get_current_session()
    
    if subcommand == 'list':
        list_sessions_command()
        
    elif subcommand == 'display':
        display_full_session(current.get_history())
        
    elif subcommand == 'pop':
        success = current.pop_last_exchange()
        if success:
            current.save_to_file()
            from commands.session_summary import display_history_summary
            console.print_info(f"Usunięto ostatnią parę wpisów (TY i {current.session_id}).")
            display_history_summary(current.get_history())
        else:
            console.print_error("Błąd: Historia jest pusta lub niekompletna (wymaga co najmniej jednej pary).")
            
    elif subcommand == 'clear':
        current.clear_history()
        current.save_to_file()
        console.print_info("Historia bieżącej sesji została wyczyszczona.")
        
    elif subcommand == 'new':
        manager.create_new_session(save_current=True)
        
    else:
        console.print_error(f"Błąd: Nieznana podkomenda dla /session: {subcommand}. Użyj /help.")
```

**Rationale**:
- Uses SessionManager API exclusively
- Cleaner separation of concerns
- No global config access

**Changes**:
- `config.SESSION_ID` → `manager.get_current_session().session_id`
- `config.chat_session.get_history()` → `current.get_history()`
- `session_manager.manage_session_history()` → `current.pop_last_exchange()` / `current.clear_history()`
- `session_manager.start_new_session()` → `manager.create_new_session()`
- `session_manager.switch_session()` → `manager.switch_to_session()`

---

## Phase 7: Update Command Files

### File: `src/commands/session_display.py`

#### Step 7.1: Update session_display.py

**Location**: Lines 6-26 in `session_display.py`

**Action**: REPLACE import and function signature:

```python
from google.genai import types
from cli import console
from assistant.azor import ASSISTANT_NAME

def display_full_session(history: list[types.Content], session_id: str):
    """Wyświetla całą historię sesji."""
    if not history:
        console.print_info("Historia sesji jest pusta.")
        return

    console.print_info(f"\n--- PEŁNA HISTORIA SESJI ({session_id}, {len(history)} wpisów) ---")
    
    # ... rest stays the same ...
```

**Rationale**: Removes dependency on `config.SESSION_ID`

---

### File: `src/command_handler.py`

**Action**: UPDATE the call site (line 48):

```python
elif subcommand == 'display':
    display_full_session(current.get_history(), current.session_id)
```

---

## Phase 8: Update WAL

### File: `src/files/wal.py`

#### Step 8.1: Fix Import Error

**Location**: Line 26 in `wal.py`

**Action**: REPLACE:
```python
if os.path.exists(config.WAL_FILE) and os.path.getsize(config.WAL_FILE) > 0:
```

WITH:
```python
if os.path.exists(WAL_FILE) and os.path.getsize(WAL_FILE) > 0:
```

**Also on line 32**:
```python
return False, f"WAL file corrupted, resetting: {WAL_FILE}"
```

**And line 38 and 43**:
```python
with open(WAL_FILE, 'w', encoding='utf-8') as f:
    ...
except Exception as e:
    return False, f"Error writing to WAL file ({WAL_FILE}): {e}"
```

**Rationale**: Bug fix - `config.WAL_FILE` doesn't exist, should use imported `WAL_FILE`

---

## Phase 9: Testing Checklist

After implementing all changes, test these scenarios:

### Test 1: New Session Creation
1. Run `python src/run.py`
2. Verify new session starts
3. Send a message
4. Verify response and token count
5. Exit with `/exit`
6. Verify session saved

### Test 2: Load Existing Session
1. Run `python src/run.py --session-id=<ID>`
2. Verify session loads with history summary
3. Send a message
4. Verify continuity

### Test 3: Session Commands
1. `/session list` - should show sessions
2. `/session display` - should show full history
3. `/session pop` - should remove last exchange
4. `/session clear` - should clear all history
5. `/session new` - should create new session

### Test 4: Session Switching
1. Start session A
2. Send messages
3. `/switch <session-B-id>`
4. Verify session B loads
5. Verify session A was saved

### Test 5: Error Handling
1. Try loading non-existent session ID
2. Verify graceful fallback to new session
3. Try `/session pop` on empty session
4. Verify error message

---

## Phase 10: Cleanup & Documentation

### Step 10.1: Update README

**File**: `README.md`

**Action**: ADD section about architecture:

```markdown
## Architecture

### Session Management

The application uses a two-class system for session management:

- **`ChatSession`**: Represents a single chat session with:
  - Unique session ID
  - Conversation history
  - LLM chat session
  - Methods for send/save/load/clear
  
- **`SessionManager`**: Orchestrates session lifecycle:
  - Manages "current" active session
  - Handles switching between sessions
  - Coordinates session creation/loading/saving

All session state is encapsulated in these classes. No global variables are used for session state.
```

---

### Step 10.2: Add Type Hints

**Files**: All modified files

**Action**: Ensure all functions have proper type hints:
- Parameter types
- Return types
- Use `| None` for optional returns

---

### Step 10.3: Add Docstrings

**Files**: All new methods in ChatSession and SessionManager

**Action**: Ensure all public methods have docstrings with:
- One-line summary
- Args section
- Returns section
- Raises section (if applicable)

---

## Migration Path (Execution Order)

### Critical Path:
1. **Phase 1**: Implement ChatSession class (foundation)
2. **Phase 2**: Implement SessionManager class (orchestration)
3. **Phase 3**: Remove old standalone functions (cleanup)
4. **Phase 4**: Update config.py (remove globals)
5. **Phase 5**: Update chat.py (main entry point)
6. **Phase 6**: Update command_handler.py (commands)
7. **Phase 7**: Update command files (minor fixes)
8. **Phase 8**: Fix WAL bug (quick fix)
9. **Phase 9**: Test thoroughly
10. **Phase 10**: Documentation

### Important Notes:
- Do NOT skip phases - they build on each other
- Test after each phase if possible
- Commit after each successful phase
- If something breaks, rollback to last commit

---

## Expected Benefits

### Code Quality
- ✅ No global mutable state
- ✅ Clear ownership and responsibilities
- ✅ Easier to test (can mock ChatSession)
- ✅ Single source of truth for session data

### Maintainability
- ✅ Session logic in one place
- ✅ Easy to add new session features
- ✅ Clear API boundaries
- ✅ Reduced coupling between modules

### Robustness
- ✅ Consistent state management
- ✅ Automatic history syncing
- ✅ Centralized error handling
- ✅ Better resource cleanup

---

## Risk Assessment

### Low Risk
- Adding new methods to ChatSession
- Adding SessionManager class
- Updating command handlers

### Medium Risk
- Removing global variables from config.py
- Updating all call sites

### High Risk
- Changing how LLM session is created
- Modifying history synchronization

### Mitigation
- Implement in phases with testing
- Keep old code commented out temporarily
- Create backup before starting
- Test each phase independently

---

## Rollback Plan

If refactoring fails:

1. **Immediate rollback**: `git checkout .` (if not committed)
2. **Partial rollback**: Revert specific commits
3. **Keep both**: Add `legacy_` prefix to old functions temporarily

---

## Future Enhancements (Post-Refactoring)

Once refactoring is complete, consider:

1. **Session metadata**: Add timestamps, tags, titles
2. **Session export**: Export to markdown/JSON
3. **Session search**: Search across all sessions
4. **Session templates**: Start with pre-configured history
5. **Automatic session archiving**: Archive old sessions
6. **Session statistics**: Tokens used, message count, etc.

---

## Conclusion

This refactoring consolidates scattered session logic into a cohesive, testable architecture. The `ChatSession` class becomes the single source of truth, while `SessionManager` orchestrates lifecycle operations. All global state is eliminated, making the codebase more maintainable and robust.

**Estimated Effort**: 4-6 hours for experienced developer
**Lines Changed**: ~300-400 lines
**Files Modified**: 7 files
**Tests Required**: 5 test scenarios

---

**Document Version**: 1.0  
**Author**: AI Assistant  
**Date**: 2025-10-21  
**Status**: Ready for Implementation

