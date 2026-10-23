import fs from 'fs/promises';
import path from 'path';

/**
 * Reads the AstroBank JSON file that you placed on your Desktop inside a folder named "Astrobank".
 * The function returns the parsed JSON array of personalities.
 */
export async function fetchDesktopAstroBank() {
  const desktopFolder = path.join(process.env.HOME ?? '/Users/mukulpal', 'Desktop', 'Astrobank');
  const filePath = path.join(desktopFolder, 'astroBank.json');
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);
    return data;
  } catch (err) {
    console.error('Failed to read AstroBank from Desktop:', err);
    throw err;
  }
}
