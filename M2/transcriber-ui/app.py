import tkinter as tk
from tkinter import messagebox, ttk, filedialog
import pyaudio
import wave
import os
import time
import threading
import queue
import sys
import logging
import logging.handlers
from typing import TextIO
import json
import glob

# --- Global Configuration ---
APP_TITLE = "Azor Transcriber"
# Set to True to print output to the console (standard output/stderr).
VERBOSE = False
LOG_FILENAME = "transcriber.log"
CONFIG_FILE = "transcriber_config.json"
DEFAULT_OUTPUT_DIR = "output"


# --- Config Management ---
def load_config():
    """Load configuration from config file."""
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                config = json.load(f)
                return config
        except Exception as e:
            logging.error(f"Error loading config: {e}")
            return {"output_dir": DEFAULT_OUTPUT_DIR}
    return {"output_dir": DEFAULT_OUTPUT_DIR}


def save_config(config):
    """Save configuration to config file."""
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(config, f, indent=4, ensure_ascii=False)
        logging.info(f"Config saved: {config}")
    except Exception as e:
        logging.error(f"Error saving config: {e}")


# Load config globally
CURRENT_CONFIG = load_config()


# --- Logging Setup ---
class StreamToLogger(TextIO):
    """
    Fake file-like stream object that redirects writes to a logger instance.
    This captures stdout/stderr, including print() statements.
    """

    def __init__(self, logger, level):
        self.logger = logger
        self.level = level
        self.linebuf = ""

    def write(self, buf):
        # Handle buffer and write line by line
        for line in buf.rstrip().splitlines():
            # Check if the line is not empty (prevents logging empty lines from print())
            if line.strip():
                self.logger.log(self.level, line.strip())

    def flush(self):
        # Required by TextIO interface, but we flush line-by-line in write
        pass


# Configure the global logger BEFORE application startup
def setup_logging():
    """Con gures the logging system to save all output to a le and optionally to console."""
    output_dir = CURRENT_CONFIG.get("output_dir", DEFAULT_OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)

    # 1. Root logger setup
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)  # Capture everything from INFO level up

    # 2. File Handler (Always active)
    file_handler = logging.handlers.RotatingFileHandler(
        LOG_FILENAME,
        maxBytes=1024 * 1024 * 5,  # 5 MB per file
        backupCount=5,
        encoding="utf-8",
    )
    # Define a simple formatter for the file
    formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)

    # 3. Console Handler (Only active if VERBOSE is True)
    if VERBOSE:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        root_logger.addHandler(console_handler)

    # 4. Redirect stdout and stderr to the logger
    sys.stdout = StreamToLogger(root_logger, logging.INFO)
    sys.stderr = StreamToLogger(root_logger, logging.ERROR)


setup_logging()
logging.info("Application initialization started.")

# --- Whisper Dependencies ---
# Ensure you have installed: pip install torch transformers librosa
# (Librosa might require ffmpeg)
try:
    import torch
    from transformers import pipeline
except ImportError:
    logging.error("ERROR: 'transformers' or 'torch' libraries not found.")
    logging.error("Install them using: pip install torch transformers")
    exit()

# === 1. Transcription Configuration ===
MODEL_NAME = "openai/whisper-tiny"


def output_filename() -> str:
    """Generates output filename for transcription results."""
    output_dir = CURRENT_CONFIG.get("output_dir", DEFAULT_OUTPUT_DIR)
    os.makedirs(output_dir, exist_ok=True)
    return f"{output_dir}/recording-{int(time.time())}.wav"


def get_directory_size(directory: str) -> int:
    """Calculates the total size of all files in a directory recursively."""
    total_size = 0
    try:
        for dirpath, dirnames, filenames in os.walk(directory):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                if os.path.exists(filepath):
                    total_size += os.path.getsize(filepath)
    except Exception as e:
        logging.error(f"Error calculating directory size: {e}")
    return total_size


