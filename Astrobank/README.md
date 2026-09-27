# Astro Data Bank 🌌

A collaborative, open-source repository for celebrity birth data and astronomical profiles. This project aims to provide high-quality, verified astrological data for researchers and enthusiasts.

## 📁 Repository Structure

The data is organized by country and occupation/category for easy navigation:

```text
data/
└── celebrities/
    ├── {country}/         # e.g., india, nepal, usa
    │   └── {category}/    # e.g., film_actor, politician, scientist
    │       ├── {slug}.{qid}.json          # Main profile data (Wikipedia + Wikidata)
    │       └── {slug}.{qid}.astro.json    # Calculated astronomical data (side-car)
```

## 📄 Data Schema

### Main Profile (`.json`)
Contains metadata sourced from Wikipedia and Wikidata:
- `name`: Full name.
- `wikipediaSlug`: The identifier used in Wikipedia URLs.
- `qid`: Wikidata Item ID.
- `dateOfBirth`: ISO format (YYYY-MM-DD).
- `birthTime`: 24-hour format (HH:MM:SS) if known, otherwise set to 12:00:00.
- `birthCoordinates`: Latitude and Longitude of the birth place.
- `profileSummary`: Brief biography.

### Astro Data (`.astro.json`)
Contains calculated planetary positions and divisional charts:
- `planets`: Array of planet degrees and zodiac signs (Rasi).
- `lagna`: Ascendant details.
- `divisionalCharts`: Computed Varga charts (D9, D10, etc.).

## 🤝 How to Contribute

We welcome contributions! You can help by:
1. **Adding New Celebrities**: Fork the repo, add new JSON files following the structure, and submit a PR.
2. **Correcting Data**: If you find an error in birth time or coordinates, please submit a correction.
3. **Verification**: Mark data as verified if you have a reliable source.

## 🛠 Automation

This repository is primarily populated and maintained by the scripts in the [AstroFusion](https://github.com/astro-fusion/astrofusion-nextjs) project.

- `crawl-celebrities.ts`: Fetches metadata from Wikipedia/Wikidata.
- `calculate-celebrity-astronomy.ts`: Generates the `.astro.json` side-car files.
- `seed-celebrity-data.ts`: Syncs this data into the main AstroFusion database.

## ⚖️ License

MIT License. Feel free to use this data for your own projects!
