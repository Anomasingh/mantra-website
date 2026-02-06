import { validateLyricsAlignment } from './src/utils/lyricsValidator.js';

// Test the specific example from the user
const original = [
  'भिक्षां देहि कृपावलम्बनकरी मातान्नपूर्णेश्वरी ॥१०॥'
];

const transliteration = [
  'ভিক্ষা দেবী দয়াআশ্রয়কারি মাতান্নপূর্ণেশ্বরী'
];

const result = validateLyricsAlignment(original, transliteration);

console.log('\n🧪 Testing Word Count with Verse Markers:\n');
console.log('Original (Hindi):', original[0]);
console.log('Word count:', result.lines[0].originalWordCount, 'words');
console.log('(॥१०॥ is excluded)\n');

console.log('Transliteration (Bengali):', transliteration[0]);
console.log('Word count:', result.lines[0].transliterationWordCount, 'words\n');

console.log('Match:', result.lines[0].isMismatch ? '❌ Mismatch' : '✅ Match');
console.log('Difference:', result.lines[0].displayValue);
console.log('\nValidation:', result.isValid ? '✅ VALID' : '❌ INVALID');
