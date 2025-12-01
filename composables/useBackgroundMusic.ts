import { ref, onMounted, onUnmounted } from 'vue';

export const useBackgroundMusic = () => {
  const audio = ref<HTMLAudioElement | null>(null);
  const currentTrackIndex = ref(0);
  const isPlaying = ref(false);
  const audioFiles = ref<string[]>([]);

  const loadAudioFiles = async () => {
    try {
      // Dynamisk load af alle lydfiler fra /audio mappen
      const response = await fetch('/api/audio-files');
      if (response.ok) {
        audioFiles.value = await response.json();
      }
    } catch (error) {
      console.error('Kunne ikke indlæse lydfiler:', error);
    }
  };

  const playNextTrack = () => {
    if (audioFiles.value.length === 0) return;

    if (audio.value) {
      audio.value.pause();
      audio.value = null;
    }

    currentTrackIndex.value = (currentTrackIndex.value + 1) % audioFiles.value.length;
    playTrack(currentTrackIndex.value);
  };

  const playTrack = (index: number) => {
    if (index >= audioFiles.value.length) return;

    audio.value = new Audio(audioFiles.value[index]);
    audio.value.volume = 0.3; // 30% volume for baggrundsmusik

    audio.value.addEventListener('ended', playNextTrack);
    audio.value.addEventListener('error', (e) => {
      console.error('Fejl ved afspilning af:', audioFiles.value[index], e);
      playNextTrack();
    });

    audio.value.play().catch((error) => {
      console.error('Kunne ikke afspille:', error);
    });

    isPlaying.value = true;
  };

  const start = async () => {
    await loadAudioFiles();
    if (audioFiles.value.length > 0) {
      playTrack(0);
    }
  };

  const stop = () => {
    if (audio.value) {
      audio.value.pause();
      audio.value = null;
    }
    isPlaying.value = false;
  };

  const toggle = () => {
    if (isPlaying.value) {
      stop();
    } else {
      if (audio.value) {
        audio.value.play();
        isPlaying.value = true;
      } else {
        start();
      }
    }
  };

  onUnmounted(() => {
    stop();
  });

  return {
    start,
    stop,
    toggle,
    isPlaying
  };
};
