import { readdir } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const audioDir = join(process.cwd(), 'public', 'audio');

    try {
      const files = await readdir(audioDir);

      // Filtrer kun lydfiler
      const audioFiles = files.filter(file => {
        const ext = file.toLowerCase();
        return ext.endsWith('.mp3') ||
               ext.endsWith('.wav') ||
               ext.endsWith('.ogg') ||
               ext.endsWith('.m4a');
      });

      // Returner stier til lydfilerne
      return audioFiles.map(file => `/audio/${file}`);
    } catch (err) {
      // Mappen eksisterer ikke eller er tom
      return [];
    }
  } catch (error) {
    console.error('Fejl ved læsning af lydfiler:', error);
    return [];
  }
});
