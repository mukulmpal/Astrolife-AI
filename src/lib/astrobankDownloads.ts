import fs from 'fs/promises';
import path from 'path';

/**
 * Reads the AstroBank JSON file from the Downloads folder "astro-data-bank-main".
 * Expected location: ~/Downloads/astro-data-bank-main/astroBank.json
 */
export async function fetchDownloadsAstroBank() {
  const downloadsFolder = path.join(
    process.env.HOME ?? '/Users/mukulpal',
    'Downloads',
    'astro-data-bank-main'
  );
  const filePath = path.join(downloadsFolder, 'astroBank.json');
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read AstroBank from Downloads folder:', err);
    throw err;
  }
}
