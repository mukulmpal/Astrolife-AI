// Ambient types for the pure-JS Moshier "ephemeris" package (no bundled types).
// We only use getAllPlanets(date, lon, lat, height) → geocentric apparent positions.
declare module "ephemeris" {
  interface ObservedBody {
    name: string;
    apparentLongitudeDd: number;
    geocentricDistanceKm?: number;
    is_retrograde?: boolean;
  }
  interface AllPlanetsResult {
    observed: Record<string, ObservedBody>;
  }
  const ephemeris: {
    getAllPlanets(
      date: Date,
      longitude: number,
      latitude: number,
      height: number,
    ): AllPlanetsResult;
  };
  export default ephemeris;
}
