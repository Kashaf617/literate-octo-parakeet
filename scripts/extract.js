const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\kjh\\.gemini\\antigravity\\brain\\96350ff2-33d3-4304-9d8a-69478abea486\\.system_generated\\steps\\225\\content.md', 'utf8');

const regex = /https?:\/\/[^\s\"'>\(\)\\]+/gi;
const matches = content.match(regex) || [];
const images = Array.from(new Set(matches)).filter(m => m.includes('cdn/shop') && (m.includes('.png') || m.includes('.jpg') || m.includes('.webp') || m.includes('.jpeg')));
console.log(JSON.stringify(images, null, 2));
