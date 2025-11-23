import React, { useRef, useEffect, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, VideoTexture, CanvasTexture } from "three";

// Moved from configuration.ts
export interface CharacterConfig {
  row: number;
  col: number;
  src: string;
  scale?: number;
}

interface CharacterProps {
  position: [number, number, number];
  src: string;
  scale?: number;
}

export const Character: React.FC<CharacterProps> = ({
  position,
  src,
  scale = 3.0
}) => {
  const meshRef = useRef<Mesh>(null);
  const [texture, setTexture] = useState<VideoTexture | CanvasTexture | null>(null);
  const { camera } = useThree();
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    let videoTexture: VideoTexture | null = null;
    let fallbackTriggered = false;
    
    // Configure video element for GIF playback
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.setAttribute('webkit-playsinline', 'true');
    
    console.log('Attempting to load GIF as video:', src);
    
    // Fallback function to use image approach
    const fallbackToImage = () => {
      if (fallbackTriggered) return; // Prevent multiple fallback attempts
      fallbackTriggered = true;
      
      console.log('Falling back to image approach');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        
        // Create a simple canvas texture (static image)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          
          const canvasTexture = new CanvasTexture(canvas);
          canvasTexture.generateMipmaps = false;
          canvasTexture.flipY = true;
          setTexture(canvasTexture);
          console.log('Fallback image texture created successfully');
        }
      };
      
      img.onerror = () => {
        console.error('Both video and image loading failed for:', src);
      };
      
      img.src = src;
    };
    
    // Set up video event handlers
    video.onerror = (e) => {
      console.error('Video failed to load:', e);
      fallbackToImage();
    };
    
    video.onloadedmetadata = () => {
      console.log('Video metadata loaded:', video.videoWidth, video.videoHeight);
      setImgDimensions({ width: video.videoWidth, height: video.videoHeight });
      
      // Create VideoTexture - this handles animation automatically
      videoTexture = new VideoTexture(video);
      videoTexture.generateMipmaps = false;
      videoTexture.flipY = true;
      setTexture(videoTexture);
      
      // Start playing the video
      video.play().then(() => {
        console.log('Video started playing successfully');
      }).catch((error) => {
        console.error('Video play failed:', error);
        fallbackToImage();
      });
    };
    
    // Set timeout fallback in case video takes too long
    const timeoutId = setTimeout(() => {
      if (!texture && !fallbackTriggered) {
        console.log('Video loading timeout, falling back to image');
        fallbackToImage();
      }
    }, 3000); // 3 second timeout
    
    // Set video source to the GIF
    video.src = src;
    video.load();
    
    return () => {
      clearTimeout(timeoutId);
      if (videoTexture) {
        videoTexture.dispose();
      }
      video.pause();
      video.src = '';
    };
  }, [src, texture]);

  // Calculate geometry dimensions based on scale and aspect ratio
  const geometryArgs = useMemo((): [number, number] => {
    if (!imgDimensions) return [1, 1];
    const aspect = imgDimensions.width / imgDimensions.height;
    const planeHeight = scale;
    const planeWidth = scale * aspect;
    return [planeWidth, planeHeight];
  }, [imgDimensions, scale]);

  // Make the character always face the camera (billboard effect)
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position);
    }
  });

  if (!texture || !imgDimensions) {
    return null; // Don't render until texture is loaded
  }

  const planeHeight = scale;

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1] + planeHeight * 0.5, position[2]]}
    >
      <planeGeometry args={geometryArgs} />
      <meshBasicMaterial 
        map={texture} 
        transparent 
        alphaTest={0.1}
        side={2} // DoubleSide to ensure visibility from all angles
      />
    </mesh>
  );
}; 