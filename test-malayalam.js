import { validateLyricsAlignment } from './src/utils/lyricsValidator.js';

const original = [
  'योगीन्द्राणां च योगीन्द्र गुरूणां गुरवे नमः ॥१॥'
];

const transliteration = [
  'യോഗീന്ദ്രാണാം ച യോഗീന്ദ്ര ഗുരൂണാം ഗുരവേ നമഃ ॥൧॥'
];

const result = validateLyricsAlignment(original, transliteration);

console.log('\n🧪 Testing Malayalam Verse Markers:\n');
console.log('Original (Hindi):', original[0]);
console.log('Word count:', result.lines[0].originalWordCount, 'words');
console.log('(॥१॥ is excluded)\n');

console.log('Transliteration (Malayalam):', transliteration[0]);
console.log('Word count:', result.lines[0].transliterationWordCount, 'words');
console.log('(॥൧॥ is excluded)\n');

console.log('Match:', result.lines[0].isMismatch ? '❌ Mismatch' : '✅ Match');
console.log('Difference:', result.lines[0].displayValue);
console.log('\nValidation:', result.isValid ? '✅ VALID' : '❌ INVALID');
