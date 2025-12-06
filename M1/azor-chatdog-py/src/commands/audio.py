"""
Audio generation commands for chat sessions.
Converts session messages to speech using TTS and saves as WAV files.
Supports multiple TTS engines: Coqui XTTS-v2, pyttsx3
"""
import os
import tempfile
import subprocess
import sys
import wave
from typing import List, Dict, Optional
from abc import ABC, abstractmethod
from files.config import LOG_DIR
from cli import console

# Try lazy import of pydub - it may fail on Python 3.14+ due to missing audioop module
HAVE_PYDUB = False
AudioSegment = None
pydub_play = None

try:
    from pydub import AudioSegment
    from pydub.playback import play as pydub_play
    HAVE_PYDUB = True
except Exception:
    pass


# ============================================================================
# TTS Engine Base Class
# ============================================================================

class TTSEngine(ABC):
    """Abstract base class for TTS engines"""
    
    def __init__(self, name: str):
        self.name = name
        self.is_available = False
    
    @abstractmethod
    def initialize(self) -> bool:
        """Initialize the TTS engine. Returns True if successful."""
        pass
    
    @abstractmethod
    def synthesize(self, text: str, output_path: str, language: str = 'pl', rate: int = 150, role: str = 'assistant') -> bool:
        """
        Synthesize speech from text.
        
        Args:
            text: Text to convert to speech
            output_path: Path where to save the audio file
            language: Language code (e.g., 'pl', 'en')
            rate: Speech rate (words per minute) - engine may interpret differently
            role: Role of the speaker ('user' or 'assistant')
        
        Returns:
            bool: True if successful
        """
        pass
    
    def cleanup(self):
        """Optional cleanup method"""
        pass


# ============================================================================
# Coqui TTS Engine (XTTS-v2)
# ============================================================================

class CoquiTTSEngine(TTSEngine):
    """Coqui TTS XTTS-v2 engine - excellent multilingual support including Polish"""
    
    def __init__(self):
        super().__init__("Coqui XTTS-v2")
        self.tts = None
    
    def initialize(self) -> bool:
        """Initialize Coqui TTS with XTTS-v2 model"""
        try:
            from TTS.api import TTS
            import torch
            
            # Fix for PyTorch 2.6+ security restrictions
            # Allow TTS config classes to be loaded safely
            try:
                from TTS.tts.configs.xtts_config import XttsConfig
                from TTS.tts.configs.vits_config import VitsConfig
                from TTS.tts.configs.shared_configs import BaseDatasetConfig
                torch.serialization.add_safe_globals([XttsConfig, VitsConfig, BaseDatasetConfig])
            except Exception as e:
                console.print_warning(f"⚠️  Nie można dodać safe globals (PyTorch < 2.6?): {e}")
            
            console.print_info("🎙️  Ładuję model Coqui XTTS-v2 (może potrwać przy pierwszym uruchomieniu)...")
            
            # Load XTTS-v2 multilingual model
            self.tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to("cpu")
            
            self.is_available = True
            console.print_info("✅ Coqui XTTS-v2 gotowy (obsługuje polski i angielski)")
            return True
            
        except Exception as e:
            console.print_warning(f"⚠️  Nie można załadować Coqui TTS: {e}")
            self.is_available = False
            return False
    
    def synthesize(self, text: str, output_path: str, language: str = 'pl', rate: int = 150, role: str = 'assistant') -> bool:
        """Generate speech using XTTS-v2"""
        if not self.is_available or not self.tts:
            return False
        
        try:
            # Map language codes
            lang_map = {
                'pl': 'pl',
                'polish': 'pl',
                'en': 'en',
                'english': 'en'
            }
            lang_code = lang_map.get(language.lower(), 'en')
            
            # Calculate speed from rate (XTTS uses speed multiplier, not WPM)
            # Normal speech is ~150 WPM, so rate/150 gives us speed multiplier
            speed = max(0.5, min(2.0, rate / 150.0))
            
            # XTTS-v2 is multi-speaker and requires speaker parameter
            # Use default speakers: "Claribel Dervla" (female) or "Damien Black" (male)
            speaker = "Claribel Dervla" if role.lower() != 'user' else "Damien Black"
            
            # Generate audio (XTTS outputs WAV directly)
            self.tts.tts_to_file(
                text=text,
                file_path=output_path,
                speaker=speaker,
                language=lang_code,
                speed=speed
            )
            
            # Verify output
            if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
                return False
            
            return True
            
        except Exception as e:
            console.print_error(f"Błąd Coqui TTS: {e}")
            return False


