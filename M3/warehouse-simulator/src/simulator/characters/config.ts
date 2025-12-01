
const SOUND_FOLDER = '/assets/sounds/';
const SPRITE_FOLDER = '/assets/sprites/';

// Ujednolicona mapa logicznych nazw zasobów do plików
export const ASSET_MAP = {
    // Grafika
    ss_soldier_sprite: SPRITE_FOLDER + 'sprites-ss.png',
    
    // Dźwięki
    machine_gun_attack: SOUND_FOLDER + 'ATKMACHINEGUNSND.WAV',
    scream_1: SOUND_FOLDER + 'DEATHSCREAM1SND.WAV',
    scream_2: SOUND_FOLDER + 'DEATHSCREAM2SND.WAV',
    scream_4: SOUND_FOLDER + 'DEATHSCREAM4SND.WAV',
    scream_5: SOUND_FOLDER + 'DEATHSCREAM5SND.WAV',
    scream_6: SOUND_FOLDER + 'DEATHSCREAM6SND.WAV',
    scream_7: SOUND_FOLDER + 'DEATHSCREAM7SND.WAV',
    scream_8: SOUND_FOLDER + 'DEATHSCREAM8SND.WAV',
    scream_9: SOUND_FOLDER + 'DEATHSCREAM9SND.WAV',
};

// Konfiguracja dla Żołnierza SS
export const SS_SOLDIER_CONFIG = {
    name: 'SS_Soldier',
    src: ASSET_MAP.ss_soldier_sprite, // Używa mapy
    cols: 8,
    rows: 7,
    scale: 2.5,
    fps: 10,
    
    // Kolory do usunięcia (Chroma Key)
    removeColors: [
        { r: 99, g: 116, b: 125 }, 
        { r: 125, g: 147, b: 158 } 
    ],
    
    sequences: {
        'walk-front': [8, 16, 24, 32], 
        'walk-back': [12, 20, 28, 36], 
        'walk-left': [10, 18, 26, 34], 
        'walk-right': [14, 22, 30, 38], 
        'idle': [0], 
        'attack': [48, 49, 50], 
        'pain': [40, 41], 
        'death': [42, 43, 44, 45] // Ostatnia klatka: 45 (leżenie)
    },
    
    defaultSequence: 'walk-front',

    // Mapowanie do logicznych nazw dźwięków z ASSET_MAP
    sounds: {
        'attack': 'machine_gun_attack',
        'death_scream_1': 'scream_1',
        'death_scream_2': 'scream_2',
        'death_scream_4': 'scream_4',
        'death_scream_5': 'scream_5',
        'death_scream_6': 'scream_6',
        'death_scream_7': 'scream_7',
        'death_scream_8': 'scream_8',
        'death_scream_9': 'scream_9',
    }
};
