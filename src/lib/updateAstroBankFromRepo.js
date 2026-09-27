const fs = require('fs').promises;
const path = require('path');

/**
 * Recursively reads the Astro Data Bank repository located in the user's Downloads folder.
 * Expected path: ~/Downloads/astro-data-bank-main/data/celebrities/
 * Returns a flat array of objects compatible with AstroBank UI:
 *   { name, country, category, birthDate, birthTime, birthPlace, latitude, longitude, tz }
 */
async function fetchRepoAstroBank() {
  const baseDir = path.join(
    process.env.HOME || '/Users/mukulpal',
    'Downloads',
    'astro-data-bank-main',
    'data',
    'celebrities'
  );

  const results = [];

  async function walk(dir) {
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
          const parts = fullPath.split(path.sep);
          const country = parts[parts.length - 3]; // e.g., "india"
          const category = parts[parts.length - 2]; // e.g., "film_actor" or "politician"
          const entryObj = {
            name: data.name,
            country: country,
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

async function updateAstroBank() {
  try {
    const entries = await fetchRepoAstroBank();
    const targetPath = path.join(process.cwd(), 'src', 'data', 'astroBank.json');
    await fs.writeFile(targetPath, JSON.stringify(entries, null, 2), 'utf8');
    console.info(`✅ AstroBank data updated with ${entries.length} entries at ${targetPath}`);
  } catch (err) {
    console.error('Failed to update AstroBank:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  updateAstroBank();
}