# ============================================================================
# PyTTSX3 Engine (Fallback)
# ============================================================================

class PyTTSX3Engine(TTSEngine):
    """PyTTSX3 engine - basic offline TTS fallback"""
    
    def __init__(self):
        super().__init__("pyttsx3")
    
    def initialize(self) -> bool:
        """Check if pyttsx3 is available"""
        try:
            import pyttsx3
            # Test initialization
            engine = pyttsx3.init()
            engine.stop()
            self.is_available = True
            console.print_info("✅ pyttsx3 dostępny jako zapasowy silnik TTS")
            return True
        except Exception as e:
            console.print_warning(f"⚠️  pyttsx3 niedostępny: {e}")
            self.is_available = False
            return False
    
    def synthesize(self, text: str, output_path: str, language: str = 'pl', rate: int = 150, role: str = 'assistant') -> bool:
        """Generate speech using pyttsx3"""
        if not self.is_available:
            return False
        
        try:
            import pyttsx3
            
            engine = pyttsx3.init()
            engine.setProperty('rate', rate)
            
            # Generate to temp file first
            temp_output = output_path + '.tmp'
            engine.save_to_file(text, temp_output)
            engine.runAndWait()
            
            # Verify file was created
            if not os.path.exists(temp_output) or os.path.getsize(temp_output) == 0:
                if os.path.exists(temp_output):
                    os.remove(temp_output)
                return False
            
            # Check if it's valid WAV, convert if needed (macOS generates AIFF)
            try:
                with wave.open(temp_output, 'rb') as wf:
                    if wf.getnframes() == 0:
                        if os.path.exists(temp_output):
                            os.remove(temp_output)
                        return False
                # Valid WAV, rename
                if os.path.exists(output_path):
                    os.remove(output_path)
                os.rename(temp_output, output_path)
            except wave.Error:
                # Not WAV, try to convert
                converted = _convert_to_wav(temp_output, output_path)
                if os.path.exists(temp_output):
                    os.remove(temp_output)
                if not converted:
                    return False
            
            return True
            
        except Exception as e:
            console.print_error(f"Błąd pyttsx3: {e}")
            return False


# ============================================================================
# Microsoft Edge TTS Engine (Primary)
# ============================================================================

