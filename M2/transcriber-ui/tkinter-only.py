import tkinter as tk
from tkinter import messagebox
import pyaudio
import wave
import os
import time

# --- Recording Configuration ---
CHUNK = 1024          # Buffer size for data (chunk)
FORMAT = pyaudio.paInt16 # 16-bit audio format
CHANNELS = 1          # Mono
RATE = 44100          # Sample rate (standard CD quality)
RECORD_SECONDS = 5    # Recording duration in seconds

APP_TITLE = "Azor Transcriber"
WAVE_OUTPUT_FILENAME = "output/recording.wav"


class AudioRecorderApp:
    def __init__(self, master):
        self.master = master
        master.title(APP_TITLE)

        # PyAudio object initialization
        self.p = pyaudio.PyAudio()
        self.frames = []
        self.stream = None
        self.recording = False
        self.is_pyaudio_initialized = True

        # --- GUI Elements ---
        self.label = tk.Label(master, text="Ready to record.", font=('Arial', 12))
        self.label.pack(pady=20)

        self.record_button = tk.Button(master, text=f"Record {RECORD_SECONDS} seconds", command=self.start_recording, 
                                       bg="red", fg="white", font=('Arial', 14))
        self.record_button.pack(pady=10)

        self.exit_button = tk.Button(master, text="Exit", command=self.on_closing)
        self.exit_button.pack(pady=10)
        
        # Ensure cleanup on window close
        master.protocol("WM_DELETE_WINDOW", self.on_closing)


    def start_recording(self):
        """Starts the audio recording process."""
        if self.recording:
            return

        self.recording = True
        self.frames = []
        
        try:
            # Open the audio stream
            self.stream = self.p.open(format=FORMAT,
                                     channels=CHANNELS,
                                     rate=RATE,
                                     input=True,
                                     frames_per_buffer=CHUNK)

            self.label.config(text=f"Recording for {RECORD_SECONDS} seconds...", fg="red")
            self.record_button.config(state=tk.DISABLED)
            
            # Use .after() for non-blocking chunk reading in the Tkinter main loop.
            self.start_time = time.time()
            self.read_chunk()

        except Exception as e:
            self.recording = False
            self.record_button.config(state=tk.NORMAL)
            self.label.config(text="Error! Check microphone/dependencies.", fg="black")
            messagebox.showerror("Audio Error", f"Could not open microphone stream: {e}")
            
    def read_chunk(self):
        """Reads one chunk of audio data and schedules the next call."""
        # Only continue reading if recording is active and duration limit is not reached
        if self.recording and (time.time() - self.start_time) < RECORD_SECONDS:
            data = self.stream.read(CHUNK, exception_on_overflow=False)
            self.frames.append(data)
            # Schedule the next read based on chunk time to maintain real-time accuracy
            self.master.after(int(CHUNK * 1000 / RATE), self.read_chunk) 
        else:
            self.stop_recording()

    def stop_recording(self):
        """Stops the stream, saves the file, and resets the GUI."""
        if not self.recording:
            return

        self.recording = False
        self.record_button.config(state=tk.NORMAL)

        # Stop and close the stream resource
        if self.stream:
            self.stream.stop_stream()
            self.stream.close()
            self.stream = None

        # Save to WAVE file
        try:
            with wave.open(WAVE_OUTPUT_FILENAME, 'wb') as wf:
                wf.setnchannels(CHANNELS)
                wf.setsampwidth(self.p.get_sample_size(FORMAT))
                wf.setframerate(RATE)
                wf.writeframes(b''.join(self.frames))

            self.label.config(text=f"Saved '{WAVE_OUTPUT_FILENAME}'", fg="green")
            messagebox.showinfo("Success", f"Recording saved as:\n{os.path.abspath(WAVE_OUTPUT_FILENAME)}")

        except Exception as e:
            self.label.config(text="File save error!", fg="black")
            messagebox.showerror("Save Error", f"Failed to save WAVE file: {e}")

    def on_closing(self):
        """Handles clean application shutdown, terminating PyAudio."""
        # Ensure PyAudio is terminated only when exiting the application
        if self.is_pyaudio_initialized and self.p:
            self.p.terminate()
            self.is_pyaudio_initialized = False # Prevent double termination
        self.master.destroy()

# --- Application Startup ---
if __name__ == "__main__":
    root = tk.Tk()
    # Set fixed window size
    root.geometry("400x200") 
    app = AudioRecorderApp(root)
    root.mainloop()
