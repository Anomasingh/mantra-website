import { validateLyricsAlignment } from './src/utils/lyricsValidator.js';

// Test with Kannada verse markers
const original = [
  'ಅಯಿ ಗಿರಿನಂದಿನಿ ನಂದಿತಮೇದಿನಿ ವಿಶ್ವವಿನೋದಿನಿ ಪರಮೆಶ್ವರಿ ॥೧॥'
];

const transliteration = [
  'Ayi Girinandini Nanditamedini Vishvavinodini Parameshvari'
];

const result = validateLyricsAlignment(original, transliteration);

console.log('\n🧪 Testing Kannada Verse Markers:\n');
console.log('Original (Kannada):', original[0]);
console.log('Word count:', result.lines[0].originalWordCount, 'words');
console.log('(॥೧॥ is excluded)\n');

console.log('Transliteration:', transliteration[0]);
console.log('Word count:', result.lines[0].transliterationWordCount, 'words\n');

console.log('Match:', result.lines[0].isMismatch ? '❌ Mismatch' : '✅ Match');
console.log('Difference:', result.lines[0].displayValue);
console.log('\nValidation:', result.isValid ? '✅ VALID' : '❌ INVALID');
