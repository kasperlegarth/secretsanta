<template>
  <div class="min-h-screen christmas-bg relative overflow-hidden">
    <!-- Dekorationer i baggrunden -->
    <div class="decorations">
      <!-- Juletræ øverst til højre -->
      <div class="decoration tree top-right">🎄</div>

      <!-- Misteltå øverst til venstre -->
      <div class="decoration holly top-left">🎄</div>

      <!-- Gave nederst til venstre -->
      <div class="decoration gift bottom-left">🎁</div>
    </div>

    <!-- Faldende sne -->
    <canvas ref="snowCanvas" class="snow-canvas"></canvas>

    <!-- Sne kontrol panel -->
    <div class="snow-controls">
      <button @click="showControls = !showControls" class="controls-toggle">
        ⚙️
      </button>
      <div v-if="showControls" class="controls-panel">
        <h3>Indstillinger</h3>
        <div class="control-group">
          <label>Antal snefnug: {{ snowflakeCount }}</label>
          <input type="range" v-model.number="snowflakeCount" min="50" max="500" step="10" />
        </div>
        <div class="control-group">
          <label>Hastighed: {{ snowSpeed.toFixed(1) }}x</label>
          <input type="range" v-model.number="snowSpeed" min="0.5" max="5" step="0.1" />
        </div>
        <div class="control-group">
          <label>Akkumulerings hastighed: {{ accumSpeed.toFixed(1) }}x</label>
          <input type="range" v-model.number="accumSpeed" min="0.5" max="100" step="0.5" />
        </div>
        <div class="control-group">
          <button @click="resetSnow" class="reset-btn">Nulstil sne</button>
        </div>
        <button @click="toggleMusic" class="music-btn">
          {{ isMusicPlaying ? '🔊 Musik til' : '🔇 Musik fra' }}
        </button>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10">
      <header class="text-center -mb-12">
        <div class="flex items-center justify-center gap-4 mb-4">
          <img src="/assets/images/julemand.png" alt="Julemand" class="w-[200px] -me-28 object-contain" />
          <svg
            width="360"
            height="140"
            viewBox="60 20 390 240"
            xmlns="http://www.w3.org/2000/svg"
            class="logo-svg"
          >
            <defs>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- Tekst-gruppe -->
            <g
              font-family="'Cooper Black', 'Chewy', system-ui, sans-serif"
              font-weight="700"
              text-anchor="middle"
            >
              <!-- Sort outline -->
              <text x="256" y="100" font-size="120" fill="none" stroke="#432922" stroke-width="8" stroke-linejoin="round">
                Secret
              </text>
              <text x="256" y="220" font-size="120" fill="none" stroke="#432922" stroke-width="8" stroke-linejoin="round">
                Santa
              </text>
              <!-- Hvid fyld -->
              <text x="256" y="100" font-size="120" fill="#ffffff">
                Secret
              </text>
              <text x="256" y="220" font-size="120" fill="#ffffff">
                Santa
              </text>
            </g>
          </svg>
        </div>
      </header>

      <main class="max-w-2xl mx-auto">
        <EmailForm />

        <!-- Audio player -->
        <div class="mt-8">
          <audio
            ref="audioPlayer"
            controls
            autoplay
            class="w-full rounded-2xl"
            style="filter: sepia(20%) saturate(70%) hue-rotate(-10deg);"
          >
            <source v-if="currentTrack" :src="currentTrack" type="audio/mpeg">
            Din browser understøtter ikke audio elementet.
          </audio>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const snowCanvas = ref<HTMLCanvasElement | null>(null);
const showControls = ref(false);
const snowflakeCount = ref(150);
const snowSpeed = ref(1);
const accumSpeed = ref(50);

// Audio player
const audioPlayer = ref<HTMLAudioElement | null>(null);
const currentTrack = ref<string>('');
const audioFiles = ref<string[]>([]);
const currentTrackIndex = ref(0);
const isMusicPlaying = ref(false);

const loadAudioFiles = async () => {
  try {
    const response = await fetch('/api/audio-files');
    if (response.ok) {
      audioFiles.value = await response.json();
      if (audioFiles.value.length > 0) {
        currentTrack.value = audioFiles.value[0];
      }
    }
  } catch (error) {
    console.error('Kunne ikke indlæse lydfiler:', error);
  }
};

const playNextTrack = () => {
  if (audioFiles.value.length === 0) return;
  currentTrackIndex.value = (currentTrackIndex.value + 1) % audioFiles.value.length;
  currentTrack.value = audioFiles.value[currentTrackIndex.value];

  // Wait for source to update, then play
  setTimeout(() => {
    if (audioPlayer.value) {
      audioPlayer.value.load();
      audioPlayer.value.play().catch(err => console.error('Afspilningsfejl:', err));
    }
  }, 100);
};

