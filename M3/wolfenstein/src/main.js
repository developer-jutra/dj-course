import * as THREE from 'three';

    // ==========================================
    // 1. CENTRALNA MAPA ZASOBÓW I KONFIGURACJA
    // ==========================================

    const SOUND_FOLDER = 'sounds/';
    const SPRITE_FOLDER = 'sprites/';
    
    // Ujednolicona mapa logicznych nazw zasobów do plików
    const ASSET_MAP = {
        // Grafika
        ss_soldier_sprite: SPRITE_FOLDER + '/sprites-ss.png',
        
        // Dźwięki (tylko te, które istnieją i są używane)
        machine_gun_attack: SOUND_FOLDER + '/ATKMACHINEGUNSND.WAV',
        // Używam logicznych nazw dla dźwięków śmierci, które będą mapowane w SS_SOLDIER_CONFIG
        scream_1: SOUND_FOLDER + '/DEATHSCREAM1SND.WAV',
        scream_2: SOUND_FOLDER + '/DEATHSCREAM2SND.WAV',
        // scream_3: SOUND_FOLDER + '/DEATHSCREAM3SND.WAV', // o dziwo tego nie ma
        scream_4: SOUND_FOLDER + '/DEATHSCREAM4SND.WAV',
        scream_5: SOUND_FOLDER + '/DEATHSCREAM5SND.WAV',
        scream_6: SOUND_FOLDER + '/DEATHSCREAM6SND.WAV',
        scream_7: SOUND_FOLDER + '/DEATHSCREAM7SND.WAV',
        scream_8: SOUND_FOLDER + '/DEATHSCREAM8SND.WAV',
        scream_9: SOUND_FOLDER + '/DEATHSCREAM9SND.WAV',
    };

    // Konfiguracja dla Żołnierza SS
    const SS_SOLDIER_CONFIG = {
        name: 'SS_Soldier',
        src: ASSET_MAP.ss_soldier_sprite, // Używa mapy
        cols: 8,
        rows: 7,
        scale: 2.5,
        fps: 6,
        
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
            // 'death_scream_3': 'scream_3',
            'death_scream_4': 'scream_4',
            'death_scream_5': 'scream_5',
            'death_scream_6': 'scream_6',
            'death_scream_7': 'scream_7',
            'death_scream_8': 'scream_8',
            'death_scream_9': 'scream_9',
        }
    };


    // ==========================================
    // 2. KLASY NARZĘDZIOWE
    // ==========================================

    /**
     * Odpowiada za przygotowanie tekstury (wycięcie tła).
     */
    class TextureProcessor {
        static loadAndProcess(THREE, config, isSpriteSheet = true) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = config.src;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    const imgData = ctx.getImageData(0, 0, img.width, img.height);
                    const data = imgData.data;
                    const tolerance = 30; 

                    for (let i = 0; i < data.length; i += 4) {
                        let isBackground = false;
                        const pixelR = data[i];
                        const pixelG = data[i+1];
                        const pixelB = data[i+2];

                        for (const targetColor of config.removeColors) {
                            const { r: tr, g: tg, b: tb } = targetColor;
                            
                            if (Math.abs(pixelR - tr) < tolerance && 
                                Math.abs(pixelG - tg) < tolerance && 
                                Math.abs(pixelB - tb) < tolerance) {
                                isBackground = true;
                                break; 
                            }
                        }

                        if (isBackground) {
                            data[i+3] = 0; // Alpha = 0 (Przezroczystość)
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);

                    const texture = new THREE.CanvasTexture(canvas);
                    texture.magFilter = THREE.NearestFilter; 
                    texture.minFilter = THREE.NearestFilter;
                    
                    if (isSpriteSheet) {
                        texture.repeat.set(1 / config.cols, 1 / config.rows);
                    }
                    
                    resolve(texture);
                };
                img.onerror = reject;
            });
        }
    }

    /**
     * Zarządza ładowaniem i buforowaniem wszystkich dźwięków.
     */
    class SoundManager {
        constructor(THREE, audioListener, config) {
            this.THREE = THREE;
            this.audioListener = audioListener;
            this.config = config;
            this.soundBuffers = {};
            this.audioLoader = new THREE.AudioLoader();
        }

        async loadSounds() {
            const soundKeys = Object.keys(this.config.sounds);
            
            for (const key of soundKeys) {
                const logicalName = this.config.sounds[key];
                const path = ASSET_MAP[logicalName]; // Używamy logicznej nazwy do pobrania ścieżki
                
                if (!path) {
                    console.warn(`Brak mapowania pliku dla logicznej nazwy dźwięku: ${logicalName}`);
                    continue;
                }

                try {
                    const buffer = await new Promise((resolve, reject) => {
                        this.audioLoader.load(path, resolve, undefined, reject);
                    });
                    // Bufor zapisujemy pod logiczną nazwą klucza z config.sounds (np. 'attack', 'death_scream_1')
                    this.soundBuffers[key] = buffer;
                } catch (error) {
                    // Ciche logowanie, jeśli plik .WAV jest niedostępny
                    // console.warn(`Błąd ładowania dźwięku ${key} z ${path}. Może być niedostępny.`);
                }
            }
            return this.soundBuffers;
        }

        getSoundBuffer(key) {
            return this.soundBuffers[key];
        }
    }

    /**
     * Zarządza stanem animacji pojedynczej tekstury oraz aktywacją dźwięku.
     */
    class SpriteAnimator {
        constructor(texture, config, soundSystem) {
            this.texture = texture;
            this.cols = config.cols;
            this.rows = config.rows;
            this.allSequences = config.sequences; 
            this.fps = config.fps;
            this.soundSystem = soundSystem; 
            
            this.frameDuration = 1000 / this.fps;
            this.lastTime = 0; // Przechowuje absolutny czas ostatniej aktualizacji klatki
            this.seqIndex = 0;
            this.currentSequenceName = config.defaultSequence; 
            this.loop = true; 
            this.isFinished = false; 
            this.isAttacking = false;
            
            this.updateTextureOffset(); 
        }
        
        setSequence(name, loop = true) {
            const wasAttacking = this.isAttacking;
            
            if (this.currentSequenceName !== name || !loop) { 
                this.currentSequenceName = name;
                this.seqIndex = 0; 
                this.loop = loop;
                this.isFinished = false; 
            }

            this.isAttacking = (name === 'attack');

            if (this.isAttacking && !wasAttacking) {
                this.soundSystem.playAttackSound(true);
            } else if (!this.isAttacking && wasAttacking) {
                this.soundSystem.playAttackSound(false); 
            }
        }
        
        // Ustawia animatora na ostatnią klatkę bieżącej sekwencji
        forceLastFrame() {
            const currentSequence = this.allSequences[this.currentSequenceName];
            if (currentSequence && currentSequence.length > 0) {
                this.seqIndex = currentSequence.length - 1;
                this.updateTextureOffset();
                this.isFinished = true;
            }
        }

        update(time) {
            if (this.isFinished) return; 

            const currentSequence = this.allSequences[this.currentSequenceName];
            
            // Logika animacji jednokrotnej
            if (!this.loop && this.seqIndex >= currentSequence.length - 1) { 
                this.forceLastFrame();
                
                if (this.isAttacking) {
                    this.setSequence('idle', true); // Po ataku wraca do bezczynności
                }
                return;
            }
            
            // Logika klatek animacji oparta na czasie
            if (time - this.lastTime > this.frameDuration) {
                this.lastTime = time;
                
                this.seqIndex += 1;
                
                // Logika zapętlania
                if (this.loop && this.seqIndex >= currentSequence.length) {
                    this.seqIndex = 0;
                }
                
                if (this.seqIndex < currentSequence.length) { 
                    this.updateTextureOffset();
                }
            }
        }

        updateTextureOffset() {
            const currentSequence = this.allSequences[this.currentSequenceName];
            if (!currentSequence || currentSequence.length === 0) return;

            const frameIndex = currentSequence[this.seqIndex];
            
            const col = frameIndex % this.cols;
            const row = Math.floor(frameIndex / this.cols);

            this.texture.offset.x = col / this.cols;
            this.texture.offset.y = 1 - ((row + 1) / this.rows);
        }
    }

    /**
     * Kontroler dźwięku dla pojedynczej jednostki.
     */
    class EntitySoundSystem {
        constructor(THREE, audioListener, soundBuffer, deathSoundBuffers) {
            this.THREE = THREE;
            this.audioListener = audioListener;
            this.soundBuffer = soundBuffer;
            this.deathSoundBuffers = deathSoundBuffers;

            this.audioAttack = new this.THREE.PositionalAudio(audioListener);
            if (this.soundBuffer) {
                this.audioAttack.setBuffer(soundBuffer);
                this.audioAttack.setLoop(true); 
                this.audioAttack.setVolume(0.5); 
                this.audioAttack.setRefDistance(5); 
            }

            this.audioDeath = new this.THREE.PositionalAudio(audioListener);
            this.audioDeath.setVolume(0.8);
            this.audioDeath.setRefDistance(5);
        }

        attachTo(mesh) {
            mesh.add(this.audioAttack);
            mesh.add(this.audioDeath);
        }

        playAttackSound(shouldPlay) {
            if (this.soundBuffer) {
                if (shouldPlay && !this.audioAttack.isPlaying) {
                    this.audioAttack.play();
                } else if (!shouldPlay && this.audioAttack.isPlaying) {
                    this.audioAttack.stop();
                }
            }
        }
        
        playDeathSound() {
            const buffers = Object.values(this.deathSoundBuffers).filter(b => b); 
            if (buffers.length > 0) {
                const randomBuffer = buffers[Math.floor(Math.random() * buffers.length)];
                
                this.audioDeath.setBuffer(randomBuffer);
                this.audioDeath.setLoop(false);
                if (!this.audioDeath.isPlaying) {
                    this.audioDeath.play();
                }
            }
        }
    }


    // ==========================================
    // 3. KLASY GRY (Game Objects)
    // ==========================================
    
    /**
     * Reprezentuje konkretną postać na scenie (żołnierza).
     */
    class GameEntity {
        constructor(THREE, baseTexture, config, x, z, camera, soundBuffers) {
            this.THREE = THREE;
            this.camera = camera; 
            this.config = config;
            
            this.texture = baseTexture.clone();
            this.texture.needsUpdate = true; 
            
            // Filtrowanie tylko dźwięków śmierci
            const deathBuffers = Object.keys(soundBuffers)
                .filter(key => key.startsWith('death_scream_'))
                .reduce((acc, key) => { acc[key] = soundBuffers[key]; return acc; }, {});
                
            this.soundSystem = new EntitySoundSystem(THREE, gameWorld.audioListener, soundBuffers.attack, deathBuffers);

            this.animator = new SpriteAnimator(this.texture, config, this.soundSystem);
            this.mesh = this.createMesh(config);
            
            this.soundSystem.attachTo(this.mesh);
            
            this.mesh.position.set(x, config.scale / 2, z); 
            
            this.attackTimer = Math.random() * 5000; 
            this.attackInterval = 5000 + Math.random() * 3000; 
            this.isAttacking = false;
            this.isDead = false; 
            this.isDeathSequenceDone = false; 
        }

        createMesh(config) {
            const material = new this.THREE.MeshBasicMaterial({
                map: this.texture,
                transparent: true,
                side: this.THREE.DoubleSide,
                alphaTest: 0.5 
            });

            const fullW = this.texture.image.width;
            const fullH = this.texture.image.height;
            const frameAspect = (fullW / config.cols) / (fullH / config.rows);

            // Sprite jest tworzony w płaszczyźnie XY (pionowo)
            const geometry = new this.THREE.PlaneGeometry(
                config.scale * frameAspect, 
                config.scale
            );

            const mesh = new this.THREE.Mesh(geometry, material);
            mesh.rotation.order = 'YXZ'; 
            mesh.up.set(0, 1, 0); 
            
            return mesh;
        }

        die() {
            if (this.isDead) return;
            
            this.isDead = true;
            this.animator.setSequence('death', false); 
            this.soundSystem.playAttackSound(false); 
            this.soundSystem.playDeathSound(); 
            
            // Martwy żołnierz leży na płaszczyźnie
            this.mesh.position.y = 0.01; 
            
            // Kładziemy siatkę na boku (obrót o -90 stopni)
            this.mesh.rotation.x = -Math.PI / 2; 
        }
        
        // Przyjmuje absolutny czas (time) dla Animator'a i różnicę czasu (deltaTime) dla logiki gry
        update(time, deltaTime) {
            
            if (!this.isDead) {
                // *** KOD DLA ŻYWEGO ŻOŁNIERZA ***
                
                // Animacja: używa absolutnego czasu 'time'
                this.animator.update(time);
                
                // Billboarding (Zawsze patrzy na kamerę)
                if (this.camera) {
                    this.mesh.lookAt(this.camera.position);
                    this.mesh.rotation.x = 0; 
                    this.mesh.rotation.z = 0;
                }
                
                // Logika ataku: używa rzeczywistego 'deltaTime'
                if (!this.isAttacking) {
                    this.attackTimer += deltaTime; 
                    if (this.attackTimer > this.attackInterval) {
                        this.animator.setSequence('attack', false); 
                        this.isAttacking = true; 
                        this.attackTimer = 0;
                    }
                } else if (this.animator.currentSequenceName === 'idle') {
                    this.animator.setSequence('walk-front', true);
                    this.isAttacking = false;
                    this.attackInterval = 5000 + Math.random() * 3000;
                }

            } else {
                // *** KOD DLA MARTWEGO ŻOŁNIERZA ***
                
                // Utrzymujemy animację na ostatniej klatce (sekwencja śmierci, klatka 45)
                if (!this.animator.isFinished) {
                    this.animator.update(time); 
                } else {
                     this.isDeathSequenceDone = true;
                }
                
                // Billboarding (Zawsze patrzy na kamerę w osi Y)
                if (this.camera) {
                    this.mesh.lookAt(this.camera.position); 
                    
                    // Martwy Żołnierz jest obrócony o -90 stopni w osi X
                    this.mesh.rotation.x = -Math.PI / 2; 
                }
            }
        }
        
        addToScene(scene) {
            scene.add(this.mesh);
        }
    }


    // ==========================================
    // 4. SILNIK ŚWIATA (World & Main Loop)
    // ==========================================

    class World {
        constructor(THREE, containerId) {
            this.THREE = THREE;
            this.container = document.getElementById(containerId);
            this.entities = [];
            this.audioListener = null; 
            this.soundBuffers = {}; 
            
            this.cameraAngle = 0; 
            this.cameraRadius = 12; 
            this.yawSpeed = 0; 
            this.maxYawSpeed = 0.005; 
            this.acceleration = 0.000005; 
            this.friction = 0.95; 
            this.keys = {}; 

            this.initThree();
            this.addEnvironment();
            this.setupControls();
            
            TextureProcessor.loadAndProcess(this.THREE, SS_SOLDIER_CONFIG).then(texture => {
                this.baseTexture = texture;
                this.spawnInitialEntities(SS_SOLDIER_CONFIG, 12);
            }).catch(e => {
                console.error("Błąd ładowania tekstury bazowej żołnierza:", e);
            });
        }

        initThree() {
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;

            this.scene = new this.THREE.Scene();
            this.scene.fog = new this.THREE.FogExp2(0x111111, 0.04);

            this.camera = new this.THREE.PerspectiveCamera(60, w / h, 0.1, 100);
            this.camera.position.set(0, 5, this.cameraRadius); 
            this.camera.lookAt(0, 0, 0);

            this.renderer = new this.THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(w, h);
            this.renderer.setClearColor(0x111111);
            this.container.appendChild(this.renderer.domElement);

            window.addEventListener('resize', () => this.onResize());
        }
        
        setupControls() {
            const addBtn = document.getElementById('add-soldier');
            const killBtn = document.getElementById('kill-soldier');
            const audioBtn = document.getElementById('start-audio');
            const cameraHint = document.getElementById('camera-hint');

            audioBtn.addEventListener('click', () => {
                this.initAudioAndSpawn();
                audioBtn.style.display = 'none'; // Ukrycie przycisku startu audio
                addBtn.style.display = 'block';  // Pokazanie kontrolek
                killBtn.style.display = 'block';
                cameraHint.style.display = 'block';
            });
            
            addBtn.addEventListener('click', () => this.addRandomSoldier());
            killBtn.addEventListener('click', () => this.killRandomSoldier());
            
            // KONTROLA KAMERY KLAWIATURĄ
            window.addEventListener('keydown', (e) => {
                this.keys[e.key] = true;
            });

            window.addEventListener('keyup', (e) => {
                this.keys[e.key] = false;
            });
        }

        async initAudioAndSpawn() {
            if (this.audioListener === null) {
                this.audioListener = new this.THREE.AudioListener();
                this.camera.add(this.audioListener); 
                
                const manager = new SoundManager(this.THREE, this.audioListener, SS_SOLDIER_CONFIG);
                this.soundBuffers = await manager.loadSounds();
                
                // Upewniamy się, że jeśli jednostki nie zostały załadowane na początku, zostaną załadowane teraz
                if (this.entities.length === 0) {
                     this.spawnInitialEntities(SS_SOLDIER_CONFIG, 12);
                }
                
                this.startLoop();
            }
        }

        addEnvironment() {
            const gridHelper = new this.THREE.GridHelper(50, 50, 0x444444, 0x222222);
            this.scene.add(gridHelper);
            
            const planeGeo = new this.THREE.PlaneGeometry(50, 50);
            const planeMat = new this.THREE.MeshBasicMaterial({ color: 0x222222 });
            const plane = new this.THREE.Mesh(planeGeo, planeMat);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = -0.01;
            this.scene.add(plane);
        }

        spawnInitialEntities(config, count) {
            if (!this.baseTexture) return;
            
            // Usuwamy stare jednostki, jeśli istnieją, aby uniknąć duplikatów
            this.entities.forEach(entity => this.scene.remove(entity.mesh));
            this.entities = [];
            
            for (let i = 0; i < count; i++) {
                const x = (Math.random() - 0.5) * 15;
                const z = (Math.random() - 0.5) * 15 - 5; 

                const entity = new GameEntity(this.THREE, this.baseTexture, config, x, z, this.camera, this.soundBuffers);
                entity.addToScene(this.scene);
                this.entities.push(entity);
            }
            
            document.getElementById('count').innerText = this.entities.length;
        }
        
        addRandomSoldier() {
             if (!this.baseTexture) return;

            const x = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 15 - 5; 
            
            const entity = new GameEntity(this.THREE, this.baseTexture, SS_SOLDIER_CONFIG, x, z, this.camera, this.soundBuffers);
            entity.addToScene(this.scene);
            this.entities.push(entity);
            document.getElementById('count').innerText = this.entities.length;
        }
        
        killRandomSoldier() {
            const livingSoldiers = this.entities.filter(e => !e.isDead);
            
            if (livingSoldiers.length === 0) {
                // Używamy niestandardowego komunikatu w konsoli zamiast alert()
                console.log("Brak żywych żołnierzy do zestrzelenia."); 
                return;
            }
            
            const randomIndex = Math.floor(Math.random() * livingSoldiers.length);
            const soldierToKill = livingSoldiers[randomIndex];
            
            soldierToKill.die();
        }

        updateCameraMovement(deltaTime) {
            // Przyspieszenie
            if (this.keys['ArrowLeft']) {
                this.yawSpeed += this.acceleration * deltaTime;
            } else if (this.keys['ArrowRight']) {
                this.yawSpeed -= this.acceleration * deltaTime;
            }

            // Ograniczenie prędkości
            this.yawSpeed = Math.min(Math.max(this.yawSpeed, -this.maxYawSpeed), this.maxYawSpeed);

            // Tarcie/Hamowanie
            if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight']) {
                this.yawSpeed *= this.friction;
                if (Math.abs(this.yawSpeed) < 0.00001) {
                    this.yawSpeed = 0;
                }
            }

            // Aktualizacja kąta kamery
            this.cameraAngle += this.yawSpeed * deltaTime;

            // Ustawienie nowej pozycji kamery na okręgu
            this.camera.position.x = Math.sin(this.cameraAngle) * this.cameraRadius;
            this.camera.position.z = Math.cos(this.cameraAngle) * this.cameraRadius;
            
            // Kamera zawsze patrzy na środek (0, 1, 0)
            this.camera.lookAt(0, 1, 0);
        }

        startLoop() {
            let lastTime = 0;
            const animate = (time) => {
                requestAnimationFrame(animate);
                
                const deltaTime = time - lastTime;
                lastTime = time;

                // Aktualizacja ruchu kamery
                this.updateCameraMovement(deltaTime);
                
                // Aktualizacja jednostek - przekazujemy absolutny czas 'time' ORAZ różnicę 'deltaTime'
                this.entities.forEach(entity => entity.update(time, deltaTime));
                
                this.renderer.render(this.scene, this.camera);
            };
            animate(0);
        }

        onResize() {
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }
    }

    // ==========================================
    // 5. URUCHOMIENIE (Main)
    // ==========================================

    let gameWorld; 
    
    window.onload = function() {
        gameWorld = new World(THREE, 'canvas-container');
    }
