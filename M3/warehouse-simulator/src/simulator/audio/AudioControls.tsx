import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Tooltip } from '../tooltips/Tooltip';

// Context for audio control
interface AudioContextType {
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  // Attempt to play audio on first user interaction
  React.useEffect(() => {
    const tryPlay = () => {
      const audio = audioRef.current;
      if (audio && isPlaying && audio.paused) {
        audio.play().catch(() => {});
      }
    };
    window.addEventListener('click', tryPlay, { once: true });
    window.addEventListener('keydown', tryPlay, { once: true });
    window.addEventListener('touchstart', tryPlay, { once: true });
    return () => {
      window.removeEventListener('click', tryPlay);
      window.removeEventListener('keydown', tryPlay);
      window.removeEventListener('touchstart', tryPlay);
    };
  }, [isPlaying]);

  return (
    <AudioContext.Provider value={{ isPlaying, play, pause, audioRef }}>
      {children}
    </AudioContext.Provider>
  );
};

export const AudioControls: React.FC = () => {
  const { isPlaying, play, pause } = useAudio();

  return (
    <Tooltip title="Audio" defaultOpen={false}>
      <div className="flex items-center gap-4 p-2">
        <button
          onClick={isPlaying ? pause : play}
          className="bg-gray-700 hover:bg-gray-600 text-white rounded p-2 focus:outline-none"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? (
            <span role="img" aria-label="Pause">⏸️</span>
          ) : (
            <span role="img" aria-label="Play">▶️</span>
          )}
        </button>
        <span className="text-sm">{isPlaying ? 'Playing' : 'Paused'}</span>
      </div>
    </Tooltip>
  );
};