def format_size(size_bytes: int) -> str:
    """Formats size in bytes to human-readable format."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.2f} TB"


def transcribe_audio(audio_path: str, model_name: str) -> str:
    """
    Loads the Whisper model and transcribes the audio file.
    This function is blocking and should be run in a separate thread.
    """
    try:
        logging.info(f"Loading model: {model_name}...")
        # Initialize pipeline
        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        logging.info(f"Using device: {device}")

        asr_pipeline = pipeline(
            "automatic-speech-recognition", model=model_name, device=device
        )

        logging.info(f"Starting transcription for file: {audio_path}...")
        result = asr_pipeline(audio_path)

        transcription = result["text"].strip()

        # === Save transcription to JSON ---
        try:
            json_filename = audio_path.replace(".wav", ".json")
            data = {
                "audio_file": os.path.basename(audio_path),
                "transcription": transcription,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "model": model_name,
            }
            with open(json_filename, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=4, ensure_ascii=False)
            logging.info(f"Transcription saved to JSON: {json_filename}")
        except Exception as json_err:
            logging.error(f"Failed to save JSON transcription: {json_err}")

        logging.info("Transcription finished.")
        return transcription

    except FileNotFoundError:
        logging.error(f"ERROR: Audio file not found at path: {audio_path}")
        return f"ERROR: Audio file not found at path: {audio_path}"
    except Exception as e:
        logging.error(
            f"An unexpected error occurred during transcription: {e}", exc_info=True
        )
        return f"An unexpected error occurred during transcription: {e}"


# === 2. Recording Configuration ===
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000  # Standard for speech models (Whisper)
MAX_RECORD_DURATION = 30  # Maximum recording length in seconds


# === 3. Tkinter GUI Application ===
class AudioRecorderApp:
    def __init__(self, master):
        self.master = master

        # 1. Set application title (window title)
        master.title(APP_TITLE)

        # 2. Set the application name for the OS/taskbar
        # This is cross-platform attempt to set the application name
        try:
            # For macOS and some X11 environments
            self.master.tk.call("wm", "iconname", self.master._w, APP_TITLE)
        except tk.TclError:
            # Standard method, usually works on Windows/Linux
            self.master.wm_iconname(APP_TITLE)

        master.geometry("1024x720")  # Slightly larger window
        master.config(bg="#121212")  # Set dark background for root

        # --- TKINTER WIDGET STYLES (ttk) ---
        style = ttk.Style()
        style.theme_use("default")

        # Configure the dark background for the Notebook tabs
        style.configure("TNotebook", background="#121212", borderwidth=0)
        style.configure(
            "TNotebook.Tab", background="#1E1E1E", foreground="white", borderwidth=0
        )
        style.map(
            "TNotebook.Tab",
            background=[("selected", "#0F0F0F")],
            foreground=[("selected", "white")],
        )

        # 1. Define new style for dark gray buttons
        style.configure(
            "Dark.TButton",
            background="#333333",
            foreground="white",
            font=("Arial", 14),
            bordercolor="#333333",
            borderwidth=0,
            focuscolor="#333333",
            padding=(20, 10, 20, 10),
        )

        # 2. Define button appearance in different states (active/disabled)
        style.map(
            "Dark.TButton",
            background=[
                ("active", "#555555"),  # Lighter gray for hover/active state
                ("disabled", "#333333"),
            ],  # Disabled state uses the default background
        )

        # 3. Define style for Delete button (Red)
        style.configure(
            "Delete.TButton",
            background="#8B0000",  # Dark red
            foreground="white",
            font=("Arial", 14),
            bordercolor="#8B0000",
            borderwidth=0,
            focuscolor="#8B0000",
            padding=(20, 10, 20, 10),
        )
        style.map(
            "Delete.TButton",
            background=[
                ("active", "#FF0000"),  # Bright red for hover/active state
                ("disabled", "#550000"),  # Very dark red for disabled
            ],
        )

        # --- Treeview Style for Dark Mode ---
        style.configure(
            "Treeview",
            background="#1E1E1E",
            foreground="white",
            fieldbackground="#1E1E1E",
            font=("Arial", 10),
            rowheight=30,
        )
        style.configure(
            "Treeview.Heading",
            font=("Arial", 11, "bold"),
            background="#333333",
            foreground="white",
        )
        style.map("Treeview", background=[("selected", "#555555")])

        logging.info("GUI initialization started.")

        # Initialize PyAudio
        try:
            self.p = pyaudio.PyAudio()
        except Exception as e:
            logging.critical(f"Could not initialize PyAudio: {e}. Destroying GUI.")
            messagebox.showerror(
                "PyAudio Error",
                f"Could not initialize PyAudio: {e}\nDo you have 'portaudio' installed?",
            )
            master.destroy()
            return

        self.frames = []
        self.stream = None
        self.recording = False
        self.start_time = None
        self.record_timer_id = None

        # Queue for inter-thread communication
        self.transcription_queue = queue.Queue()

        # --- TAB MENU SETUP (Notebook) ---
        self.notebook = ttk.Notebook(master, style="TNotebook")
        self.notebook.pack(pady=10, padx=10, fill="both", expand=True)

        # 1. Transcriber Tab
        self.transcriber_frame = tk.Frame(
            self.notebook, bg="#121212"
        )  # Set dark background for frame
        self.notebook.add(self.transcriber_frame, text="Transcriber")

        # 2. History Tab
        self.history_frame = tk.Frame(
            self.notebook, bg="#121212"
        )  # Consistent dark background
        self.notebook.add(self.history_frame, text="Transcription History")

        # Content for History Tab: Last Transcription Display
        tk.Label(
            self.history_frame,
            text="Saved transcriptions",
            font=("Arial", 14, "bold"),
            fg="white",
            bg="#121212",
        ).pack(pady=(10, 5))

        self.history_display = tk.Text(
            self.history_frame,
            height=10,
            wrap=tk.WORD,
            font=("Arial", 11),
            relief=tk.SUNKEN,
            bg="#1E1E1E",
            fg="white",
            insertbackground="white",
            state=tk.DISABLED,
        )

        # Main horizontal container for tree and preview
        history_container = tk.Frame(self.history_frame, bg="#121212")
        history_container.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

        # Left side: Tree list
        tree_frame = tk.Frame(history_container, bg="#121212")
        tree_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(0, 10))

        # Define columns
        columns = ("timestamp", "filename", "preview", "filepath")  # filepath is hidden
        self.history_tree = ttk.Treeview(
            tree_frame, columns=columns, show="headings", selectmode="browse", height=15
        )

        # Define headings
        self.history_tree.heading("timestamp", text="Date/Time")
        self.history_tree.heading("filename", text="File Name")
        self.history_tree.heading("preview", text="Preview")
        # filepath column doesn't need heading as it's hidden

        # Define column widths
        self.history_tree.column("timestamp", width=120, anchor="center")
        self.history_tree.column("filename", width=150, anchor="w")
        self.history_tree.column("preview", width=200, anchor="w")
        self.history_tree.column(
            "filepath", width=0, stretch=tk.NO
        )  # Hide filepath column

        # Add Scrollbar for tree
        tree_scrollbar = ttk.Scrollbar(
            tree_frame, orient=tk.VERTICAL, command=self.history_tree.yview
        )
        self.history_tree.configure(yscroll=tree_scrollbar.set)

        self.history_tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        tree_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        # Right side: Metadata preview panel
        preview_frame = tk.Frame(
            history_container, bg="#1E1E1E", relief=tk.SUNKEN, width=350
        )
        preview_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=False, padx=(10, 0))
        preview_frame.pack_propagate(False)

        # Preview title
        tk.Label(
            preview_frame,
            text="Metadata Preview",
            font=("Arial", 11, "bold"),
            fg="white",
            bg="#1E1E1E",
        ).pack(anchor="w", padx=10, pady=(10, 5))

        # Metadata display area with scrollbar
        preview_scrollbar = ttk.Scrollbar(preview_frame, orient=tk.VERTICAL)
        self.metadata_display = tk.Text(
            preview_frame,
            height=20,
            wrap=tk.WORD,
            font=("Arial", 9),
            relief=tk.FLAT,
            bg="#0F0F0F",
            fg="#CCCCCC",
            yscrollcommand=preview_scrollbar.set,
            state=tk.DISABLED,
            padx=8,
            pady=8,
        )
        preview_scrollbar.config(command=self.metadata_display.yview)

        self.metadata_display.pack(
            side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=(0, 10)
        )
        preview_scrollbar.pack(side=tk.RIGHT, fill=tk.Y, padx=(0, 10), pady=(0, 10))

        # Bind tree selection event
        self.history_tree.bind("<<TreeviewSelect>>", self.on_history_item_selected)

        # Buttons Frame for History Tab
        history_buttons_frame = tk.Frame(self.history_frame, bg="#121212")
        history_buttons_frame.pack(side=tk.TOP, fill=tk.BOTH, padx=20, pady=10)

        # Delete Button
        delete_btn = ttk.Button(
            history_buttons_frame,
            text="Delete Selected",
            command=self.delete_selected_history,
            style="Delete.TButton",
        )
        delete_btn.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))

        # Refresh Button
        refresh_btn = ttk.Button(
            history_buttons_frame,
            text="Refresh List",
            command=self.load_history,
            style="Dark.TButton",
        )
        refresh_btn.pack(side=tk.RIGHT, fill=tk.X, expand=True, padx=(10, 0))

        # 3. Settings Tab
        self.settings_frame = tk.Frame(self.notebook, bg="#121212")
        self.notebook.add(self.settings_frame, text="Settings")

        # Content for Settings Tab
        settings_content = tk.Frame(self.settings_frame, bg="#121212")
        settings_content.pack(pady=20, padx=20, fill=tk.BOTH, expand=True)

        # Output Directory Setting
        dir_label = tk.Label(
            settings_content,
            text="Output Directory",
            font=("Arial", 12, "bold"),
            fg="white",
            bg="#121212",
        )
        dir_label.pack(anchor="w", pady=(0, 10))

        # Current Directory Display
        self.current_dir_label = tk.Label(
            settings_content,
            text=f"Current: {CURRENT_CONFIG.get('output_dir', DEFAULT_OUTPUT_DIR)}",
            font=("Arial", 10),
            fg="#888888",
            bg="#1E1E1E",
            wraplength=500,
            justify=tk.LEFT,
            padx=10,
            pady=10,
        )
        self.current_dir_label.pack(anchor="w", fill=tk.X, pady=(0, 10))

        # Buttons for directory management
        dir_buttons_frame = tk.Frame(settings_content, bg="#121212")
        dir_buttons_frame.pack(anchor="w", fill=tk.X, pady=(0, 20))

        change_dir_btn = ttk.Button(
            dir_buttons_frame,
            text="Change Directory",
            command=self.change_output_directory,
            style="Dark.TButton",
        )
        change_dir_btn.pack(side=tk.LEFT, padx=(0, 10))

        reset_dir_btn = ttk.Button(
            dir_buttons_frame,
            text="Reset to Default",
            command=self.reset_output_directory,
            style="Dark.TButton",
        )
        reset_dir_btn.pack(side=tk.LEFT)

        # Directory Size Information
        size_separator = tk.Frame(settings_content, bg="#333333", height=1)
        size_separator.pack(fill=tk.X, pady=15)

        size_label = tk.Label(
            settings_content,
            text="Directory Size",
            font=("Arial", 12, "bold"),
            fg="white",
            bg="#121212",
        )
        size_label.pack(anchor="w", pady=(10, 5))

        # Size Display
        self.dir_size_label = tk.Label(
            settings_content,
            text="Calculating...",
            font=("Arial", 11),
            fg="#88FF88",
            bg="#1E1E1E",
            wraplength=500,
            justify=tk.LEFT,
            padx=10,
            pady=10,
        )
        self.dir_size_label.pack(anchor="w", fill=tk.X, pady=(0, 10))

        # Refresh Size Button
        refresh_size_btn = ttk.Button(
            settings_content,
            text="Refresh Size",
            command=self.update_directory_size,
            style="Dark.TButton",
        )
        refresh_size_btn.pack(anchor="w", pady=(0, 20))

        # --- Transcriber Tab Elements ---

        # Record Button
        self.record_button = ttk.Button(
            self.transcriber_frame,
            text="Record",
            command=self.toggle_recording,
            style="Dark.TButton",
        )
        self.record_button.pack(pady=20, fill=tk.X, padx=20)

        # Transcribed Text Display (Read-only Text widget)
        self.transcription_display = tk.Text(
            self.transcriber_frame,
            height=10,
            wrap=tk.WORD,
            font=("Arial", 11),
            relief=tk.SUNKEN,
            bg="#1E1E1E",
            fg="white",
            insertbackground="white",
            state=tk.DISABLED,
        )
        self.transcription_display.pack(pady=10, padx=20, fill=tk.BOTH, expand=True)

        # Initial text insertion for tk.Text
        self.transcription_display.config(state=tk.NORMAL)
        self.transcription_display.insert(
            tk.END, "Transcribed text will appear here. Select it to copy."
        )
        self.transcription_display.config(state=tk.DISABLED)

        # Exit Button
        self.exit_button = ttk.Button(
            master, text="Exit", command=self.on_closing, style="Dark.TButton"
        )
        self.exit_button.pack(pady=10)

        # Handle window closing
        master.protocol("WM_DELETE_WINDOW", self.on_closing)

        # Load initial history
        self.load_history()

        # Update directory size display
        self.update_directory_size()

        # Start the loop checking the queue
        self.master.after(100, self.check_transcription_queue)
        logging.info("GUI initialized successfully.")

    def update_directory_size(self):
        """Updates the directory size display label."""
        output_dir = CURRENT_CONFIG.get("output_dir", DEFAULT_OUTPUT_DIR)
        if os.path.exists(output_dir):
            size_bytes = get_directory_size(output_dir)
            formatted_size = format_size(size_bytes)
            self.dir_size_label.config(text=f"Total size: {formatted_size}")
            logging.info(f"Directory size updated: {formatted_size}")
        else:
            self.dir_size_label.config(text="Directory does not exist")

    def change_output_directory(self):
        """Opens a file dialog to change the output directory."""
        new_dir = filedialog.askdirectory(title="Select Output Directory")
        if new_dir:
            CURRENT_CONFIG["output_dir"] = new_dir
            save_config(CURRENT_CONFIG)
            self.current_dir_label.config(text=f"Current: {new_dir}")
            self.load_history()
            self.update_directory_size()
            messagebox.showinfo("Success", f"Output directory changed to:\n{new_dir}")
            logging.info(f"Output directory changed to: {new_dir}")

    def reset_output_directory(self):
        """Resets the output directory to the default."""
        CURRENT_CONFIG["output_dir"] = DEFAULT_OUTPUT_DIR
        save_config(CURRENT_CONFIG)
        self.current_dir_label.config(text=f"Current: {DEFAULT_OUTPUT_DIR}")
        self.load_history()
        self.update_directory_size()
        messagebox.showinfo(
            "Success", f"Output directory reset to: {DEFAULT_OUTPUT_DIR}"
        )
        logging.info(f"Output directory reset to default: {DEFAULT_OUTPUT_DIR}")

    def load_history(self):
        """Loads transcription history from JSON files in the output directory."""
        # Clear current list
        for item in self.history_tree.get_children():
            self.history_tree.delete(item)

        output_dir = CURRENT_CONFIG.get("output_dir", DEFAULT_OUTPUT_DIR)
        if not os.path.exists(output_dir):
            return

        json_files = glob.glob(os.path.join(output_dir, "*.json"))

        # Sort files by modification time (newest first)
        json_files.sort(key=os.path.getmtime, reverse=True)

        for file_path in json_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)

                    timestamp = data.get("timestamp", "Unknown")
                    audio_file = data.get("audio_file", os.path.basename(file_path))
                    transcription = data.get("transcription", "")

                    # Create preview (first 50 chars)
                    preview = (
                        transcription[:50] + "..."
                        if len(transcription) > 50
                        else transcription
                    )

                    # Store full path in hidden column for deletion
                    self.history_tree.insert(
                        "", tk.END, values=(timestamp, audio_file, preview, file_path)
                    )
            except Exception as e:
                logging.error(f"Error reading history file {file_path}: {e}")

    def on_history_item_selected(self, event):
        """Displays metadata preview when a history item is selected."""
        selected_item = self.history_tree.selection()
        if not selected_item:
            return

        # Get file path from hidden column
        item_values = self.history_tree.item(selected_item, "values")
        json_path = item_values[3]  # 4th column is filepath

        # Clear previous content
        self.metadata_display.config(state=tk.NORMAL)
        self.metadata_display.delete("1.0", tk.END)

        try:
            # Read JSON file
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)

                # Format metadata display
                metadata_text = f"""File: {data.get('audio_file', 'Unknown')}