class EdgeTTSEngine(TTSEngine):
    """Microsoft Edge TTS engine - excellent multilingual support including Polish"""

    def __init__(self):
        super().__init__("Microsoft Edge TTS")
        self.edge_tts = None

    def initialize(self) -> bool:
        """Initialize Microsoft Edge TTS"""
        try:
            import edge_tts
            import asyncio

            # Test initialization with async function
            async def test_voices():
                voices = await edge_tts.list_voices()
                return voices
            
            # Run async function to get voices
            try:
                voices = asyncio.run(test_voices())
            except RuntimeError:
                # If event loop is already running, just check if module loads
                voices = True
            
            if voices:
                self.edge_tts = edge_tts
                self.is_available = True
                console.print_info("✅ Microsoft Edge TTS gotowy (doskonała jakość polskiego i angielskiego)")
                return True
            else:
                console.print_warning("⚠️  Microsoft Edge TTS: brak dostępnych głosów")
                return False

        except Exception as e:
            console.print_warning(f"⚠️  Nie można załadować Microsoft Edge TTS: {e}")
            self.is_available = False
            return False

    def synthesize(self, text: str, output_path: str, language: str = 'pl', rate: int = 150, role: str = 'assistant') -> bool:
        """Generate speech using Microsoft Edge TTS"""
        if not self.is_available or not self.edge_tts:
            return False

        try:
            # Select voice based on language and role
            if language.lower() in ['pl', 'polish']:
                if role.lower() == 'user':
                    # Polish male voice for user
                    voice = "pl-PL-MarekNeural"  # Polish male voice
                else:
                    # Polish female voice for assistant
                    voice = "pl-PL-ZofiaNeural"  # Excellent Polish female voice
            else:
                if role.lower() == 'user':
                    # English male voice for user
                    voice = "en-US-ChristopherNeural"  # English male voice
                else:
                    # English female voice for assistant
                    voice = "en-US-AriaNeural"  # Excellent English female voice

            # Convert rate to Edge TTS format (+/- percentage)
            # Edge TTS uses +/- percentage from normal speed
            # Normal speech is ~150 WPM, so we map rate to +/- percentage
            if rate < 150:
                # Slower speech
                speed_percentage = max(-50, ((rate - 150) / 150) * 100)
            else:
                # Faster speech
                speed_percentage = min(100, ((rate - 150) / 150) * 100)

            rate_str = f"{speed_percentage:+.0f}%"

            # Generate audio using Edge TTS built-in save method
            # Edge TTS generates MP3 by default, so we'll use .mp3 extension temporarily
            temp_mp3_path = output_path + '.temp.mp3'
            communicate = self.edge_tts.Communicate(text, voice, rate=rate_str)

            # Use the built-in save method
            import asyncio
            asyncio.run(communicate.save(temp_mp3_path))

            # Verify MP3 was created
            if not os.path.exists(temp_mp3_path) or os.path.getsize(temp_mp3_path) == 0:
                console.print_error("Plik MP3 nie został utworzony")
                return False

            # Convert MP3 to WAV using pydub or ffmpeg
            success = self._convert_mp3_to_wav(temp_mp3_path, output_path)

            # Clean up temp file
            if os.path.exists(temp_mp3_path):
                os.remove(temp_mp3_path)

            if not success:
                return False

            # Final validation
            file_size = os.path.getsize(output_path)
            if file_size == 0:
                console.print_error("Plik WAV jest pusty")
                return False

            console.print_info(f"✅ Wygenerowano plik WAV: {file_size} bajtów")
            return True

        except Exception as e:
            console.print_error(f"Błąd Microsoft Edge TTS: {e}")
            return False

    def _convert_mp3_to_wav(self, mp3_path: str, wav_path: str) -> bool:
        """Convert MP3 file to WAV format"""
        # Try pydub first
        if HAVE_PYDUB:
            try:
                audio = AudioSegment.from_mp3(mp3_path)
                audio.export(wav_path, format="wav")
                return True
            except Exception as e:
                console.print_warning(f"Pydub conversion failed: {e}")

        # Fallback to ffmpeg
        try:
            result = subprocess.run([
                'ffmpeg', '-y',
                '-i', mp3_path,
                '-acodec', 'pcm_s16le',
                '-ar', '44100',
                '-ac', '1',
                wav_path
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

            if result.returncode == 0 and os.path.exists(wav_path):
                return True
            else:
                console.print_error(f"ffmpeg conversion failed: {result.stderr}")
                return False

        except Exception as e:
            console.print_error(f"ffmpeg conversion error: {e}")
            return False


# ============================================================================
# TTS Manager
# ============================================================================

class TTSManager:
    """Manages multiple TTS engines with automatic fallback"""
    
    def __init__(self):
        self.engines: List[TTSEngine] = []
        self.active_engine: Optional[TTSEngine] = None
        self._initialize_engines()
    
    def _initialize_engines(self):
        """Initialize all available TTS engines in priority order"""

        # Priority order: Microsoft Edge TTS (best), Coqui XTTS-v2, pyttsx3 (fallback)
        engine_classes = [
            CoquiTTSEngine,
            EdgeTTSEngine,
            PyTTSX3Engine
        ]
        
        for engine_class in engine_classes:
            try:
                engine = engine_class()
                if engine.initialize():
                    self.engines.append(engine)
                    if self.active_engine is None:
                        self.active_engine = engine
                        console.print_info(f"🎯 Używam silnika TTS: {engine.name}")
            except Exception as e:
                console.print_warning(f"Nie udało się zainicjować {engine_class.__name__}: {e}")
        
        if not self.engines:
            console.print_error("⚠️  Brak dostępnych silników TTS!")
    
    def synthesize(self, text: str, output_path: str, language: str = 'pl', rate: int = 150, role: str = 'assistant') -> bool:
        """
        Synthesize speech using available engines with fallback.
        
        Tries active engine first, then falls back to other engines.
        """
        if not self.engines:
            console.print_error("Brak dostępnych silników TTS")
            return False
        
        # Try active engine first
        if self.active_engine and self.active_engine.is_available:
            if self.active_engine.synthesize(text, output_path, language, rate, role):
                return True
            else:
                console.print_warning(f"Silnik {self.active_engine.name} zawiódł, próbuję zapasowy...")
        
        # Fallback to other engines
        for engine in self.engines:
            if engine != self.active_engine and engine.is_available:
                console.print_info(f"Próbuję zapasowy silnik: {engine.name}")
                if engine.synthesize(text, output_path, language, rate, role):
                    return True
        
        return False
    
    def get_active_engine_name(self) -> str:
        """Get name of currently active engine"""
        return self.active_engine.name if self.active_engine else "Brak"


# Initialize global TTS manager
_tts_manager: Optional[TTSManager] = None

def get_tts_manager() -> TTSManager:
    """Get or create global TTS manager instance"""
    global _tts_manager
    if _tts_manager is None:
        _tts_manager = TTSManager()
    return _tts_manager


def _convert_to_wav(input_path: str, output_path: str) -> bool:
    """
    Convert audio file to WAV format using ffmpeg or afconvert (macOS).
    
    Returns:
        bool: True if conversion successful
    """
    # Try afconvert first (built-in on macOS)
    if sys.platform == 'darwin':
        try:
            subprocess.run([
                'afconvert',
                '-f', 'WAVE',  # Output format
                '-d', 'LEI16@44100',  # 16-bit PCM at 44.1kHz
                input_path,
                output_path
            ], check=True, capture_output=True)
            
            # Verify the output
            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                return True
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            console.print_warning(f"afconvert nie powiódł się: {e}")
    
    # Try ffmpeg as fallback
    try:
        subprocess.run([
            'ffmpeg',
            '-i', input_path,
            '-acodec', 'pcm_s16le',
            '-ar', '44100',
            '-ac', '1',
            '-y',  # Overwrite output
            output_path
        ], check=True, capture_output=True, stderr=subprocess.DEVNULL)
        
        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    
    console.print_error("Nie można przekonwertować pliku audio do formatu WAV. Zainstaluj ffmpeg lub sprawdź afconvert.")
    return False


def _get_message_text(message: Dict) -> str:
    """Extract text from a message dict (universal format)."""
    if 'parts' in message and message['parts']:
        return message['parts'][0].get('text', '')
    return message.get('text', '')


def _get_message_role(message: Dict) -> str:
    """Extract role from a message dict."""
    return message.get('role', 'unknown')


def generate_audio_for_last(session_id: str, history: List[Dict], pause_ms: int = 500, play: bool = True, language: str = 'pl') -> Optional[str]:
    """
    Generate audio file for the last assistant response.
    
    Args:
        session_id: Session identifier
        history: Conversation history
        pause_ms: Pause duration (not used for single message, kept for API consistency)
        play: Whether to play the audio after generation
        language: Language code ('pl' for Polish, 'en' for English)
    
    Returns:
        str: Path to generated WAV file, or None if failed
    """
    tts_manager = get_tts_manager()
    
    if not tts_manager.engines:
        console.print_error("Brak dostępnych silników TTS.")
        return None
    
    # Find last assistant message
    last_assistant_msg = None
    for msg in reversed(history):
        if _get_message_role(msg) in ['model', 'assistant']:
            last_assistant_msg = msg
            break
    
    if not last_assistant_msg:
        console.print_error("Brak wiadomości asystenta w historii.")
        return None
    
    text = _get_message_text(last_assistant_msg)
    if not text:
        console.print_error("Ostatnia wiadomość asystenta jest pusta.")
        return None
    
    # Generate output filename: {session_id}-last.wav
    output_path = os.path.join(LOG_DIR, f"{session_id}-last.wav")
    
    console.print_info(f"Generuję audio dla ostatniej odpowiedzi (język: {language})...")
    
    success = tts_manager.synthesize(text, output_path, language=language, rate=150, role='assistant')
    
    if not success:
        console.print_error("Nie udało się wygenerować audio")
        return None
    
    console.print_info(f"✅ Zapisano: {output_path}")
    
    if play:
        _play_audio(output_path)
    
    return output_path


def generate_audio_for_all(
    session_id: str,
    history: List[Dict],
    pause_ms: int = 500,
    play: bool = True,
    user_rate: int = 120,
    assistant_rate: int = 130,
    language: str = 'pl'
) -> Optional[str]:
    """
    Generate audio file for entire conversation with different voices for user and assistant.
    
    Args:
        session_id: Session identifier
        history: Conversation history
        pause_ms: Pause duration between messages in milliseconds
        play: Whether to play the audio after generation
        user_rate: Speech rate for user messages (lower = slower, different voice)
        assistant_rate: Speech rate for assistant messages
        language: Language code ('pl' for Polish, 'en' for English)
    
    Returns:
        str: Path to generated WAV file, or None if failed
    """
    tts_manager = get_tts_manager()
    
    if not tts_manager.engines:
        console.print_error("Brak dostępnych silników TTS.")
        return None
    
    if not history:
        console.print_error("Historia sesji jest pusta.")
        return None
    
    console.print_info(f"Generuję audio dla całej konwersacji ({len(history)} wiadomości, język: {language})...")
    
    # Create temporary directory for individual message audio files
    temp_dir = tempfile.mkdtemp()
    temp_files: List[str] = []
    
    try:
        for i, msg in enumerate(history):
            role = _get_message_role(msg)
            text = _get_message_text(msg)
            
            if not text:
                continue
            
            # Determine speech rate based on role
            rate = user_rate if role == 'user' else assistant_rate
            
            # Generate temp audio file
            temp_audio_path = os.path.join(temp_dir, f"msg_{i}.wav")
            
            success = tts_manager.synthesize(text, temp_audio_path, language=language, rate=rate, role=role)
            
            if not success:
                console.print_warning(f"Pominięto wiadomość {i} z powodu błędu TTS")
                continue
            
            temp_files.append(temp_audio_path)
        
        if not temp_files:
            console.print_error("Nie udało się wygenerować żadnego segmentu audio.")
            return None
        
        # Generate output filename: {session_id}.wav
        output_path = os.path.join(LOG_DIR, f"{session_id}.wav")
        
        # Combine all segments
        console.print_info("Łączę segmenty audio...")
        
        if HAVE_PYDUB:
            # Use pydub for concatenation
            try:
                pause_segment = AudioSegment.silent(duration=pause_ms)
                audio_segments = []
                for idx, fpath in enumerate(temp_files):
                    segment = AudioSegment.from_wav(fpath)
                    audio_segments.append(segment)
                    if idx < len(temp_files) - 1:
                        audio_segments.append(pause_segment)
                combined = sum(audio_segments)
                combined.export(output_path, format="wav")
            except Exception as e:
                console.print_error(f"Błąd podczas łączenia audio (pydub): {e}")
                return None
        else:
            # Fallback: use wave module
            try:
                _concatenate_wav_files(temp_files, output_path, pause_ms)
            except Exception as e:
                console.print_error(f"Błąd podczas łączenia audio (wave fallback): {e}")
                return None
        
        console.print_info(f"✅ Zapisano: {output_path}")
        
        if play:
            _play_audio(output_path)
        
        return output_path
        
    except Exception as e:
        console.print_error(f"Błąd podczas generowania audio: {e}")
        return None
    
    finally:
        # Cleanup temp files
        import shutil
        try:
            shutil.rmtree(temp_dir)
        except Exception:
            pass


def _play_audio(file_path: str):
    """
    Play audio file using platform-appropriate method.
    
    Args:
        file_path: Path to the WAV file to play
    """
    console.print_info("▶️  Odtwarzam audio...")
    
    try:
        # Try pydub playback first if available
        if HAVE_PYDUB:
            audio = AudioSegment.from_wav(file_path)
            pydub_play(audio)
            return
        else:
            raise RuntimeError("pydub not available")
    except Exception as e:
        # Fallback to platform-specific command
        console.print_warning(f"Pydub playback unavailable: {e}")
        try:
            if sys.platform == 'darwin':  # macOS
                subprocess.run(['afplay', file_path], check=True)
            elif sys.platform == 'linux':
                subprocess.run(['aplay', file_path], check=True)
            elif sys.platform == 'win32':
                import winsound
                winsound.PlaySound(file_path, winsound.SND_FILENAME)
            else:
                console.print_warning(f"Automatyczne odtwarzanie nie jest obsługiwane na platformie: {sys.platform}")
                console.print_info(f"Otwórz plik ręcznie: {file_path}")
        except Exception as platform_error:
            console.print_error(f"Nie można odtworzyć pliku: {platform_error}")
            console.print_info(f"Plik został zapisany. Otwórz go ręcznie: {file_path}")


def _concatenate_wav_files(input_files: List[str], output_path: str, pause_ms: int = 500):
    """
    Concatenate WAV files using wave module.
    Fallback when pydub is unavailable. Requires all files have same audio parameters.
    """
    if not input_files:
        raise ValueError("No input files to concatenate")
    
    # Validate all input files exist and are valid WAV files
    valid_files = []
    for fpath in input_files:
        if not os.path.exists(fpath):
            console.print_warning(f"Plik nie istnieje, pomijam: {fpath}")
            continue
        
        if os.path.getsize(fpath) == 0:
            console.print_warning(f"Plik jest pusty, pomijam: {fpath}")
            continue
        
        try:
            with wave.open(fpath, 'rb') as test_wf:
                if test_wf.getnframes() == 0:
                    console.print_warning(f"Plik WAV nie zawiera danych, pomijam: {fpath}")
                    continue
            valid_files.append(fpath)
        except wave.Error as e:
            console.print_warning(f"Nieprawidłowy plik WAV ({e}), pomijam: {fpath}")
            continue
        except Exception as e:
            console.print_warning(f"Nie można otworzyć pliku ({e}), pomijam: {fpath}")
            continue
    
    if not valid_files:
        raise ValueError("Brak prawidłowych plików WAV do połączenia")
    
    # Read first file parameters
    with wave.open(valid_files[0], 'rb') as first_wf:
        params = first_wf.getparams()
        nchannels = params.nchannels
        sampwidth = params.sampwidth
        framerate = params.framerate
    
    # Calculate silence frames for pause
    pause_frames = int(framerate * pause_ms / 1000)
    silence_bytes = b'\x00' * (pause_frames * nchannels * sampwidth)
    
    # Write concatenated output
    with wave.open(output_path, 'wb') as out_wf:
        out_wf.setparams(params)
        
        for idx, fpath in enumerate(valid_files):
            with wave.open(fpath, 'rb') as in_wf:
                # Verify parameters match
                if (in_wf.getnchannels() != nchannels or 
                    in_wf.getsampwidth() != sampwidth or 
                    in_wf.getframerate() != framerate):
                    console.print_warning(f"Parametry WAV nie pasują, pomijam: {fpath}")
                    continue
                
                # Copy frames
                out_wf.writeframes(in_wf.readframes(in_wf.getnframes()))
            
            # Add pause between files (except after last)
            if idx < len(valid_files) - 1:
                out_wf.writeframes(silence_bytes)