const toggleMusic = () => {
  if (!audioPlayer.value) return;

  if (audioPlayer.value.paused) {
    audioPlayer.value.play();
    isMusicPlaying.value = true;
  } else {
    audioPlayer.value.pause();
    isMusicPlaying.value = false;
  }
};

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

let snowHeight: number[] = [];
let snowflakes: Snowflake[] = [];
let animationId: number;

const resetSnow = () => {
  const canvas = snowCanvas.value;
  if (!canvas) return;
  snowHeight = new Array(canvas.width).fill(0);
};

const createSnowflakes = (count: number, canvasWidth: number, canvasHeight: number) => {
  const flakes: Snowflake[] = [];
  for (let i = 0; i < count; i++) {
    flakes.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight - canvasHeight,
      radius: Math.random() * 2 + 2,
      speedY: Math.random() * 1 + 0.5,
      speedX: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.5
    });
  }
  return flakes;
};

onMounted(() => {
  // Load audio files
  loadAudioFiles();

  // Setup audio player event listeners
  if (audioPlayer.value) {
    // Set default volume to 30%
    audioPlayer.value.volume = 0.3;

    audioPlayer.value.addEventListener('ended', playNextTrack);
    audioPlayer.value.addEventListener('play', () => {
      isMusicPlaying.value = true;
    });
    audioPlayer.value.addEventListener('pause', () => {
      isMusicPlaying.value = false;
    });
  }

  const canvas = snowCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    snowHeight = new Array(canvas.width).fill(0);
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Snow accumulation data - height of snow at each x position
  snowHeight = new Array(canvas.width).fill(0);
  const maxSnowHeight = canvas.height * 0.5; // Snow can fill up to 50% of screen

  // Create snowflakes
  snowflakes = createSnowflakes(snowflakeCount.value, canvas.width, canvas.height);

  // Watch for snowflake count changes
  watch(snowflakeCount, (newCount) => {
    const diff = newCount - snowflakes.length;
    if (diff > 0) {
      // Add more snowflakes
      for (let i = 0; i < diff; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          radius: Math.random() * 2 + 2,
          speedY: Math.random() * 1 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.5
        });
      }
    } else if (diff < 0) {
      // Remove snowflakes
      snowflakes.splice(newCount);
    }
  });

  const smoothSnow = () => {
    // Apply physics: snow spreads and settles naturally
    const newSnowHeight = [...snowHeight];

    // Multiple passes for better smoothing
    for (let pass = 0; pass < 2; pass++) {
      for (let x = 2; x < canvas.width - 2; x++) {
        if (snowHeight[x] > 0) {
          // Check wider range of neighbors
          const leftDiff = snowHeight[x] - snowHeight[x - 1];
          const rightDiff = snowHeight[x] - snowHeight[x + 1];
          const leftDiff2 = snowHeight[x] - snowHeight[x - 2];
          const rightDiff2 = snowHeight[x] - snowHeight[x + 2];

          // If snow is higher than neighbors, spread it
          if (leftDiff > 2) {
            const transfer = Math.min(leftDiff * 0.15, 1.5);
            newSnowHeight[x] -= transfer;
            newSnowHeight[x - 1] += transfer;
          }
          if (rightDiff > 2) {
            const transfer = Math.min(rightDiff * 0.15, 1.5);
            newSnowHeight[x] -= transfer;
            newSnowHeight[x + 1] += transfer;
          }

          // Smooth peaks with wider neighbors
          if (leftDiff2 > 4) {
            const transfer = Math.min(leftDiff2 * 0.08, 0.8);
            newSnowHeight[x] -= transfer;
            newSnowHeight[x - 2] += transfer;
          }
          if (rightDiff2 > 4) {
            const transfer = Math.min(rightDiff2 * 0.08, 0.8);
            newSnowHeight[x] -= transfer;
            newSnowHeight[x + 2] += transfer;
          }
        }
      }
    }

    // Additional smoothing pass with averaging
    for (let x = 2; x < canvas.width - 2; x++) {
      const avg = (
        newSnowHeight[x - 2] * 0.1 +
        newSnowHeight[x - 1] * 0.2 +
        newSnowHeight[x] * 0.4 +
        newSnowHeight[x + 1] * 0.2 +
        newSnowHeight[x + 2] * 0.1
      );
      newSnowHeight[x] = newSnowHeight[x] * 0.7 + avg * 0.3;
    }

    snowHeight = newSnowHeight;
  };

  let frameCount = 0;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply snow physics every few frames
    frameCount++;
    if (frameCount % 3 === 0) {
      smoothSnow();
    }

    // Draw accumulated snow with smooth bezier curve
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    // First point
    ctx.lineTo(0, canvas.height - snowHeight[0]);

    // Use quadratic bezier curves for ultra-smooth rendering
    for (let x = 1; x < canvas.width - 1; x += 1) {
      const y0 = canvas.height - snowHeight[Math.max(0, x - 1)];
      const y1 = canvas.height - snowHeight[x];
      const y2 = canvas.height - snowHeight[Math.min(canvas.width - 1, x + 1)];

      // Average with wider range for smoother peaks
      const smoothY = (y0 * 0.25 + y1 * 0.5 + y2 * 0.25);

      // Use quadratic curve to previous point
      if (x > 1) {
        const prevY = canvas.height - snowHeight[x - 1];
        const cpx = x - 0.5;
        const cpy = (prevY + smoothY) / 2;
        ctx.quadraticCurveTo(cpx, cpy, x, smoothY);
      } else {
        ctx.lineTo(x, smoothY);
      }
    }

    // Last point
    ctx.lineTo(canvas.width, canvas.height - snowHeight[canvas.width - 1]);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Add subtle shadow/gradient to snow
    const gradient = ctx.createLinearGradient(0, canvas.height - 50, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(220, 230, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height - snowHeight[x];
      ctx.lineTo(x, y);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Update and draw falling snowflakes
    snowflakes.forEach((flake) => {
      // Add slight horizontal sway
      flake.x += Math.sin(flake.y / 30) * 0.5 + flake.speedX;
      flake.y += flake.speedY * snowSpeed.value;

      // Check if snowflake should accumulate
      const flakeBottom = flake.y + flake.radius;
      const x = Math.floor(flake.x);

      if (x >= 0 && x < canvas.width) {
        const groundLevel = canvas.height - snowHeight[x];

        if (flakeBottom >= groundLevel && snowHeight[x] < maxSnowHeight) {
          // Find nearby lower point for more natural accumulation
          let targetX = x;
          const searchRange = 3;
          let lowestHeight = snowHeight[x];

          for (let dx = -searchRange; dx <= searchRange; dx++) {
            const checkX = x + dx;
            if (checkX >= 0 && checkX < canvas.width && snowHeight[checkX] < lowestHeight) {
              lowestHeight = snowHeight[checkX];
              targetX = checkX;
            }
          }

          // Accumulate snow at the lower point
          const accumAmount = 0.3 * accumSpeed.value;
          snowHeight[targetX] += accumAmount;

          // Spread to immediate neighbors
          if (targetX > 0) snowHeight[targetX - 1] += accumAmount * 0.4;
          if (targetX < canvas.width - 1) snowHeight[targetX + 1] += accumAmount * 0.4;

          // Reset snowflake to top
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }
      }

      // Wrap around horizontally
      if (flake.x > canvas.width) flake.x = 0;
      if (flake.x < 0) flake.x = canvas.width;

      // Reset if too far down
      if (flake.y > canvas.height + 10) {
        flake.y = -10;
        flake.x = Math.random() * canvas.width;
      }

      // Draw snowflake
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  };

  animate();

  // Cleanup
  onUnmounted(() => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resizeCanvas);
  });
});
</script>

