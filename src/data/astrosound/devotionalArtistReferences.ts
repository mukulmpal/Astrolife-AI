export type DevotionalArtistCategory =
  | "sufi_qawwali"
  | "bhajan_devotional"
  | "ghazal"
  | "classical_bandish"
  | "modern_fusion"
  | "regional_devotional";

export type DevotionalArtistSeed = {
  artist: string;
  categories: DevotionalArtistCategory[];
  priority: "very_high" | "high" | "medium" | "low";
  searchFocus: string[];
};

export const devotionalArtistSeeds: DevotionalArtistSeed[] = [
  {
    artist: "Nusrat Fateh Ali Khan",
    categories: ["sufi_qawwali"],
    priority: "very_high",
    searchFocus: [
      "Nusrat Fateh Ali Khan Raga Bilawal",
      "Nusrat Fateh Ali Khan Mishra Kafi",
      "Nusrat Fateh Ali Khan classical qawwali raga",
    ],
  },
  {
    artist: "Sabri Brothers",
    categories: ["sufi_qawwali"],
    priority: "very_high",
    searchFocus: [
      "Sabri Brothers qawwali raag",
      "Sabri Brothers Tajdar e Haram raag",
      "Sabri Brothers Mann Kunto Maula raag",
    ],
  },
  {
    artist: "Abida Parveen",
    categories: ["sufi_qawwali", "regional_devotional"],
    priority: "very_high",
    searchFocus: [
      "Abida Parveen Sur Kalyan",
      "Abida Parveen Sur Yemen Kalyan",
      "Abida Parveen Raag Aman Kalyan",
      "Abida Parveen Shah Jo Raag",
    ],
  },
  {
    artist: "Rahat Fateh Ali Khan",
    categories: ["sufi_qawwali", "modern_fusion"],
    priority: "high",
    searchFocus: [
      "Rahat Fateh Ali Khan qawwali raag",
      "Rahat Fateh Ali Khan Fusion in Raag",
      "Rahat Fateh Ali Khan devotional qawwali",
    ],
  },
  {
    artist: "Anup Jalota",
    categories: ["bhajan_devotional"],
    priority: "high",
    searchFocus: [
      "Anup Jalota Raag Yaman",
      "Anup Jalota Raag Bhairavi",
      "Anup Jalota Raag Desh",
      "Anup Jalota Krishna bhajan raag",
    ],
  },
  {
    artist: "Jagjit Singh",
    categories: ["bhajan_devotional", "ghazal", "classical_bandish"],
    priority: "high",
    searchFocus: [
      "Jagjit Singh Raga Darbari",
      "Jagjit Singh Raag Lalit",
      "Jagjit Singh Krishna Bhajans raag",
    ],
  },
  {
    artist: "Pandit Jasraj",
    categories: ["classical_bandish", "bhajan_devotional"],
    priority: "very_high",
    searchFocus: [
      "Pandit Jasraj Raag Marwa",
      "Pandit Jasraj Raag Des",
      "Pandit Jasraj Raag Puriya Kalyan",
      "Pandit Jasraj Raag Bihag",
      "Pandit Jasraj bhajan raag",
    ],
  },
  {
    artist: "Anuradha Paudwal",
    categories: ["bhajan_devotional"],
    priority: "high",
    searchFocus: [
      "Anuradha Paudwal bhajan raag",
      "Anuradha Paudwal Durga bhajan raag",
      "Anuradha Paudwal Shiv bhajan raag",
    ],
  },
  {
    artist: "Lata Mangeshkar",
    categories: ["film_bollywood", "bhajan_devotional"] as DevotionalArtistCategory[],
    priority: "very_high",
    searchFocus: [
      "Lata Mangeshkar bhajan raag",
      "Lata Mangeshkar classical film songs raag",
      "Lata Mangeshkar Meera bhajan raag",
    ],
  },
  {
    artist: "Sonu Nigam",
    categories: ["bhajan_devotional", "modern_fusion"],
    priority: "medium",
    searchFocus: [
      "Sonu Nigam bhajan raag",
      "Sonu Nigam devotional songs classical raag",
    ],
  },
  {
    artist: "Jubin Nautiyal",
    categories: ["bhajan_devotional", "modern_fusion"],
    priority: "medium",
    searchFocus: [
      "Jubin Nautiyal bhajan raag",
      "Jubin Nautiyal devotional songs raag",
    ],
  },
  {
    artist: "Arijit Singh",
    categories: ["film_bollywood", "bhajan_devotional", "modern_fusion"] as DevotionalArtistCategory[],
    priority: "medium",
    searchFocus: [
      "Arijit Singh devotional song raag",
      "Arijit Singh classical based song raag",
    ],
  },
  {
    artist: "Kumar Vishu",
    categories: ["bhajan_devotional"],
    priority: "medium",
    searchFocus: [
      "Kumar Vishu Sai Ram Sai Shyam raag",
      "Kumar Vishu bhajan raag",
    ],
  },
  {
    artist: "Prakash Mali",
    categories: ["regional_devotional"],
    priority: "medium",
    searchFocus: [
      "Prakash Mali bhajan raag",
      "Prakash Mali Rajasthani bhajan raag",
    ],
  },
  {
    artist: "Lakhbir Singh Lakkha",
    categories: ["bhajan_devotional"],
    priority: "medium",
    searchFocus: [
      "Lakhbir Singh Lakkha bhajan raag",
      "Lakhbir Singh Lakkha Devi bhajan raag",
      "Lakhbir Singh Lakkha Shyam bhajan raag",
    ],
  },
];
