import fs from 'fs/promises';
import path from 'path';

/**
 * Recursively reads the Astro Data Bank repository located in the user's Downloads folder.
 * Expected path: ~/Downloads/astro-data-bank-main/data/celebrities/
 * It walks through all country/category sub‑folders, loads each `*.json` file (excluding the
 * `*.astro.json` side‑car files), and returns a flat array of objects compatible with the
 * AstroBank UI (`name`, `category`, `birthDate`, `birthTime`, `birthPlace`, `latitude`,
 * `longitude`, `tz`).
 */
export async function fetchRepoAstroBank() {
  const baseDir = path.join(
    process.env.HOME ?? '/Users/mukulpal',
    'Downloads',
    'astro-data-bank-main',
    'data',
    'celebrities'
  );

  const results: any[] = [];

  async function walk(dir: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (err) {
      console.error('Failed to read directory', dir, err);
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.json') &&
        !entry.name.includes('.astro.json')
      ) {
        try {
          const raw = await fs.readFile(fullPath, 'utf8');
          const data = JSON.parse(raw);
          // Derive category from the folder name that directly contains the file
          const parts = fullPath.split(path.sep);
          const category = parts[parts.length - 2]; // e.g., "film_actor" or "politician"
          // Ensure required fields exist; if the source uses different keys, map them.
          const entryObj = {
            name: data.name,
            category: category,
            birthDate: data.dateOfBirth || data.birthDate,
            birthTime: data.birthTime || '12:00:00',
            birthPlace: data.birthPlace || data.location || 'Unknown',
            latitude: data.birthCoordinates?.latitude ?? data.latitude ?? null,
            longitude: data.birthCoordinates?.longitude ?? data.longitude ?? null,
            tz: data.tz ?? data.timezone ?? null,
          };
          results.push(entryObj);
        } catch (e) {
          console.error('Failed to parse JSON file', fullPath, e);
        }
      }
    }
  }

  await walk(baseDir);
  return results;
}