<style scoped>
.christmas-bg {
  background: linear-gradient(135deg, #c85a54 0%, #b94a44 100%);
  background-attachment: fixed;
}

/* Dekorationer */
.decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.decoration {
  position: absolute;
  font-size: 4rem;
  opacity: 0.6;
}

.decoration.tree {
  font-size: 5rem;
}

.decoration.gift {
  font-size: 4.5rem;
}

.top-right {
  top: 5%;
  right: 8%;
}

.top-left {
  top: 5%;
  left: 8%;
}

.bottom-left {
  bottom: 8%;
  left: 8%;
}

/* Sne canvas */
.snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

/* Sne kontrol panel */
.snow-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
}

.controls-toggle {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.controls-toggle:hover {
  transform: scale(1.1);
}

.controls-panel {
  position: absolute;
  top: 60px;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.controls-panel h3 {
  margin: 0 0 16px 0;
  color: #2d5016;
  font-size: 18px;
  font-weight: bold;
}

.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  color: #2d5016;
  font-weight: 600;
  font-size: 14px;
}

.control-group input[type="range"] {
  width: 100%;
  cursor: pointer;
}

.music-btn {
  width: 100%;
  padding: 10px;
  background: #2d5016;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 16px;
}

.music-btn:hover {
  background: #1a3009;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background: #c85a54;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.reset-btn:hover {
  background: #b94a44;
}

/* Responsivt design */
@media (max-width: 768px) {
  .decoration {
    font-size: 3rem;
  }

  .decoration.tree {
    font-size: 3.5rem;
  }

  .decoration.gift {
    font-size: 3rem;
  }
}
</style>
