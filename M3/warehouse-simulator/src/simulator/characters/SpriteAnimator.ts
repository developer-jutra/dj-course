import * as THREE from 'three';

interface SoundSystem {
    playAttackSound(shouldPlay: boolean): void;
    playDeathSound(): void;
}

interface Sequences {
    [key: string]: number[];
}

interface Config {
    cols: number;
    rows: number;
    sequences: Sequences;
    fps: number;
    defaultSequence: string;
}

export class SpriteAnimator {
    private texture: THREE.Texture;
    private cols: number;
    private rows: number;
    private allSequences: Sequences;
    private fps: number;
    private soundSystem: SoundSystem;

    private frameDuration: number;
    private lastTime: number = 0;
    private seqIndex: number = 0;
    public currentSequenceName: string;
    private loop: boolean = true;
    public isFinished: boolean = false;

    constructor(texture: THREE.Texture, config: Config, soundSystem: SoundSystem) {
        this.texture = texture;
        this.cols = config.cols;
        this.rows = config.rows;
        this.allSequences = config.sequences;
        this.fps = config.fps;
        this.soundSystem = soundSystem;

        this.frameDuration = 1000 / this.fps;
        this.currentSequenceName = config.defaultSequence;

        this.updateTextureOffset();
    }

    setSequence(name: string, loop: boolean = true) {
        const isAttack = (name === 'attack');
        const wasAttacking = (this.currentSequenceName === 'attack');

        if (this.currentSequenceName !== name || !loop) {
            this.currentSequenceName = name;
            this.seqIndex = 0;
            this.loop = loop;
            this.isFinished = false;
        }

        if (isAttack && !wasAttacking) {
            this.soundSystem.playAttackSound(true);
        } else if (!isAttack && wasAttacking) {
            this.soundSystem.playAttackSound(false);
        }
    }

    forceLastFrame() {
        const currentSequence = this.allSequences[this.currentSequenceName];
        if (currentSequence && currentSequence.length > 0) {
            this.seqIndex = currentSequence.length - 1;
            this.updateTextureOffset();
            this.isFinished = true;
        }
    }

    update(time: number) {
        if (this.isFinished) return;

        const currentSequence = this.allSequences[this.currentSequenceName];
        if (!currentSequence) return;

        if (!this.loop && this.seqIndex >= currentSequence.length - 1) {
            this.forceLastFrame();
            return;
        }

        if (time - this.lastTime > this.frameDuration) {
            this.lastTime = time;
            this.seqIndex += 1;

            if (this.loop && this.seqIndex >= currentSequence.length) {
                this.seqIndex = 0;
            }

            if (this.seqIndex < currentSequence.length) {
                this.updateTextureOffset();
            }
        }
    }

    private updateTextureOffset() {
        const currentSequence = this.allSequences[this.currentSequenceName];
        if (!currentSequence || currentSequence.length === 0) return;

        const frameIndex = currentSequence[this.seqIndex];
        if (frameIndex === undefined) return;

        const col = frameIndex % this.cols;
        const row = Math.floor(frameIndex / this.cols);

        this.texture.offset.x = col / this.cols;
        this.texture.offset.y = 1 - ((row + 1) / this.rows);
    }
}
