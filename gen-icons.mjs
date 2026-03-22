import { writeFileSync } from 'fs';

function makeSvg(size) {
  const r = size * 0.2;
  const cx = size * 0.5;
  const cy = size * 0.38;
  const cr = size * 0.18;
  const sw = size * 0.06;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#0f172a"/>
  <circle cx="${cx}" cy="${cy}" r="${cr}" fill="none" stroke="#10b981" stroke-width="${sw}"/>
  <line x1="${cx}" y1="${size*0.56}" x2="${cx}" y2="${size*0.75}" stroke="#10b981" stroke-width="${sw}" stroke-linecap="round"/>
  <line x1="${size*0.32}" y1="${size*0.65}" x2="${size*0.68}" y2="${size*0.65}" stroke="#10b981" stroke-width="${sw}" stroke-linecap="round"/>
  <line x1="${size*0.38}" y1="${size*0.75}" x2="${size*0.32}" y2="${size*0.88}" stroke="#10b981" stroke-width="${sw}" stroke-linecap="round"/>
  <line x1="${size*0.62}" y1="${size*0.75}" x2="${size*0.68}" y2="${size*0.88}" stroke="#10b981" stroke-width="${sw}" stroke-linecap="round"/>
</svg>`;
}

writeFileSync('public/icon-192.svg', makeSvg(192));
writeFileSync('public/icon-512.svg', makeSvg(512));
// Also write as .png filename but SVG content — browsers accept SVG for manifest icons
writeFileSync('public/icon-192.png', makeSvg(192));
writeFileSync('public/icon-512.png', makeSvg(512));
writeFileSync('public/apple-touch-icon.png', makeSvg(180));
console.log('Icons generated.');
