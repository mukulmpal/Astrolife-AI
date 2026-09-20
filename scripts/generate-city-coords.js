const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../data/geonames/cities5000.txt');
const outputPath = path.join(__dirname, '../src/lib/astro-engine/all-cities.ts');

const data = fs.readFileSync(inputPath, 'utf-8');
const lines = data.split('\n');

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

function getOffset(timeZone) {
    try {
        if (!timeZone) return 0;
        const date = new Date('2024-01-01T12:00:00Z');
        const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' }).formatToParts(date);
        const tzPart = parts.find(p => p.type === 'timeZoneName')?.value;
        if (!tzPart) return 0;
        const match = tzPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
        if (!match) return 0;
        const sign = match[1] === '-' ? -1 : 1;
        const hours = parseInt(match[2] || '0', 10);
        const minutes = parseInt(match[3] || '0', 10);
        return sign * (hours + minutes / 60);
    } catch {
        return 0;
    }
}

let result = 'export const ALL_CITY_COORDS: Record<string, { lat: number; lon: number; tz: number }> = {\n';

let added = 0;
const seen = new Set();

for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    const name = parts[1] || parts[2]; 
    if (!name) continue;
    
    const lat = parseFloat(parts[4]);
    const lon = parseFloat(parts[5]);
    const countryCode = parts[8];
    const timezone = parts[17];
    
    let countryName = countryCode;
    try {
        if (countryCode) {
            countryName = regionNames.of(countryCode) || countryCode;
        }
    } catch (e) {}

    const key = `${name}, ${countryName}`;
    if (!seen.has(key)) {
        seen.add(key);
        const tzOffset = getOffset(timezone);
        result += `  ${JSON.stringify(key)}: { lat: ${lat}, lon: ${lon}, tz: ${tzOffset} },\n`;
        added++;
    }
}

result += '};\n';
fs.writeFileSync(outputPath, result, 'utf-8');
console.log(`Generated all-cities.ts with ${added} cities.`);
