import { fetchRepoAstroBank } from "@/lib/astrobankRepo";
import fs from "fs/promises";
import path from "path";

/**
 * Loads all celebrity JSON files from the Astro Data Bank repo (Downloads) and
 * overwrites the project's bundled AstroBank data file with the aggregated list.
 *
 * Usage (from project root):
 *   node -r ts-node/register src/lib/updateAstroBankFromRepo.ts
 */
async function updateAstroBank() {
  try {
    const entries = await fetchRepoAstroBank();
    const targetPath = path.join(process.cwd(), "src", "data", "astroBank.json");
    await fs.writeFile(targetPath, JSON.stringify(entries, null, 2), "utf8");
    console.info(`✅ AstroBank data updated with ${entries.length} entries at ${targetPath}`);
  } catch (err) {
    console.error("Failed to update AstroBank:", err);
    process.exit(1);
  }
}

// Execute when run directly
if (require.main === module) {
  updateAstroBank();
}
