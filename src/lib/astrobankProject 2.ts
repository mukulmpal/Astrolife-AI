import fs from 'fs/promises';
import path from 'path';

/**
 * Reads AstroBank JSON placed inside the project folder.
 * Expected location: <project_root>/src/data/astro-data-bank-main/astroBank.json
 */
export async function fetchProjectAstroBank() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'astro-data-bank-main', 'astroBank.json');
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read AstroBank from project folder:', err);
    throw err;
  }
}
