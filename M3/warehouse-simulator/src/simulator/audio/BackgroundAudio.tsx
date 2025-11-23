import React, { useEffect } from 'react';
import { useAudio } from './AudioControls';

const BackgroundAudio: React.FC = () => {
  const { audioRef, isPlaying } = useAudio();

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, audioRef]);

  return (
    <audio
      ref={audioRef}
      src="/assets/sound.mp3"
      loop
      autoPlay
      style={{ display: 'none' }}
    />
  );
};

export default BackgroundAudio; 