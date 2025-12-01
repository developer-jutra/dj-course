import React, { useRef, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PositionalAudio } from '@react-three/drei';
import { SS_SOLDIER_CONFIG, ASSET_MAP } from './config';
import { SpriteAnimator } from './SpriteAnimator';

const MIN_BURST_SHOTS = 1;
const MAX_BURST_SHOTS = 4;

interface SoldierProps {
  position: [number, number, number];
}

export interface SoldierRef {
  die: () => void;
  isDead: () => boolean;
}

const useChromaKeyTexture = (config: typeof SS_SOLDIER_CONFIG) => {
    const texture = useLoader(THREE.TextureLoader, config.src);
  
    const processedTexture = useMemo(() => {
      const img = texture.image as HTMLImageElement;
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
  
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;
      const tolerance = 30;
  
      for (let i = 0; i < data.length; i += 4) {
        let isBackground = false;
        const pixelR = data[i];
        const pixelG = data[i + 1];
        const pixelB = data[i + 2];
  
        for (const targetColor of config.removeColors) {
          const { r: tr, g: tg, b: tb } = targetColor;
          if (
            Math.abs(pixelR - tr) < tolerance &&
            Math.abs(pixelG - tg) < tolerance &&
            Math.abs(pixelB - tb) < tolerance
          ) {
            isBackground = true;
            break;
          }
        }
  
        if (isBackground) {
          data[i + 3] = 0; // Alpha = 0
        }
      }
      ctx.putImageData(imgData, 0, 0);
  
      const canvasTexture = new THREE.CanvasTexture(canvas);
      canvasTexture.magFilter = THREE.NearestFilter;
      canvasTexture.minFilter = THREE.NearestFilter;
      canvasTexture.repeat.set(1 / config.cols, 1 / config.rows);
      return canvasTexture;
    }, [texture, config]);
  
    return processedTexture;
  };

export const Soldier = forwardRef<SoldierRef, SoldierProps>(({ position }, ref) => {
  const { camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isDead, setIsDead] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackTimer, setAttackTimer] = useState(Math.random() * 5000);
  const [burstShots, setBurstShots] = useState(0);
  const attackInterval = useMemo(() => 5000 + Math.random() * 3000, []);

  const baseTexture = useChromaKeyTexture(SS_SOLDIER_CONFIG);
  const texture = useMemo(() => baseTexture?.clone(), [baseTexture]);

  const deathSoundBuffers = useLoader(THREE.AudioLoader, [
      ASSET_MAP.scream_1, ASSET_MAP.scream_2, ASSET_MAP.scream_4,
      ASSET_MAP.scream_5, ASSET_MAP.scream_6, ASSET_MAP.scream_7, ASSET_MAP.scream_8, ASSET_MAP.scream_9
  ]);

  const attackAudioRef = useRef<THREE.PositionalAudio>(null);
  const deathAudioRef = useRef<THREE.PositionalAudio>(null);

  const soundSystem = useMemo(() => ({
    playAttackSound: (shouldPlay: boolean) => {
      if (attackAudioRef.current) {
        if (shouldPlay && !attackAudioRef.current.isPlaying) {
          attackAudioRef.current.play();
        } else if (!shouldPlay && attackAudioRef.current.isPlaying) {
          attackAudioRef.current.stop();
        }
      }
    },
    playDeathSound: () => {
        if (deathAudioRef.current) {
            const randomBuffer = deathSoundBuffers[Math.floor(Math.random() * deathSoundBuffers.length)];
            deathAudioRef.current.setBuffer(randomBuffer);
            if (!deathAudioRef.current.isPlaying) {
                deathAudioRef.current.play();
            }
        }
    },
  }), [deathSoundBuffers]);

  const animator = useMemo(() => {
    if (!texture) return null;
    return new SpriteAnimator(texture, SS_SOLDIER_CONFIG, soundSystem);
  }, [texture, soundSystem]);

  const die = () => {
    if (isDead || !animator) return;
    setIsDead(true);
    animator.setSequence('death', false);
    soundSystem.playAttackSound(false);
    soundSystem.playDeathSound();
  };

  useImperativeHandle(ref, () => ({
    die,
    isDead: () => isDead,
  }));

  useFrame((state, delta) => {
    const { clock } = state;
    if (!animator || !meshRef.current) return;

    if (!isDead) {
        animator.update(clock.elapsedTime * 1000);

        if (camera) {
            meshRef.current.lookAt(camera.position);
            meshRef.current.rotation.x = 0;
            meshRef.current.rotation.z = 0;
        }

        if (isAttacking) {
            if (animator.isFinished) {
                if (burstShots > 0) {
                    setBurstShots(s => s - 1);
                    animator.setSequence('attack', false);
                } else {
                    setIsAttacking(false);
                    animator.setSequence('walk-front', true);
                }
            }
        } else {
            setAttackTimer(t => t + delta * 1000);
            if (attackTimer > attackInterval) {
                const shots = Math.floor(Math.random() * (MAX_BURST_SHOTS - MIN_BURST_SHOTS + 1)) + MIN_BURST_SHOTS;
                setBurstShots(shots - 1);
                setIsAttacking(true);
                animator.setSequence('attack', false);
                setAttackTimer(0);
            }
        }
    } else {
        if (!animator.isFinished) {
            animator.update(clock.elapsedTime * 1000);
        }
        if (camera) {
            meshRef.current.lookAt(camera.position);
            meshRef.current.rotation.x = -Math.PI / 2;
        }
    }
  });
  
  if (!texture) return null;

  const frameAspect = (texture.image.width / SS_SOLDIER_CONFIG.cols) / (texture.image.height / SS_SOLDIER_CONFIG.rows);
  const geometryArgs: [number, number] = [SS_SOLDIER_CONFIG.scale * frameAspect, SS_SOLDIER_CONFIG.scale];

  return (
    <mesh ref={meshRef} position={isDead ? [position[0], 0.01, position[2]] : [position[0], SS_SOLDIER_CONFIG.scale / 2, position[2]]} rotation-order="YXZ">
      <planeGeometry args={geometryArgs} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} alphaTest={0.5} />
      <PositionalAudio ref={attackAudioRef} url={ASSET_MAP.machine_gun_attack} loop distance={5} />
      <PositionalAudio ref={deathAudioRef} url={ASSET_MAP.scream_1} loop={false} distance={5} />
    </mesh>
  );
});
