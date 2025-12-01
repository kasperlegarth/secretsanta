import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFile = join(__dirname, 'assets', 'images', 'julemand.png');
const outputDir = join(__dirname, 'public');

async function generateFavicons() {
  try {
    // Favicon 16x16
    await sharp(inputFile)
      .resize(16, 16)
      .toFile(join(outputDir, 'favicon-16x16.png'));
    console.log('✓ Created favicon-16x16.png');

    // Favicon 32x32
    await sharp(inputFile)
      .resize(32, 32)
      .toFile(join(outputDir, 'favicon-32x32.png'));
    console.log('✓ Created favicon-32x32.png');

    // Favicon 48x48 (for ICO)
    await sharp(inputFile)
      .resize(48, 48)
      .toFile(join(outputDir, 'favicon-48x48.png'));
    console.log('✓ Created favicon-48x48.png');

    // Apple Touch Icon 180x180
    await sharp(inputFile)
      .resize(180, 180)
      .toFile(join(outputDir, 'apple-touch-icon.png'));
    console.log('✓ Created apple-touch-icon.png');

    // Standard favicon.ico (32x32)
    await sharp(inputFile)
      .resize(32, 32)
      .toFile(join(outputDir, 'favicon.ico'));
    console.log('✓ Created favicon.ico');

    console.log('\nAll favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