Timestamp: {data.get('timestamp', 'Unknown')}

Model: {data.get('model', 'Unknown')}

━━━━━━━━━━━━━━━━━━

Transcription:

{data.get('transcription', 'No transcription available')}
"""
                self.metadata_display.insert("1.0", metadata_text)
        except Exception as e:
            error_text = f"Error loading metadata:\n{str(e)}"
            self.metadata_display.insert("1.0", error_text)
            logging.error(f"Error reading metadata: {e}")

        self.metadata_display.config(state=tk.DISABLED)

    def delete_selected_history(self):
        """Deletes the selected transcription and its associated files."""
        selected_item = self.history_tree.selection()
        if not selected_item:
            messagebox.showwarning(
                "No Selection", "Please select a transcription to delete."
            )
            return

        # Confirm deletion
        if not messagebox.askyesno(
            "Confirm Delete",
            "Are you sure you want to delete this transcription and the audio file? This cannot be undone.",
        ):
            return

        # Get file path from hidden column
        item_values = self.history_tree.item(selected_item, "values")
        json_path = item_values[3]  # 4th column is filepath

        try:
            # Delete JSON file
            if os.path.exists(json_path):
                os.remove(json_path)
                logging.info(f"Deleted JSON file: {json_path}")

            # Determine WAV path and delete it
            # Assuming json_path ends with .json, replace with .wav
            wav_path = json_path.rsplit(".", 1)[0] + ".wav"
            if os.path.exists(wav_path):
                os.remove(wav_path)
                logging.info(f"Deleted WAV file: {wav_path}")

            # Remove from Treeview
            self.history_tree.delete(selected_item)
            # Update directory size after deletion
            self.update_directory_size()
            messagebox.showinfo("Success", "Files deleted successfully.")

        except Exception as e:
            logging.error(f"Error deleting files: {e}")
            messagebox.showerror("Delete Error", f"Failed to delete files: {e}")

    def copy_to_clipboard(self, text: str):
        """Copies the given text to the system clipboard."""
        self.master.clipboard_clear()
        self.master.clipboard_append(text)
        logging.info("Transcription copied to clipboard.")

    def toggle_recording(self):
        """Toggles the recording state (start/stop)."""
        if self.recording:
            self.stop_recording()
        else:
            self.start_recording()

    def start_recording(self):
        """Starts the audio recording process."""
        self.recording = True
        self.frames = []
        self.start_time = time.time()
        logging.info("Recording started.")

        try:
            self.stream = self.p.open(
                format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK,
            )

            # Update button text to show status
            self.record_button.config(text="Stop Recording")

            # Update text display
            self.transcription_display.config(state=tk.NORMAL)
            self.transcription_display.delete("1.0", tk.END)
            self.transcription_display.insert(
                tk.END, "Recording in progress... (max 30s)"
            )
            self.transcription_display.config(state=tk.DISABLED)

            self.read_chunk()
            # Set a timer for automatic stop
            self.record_timer_id = self.master.after(
                MAX_RECORD_DURATION * 1000, self.auto_stop_recording
            )

        except Exception as e:
            self.recording = False
            self.record_button.config(text="Record", state=tk.NORMAL)
            logging.error(f"Microphone stream error on start: {e}")
            messagebox.showerror(
                "Audio Error",
                f"Could not open microphone stream: {e}\nCheck your microphone connection and permissions.",
            )
            if self.record_timer_id:
                self.master.after_cancel(self.record_timer_id)
                self.record_timer_id = None

    def read_chunk(self):
        """Reads one audio chunk and schedules the next call."""
        if self.recording:
            try:
                data = self.stream.read(CHUNK, exception_on_overflow=False)
                self.frames.append(data)
                self.master.after(1, self.read_chunk)
            except IOError as e:
                logging.error(f"Stream read IOError: {e}")
                self.stop_recording()

    def auto_stop_recording(self):
        """Automatically stops recording after MAX_RECORD_DURATION expires."""
        if self.recording:
            logging.info(
                f"Automatic stop triggered after {MAX_RECORD_DURATION} seconds."
            )
            self.stop_recording()
            messagebox.showinfo(
                "Recording Finished",
                f"The recording was stopped automatically after {MAX_RECORD_DURATION} seconds. Starting transcription...",
            )

    def stop_recording(self):
        """Stops the stream, saves the file, and starts the transcription thread."""
        if not self.recording:
            return

        self.recording = False

        if self.record_timer_id:
            self.master.after_cancel(self.record_timer_id)
            self.record_timer_id = None

        # Stop and close the stream
        if self.stream:
            self.stream.stop_stream()
            self.stream.close()
            self.stream = None
        logging.info("Audio stream closed.")

        WAVE_OUTPUT_FILENAME = output_filename()

        # Update button status for user feedback
        self.record_button.config(text="Saving...", state=tk.DISABLED)
        self.master.update_idletasks()

        # Save to WAVE file
        try:
            with wave.open(WAVE_OUTPUT_FILENAME, "wb") as wf:
                wf.setnchannels(CHANNELS)
                wf.setsampwidth(self.p.get_sample_size(FORMAT))
                wf.setframerate(RATE)
                wf.writeframes(b"".join(self.frames))
            logging.info(f"File saved successfully to {WAVE_OUTPUT_FILENAME}")

            self.record_button.config(text="Transcribing...")

            # Update text in read-only Text widget
            self.transcription_display.config(state=tk.NORMAL)
            self.transcription_display.delete("1.0", tk.END)
            self.transcription_display.insert(
                tk.END, "Transcription in progress (this may take a while)..."
            )
            self.transcription_display.config(state=tk.DISABLED)

            # === START TRANSCRIPTION IN A THREAD ===
            transcription_thread = threading.Thread(
                target=self.run_transcription, args=(WAVE_OUTPUT_FILENAME,), daemon=True
            )
            transcription_thread.start()
            logging.info("Transcription thread started.")

        except Exception as e:
            messagebox.showerror("Save Error", f"Failed to save WAVE file: {e}")
            self.record_button.config(text="Record", state=tk.NORMAL)
            logging.error(f"Error saving wave file: {e}", exc_info=True)

    def run_transcription(self, audio_path):
        """
        Method executed in a separate thread.
        Calls transcription and puts the result in the queue.
        """
        logging.info(
            f"Running transcription for {audio_path} in thread: {threading.get_ident()}"
        )
        transcription = transcribe_audio(audio_path, MODEL_NAME)
        self.transcription_queue.put(transcription)

    def check_transcription_queue(self):
        """
        Checks the queue for transcription results.
        Run in the main GUI thread.
        """
        try:
            result = self.transcription_queue.get(block=False)

            # 1. Update Transcriber tab (main output)
            self.transcription_display.config(state=tk.NORMAL)
            self.transcription_display.delete("1.0", tk.END)
            self.transcription_display.insert(tk.END, result)
            self.transcription_display.config(state=tk.DISABLED)

            # 2. Update History list (reload from disk)
            self.load_history()

            if "ERROR" in result:
                logging.warning("Transcription failed with error message.")
                messagebox.showerror(
                    "Transcription Failed",
                    "Transcription returned an error. Check logs for details.",
                )
            else:
                # Copy to clipboard upon successful transcription
                self.copy_to_clipboard(result)

            self.record_button.config(
                text="Record", state=tk.NORMAL
            )  # Return to normal state

        except queue.Empty:
            pass
        finally:
            self.master.after(100, self.check_transcription_queue)

    def on_closing(self):
        """Handles clean application shutdown."""
        logging.info("Closing application...")
        if self.recording:
            self.stop_recording()

        # Terminate PyAudio
        if self.p:
            self.p.terminate()

        self.master.destroy()
        logging.info("Application destroyed.")


# --- Application Startup ---
if __name__ == "__main__":
    logging.info("Whisper model loading might take a moment on first launch...")
    root = tk.Tk()
    app = AudioRecorderApp(root)
    root.mainloop()
