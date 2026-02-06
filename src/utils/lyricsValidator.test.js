/**
 * Test Suite for Lyrics Validator
 * Run this file with: node src/utils/lyricsValidator.test.js
 */

import { validateLyricsAlignment, getMismatchedLines, formatValidationSummary } from './lyricsValidator.js';

// Test utilities
const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    return false;
  }
  console.log(`✓ PASSED: ${message}`);
  return true;
};

const runTest = (testName, testFn) => {
  console.log(`\n🧪 Testing: ${testName}`);
  console.log('─'.repeat(60));
  try {
    testFn();
  } catch (error) {
    console.error(`❌ Test failed with error: ${error.message}`);
  }
};

// Test 1: Perfect alignment
runTest('Perfect alignment - all arrays equal length and word counts', () => {
  const original = ['ॐ नमः शिवाय', 'हर हर महादेव'];
  const transliteration = ['Om Namah Shivaya', 'Har Har Mahadev'];
  const translation = ['I bow to Shiva', 'Hail the Lord'];
  
  const result = validateLyricsAlignment(original, transliteration, translation);
  
  assert(result.isValid === true, 'Should be valid');
  assert(result.summary.totalMismatches === 0, 'Should have 0 mismatches');
  assert(result.lineCount.originalVsTransliteration.difference === 0, 'Line counts should match');
  assert(result.lines[0].isMismatch === false, 'Line 0 should not be a mismatch');
  assert(result.lines[1].isMismatch === false, 'Line 1 should not be a mismatch');
});

// Test 2: Word count mismatch
runTest('Word count mismatch on one line', () => {
  const original = ['ॐ नमः शिवाय', 'हर हर महादेव श्री'];  // 4 words in line 1
  const transliteration = ['Om Namah Shivaya', 'Har Har Mahadev'];  // 3 words in line 1
  
  const result = validateLyricsAlignment(original, transliteration);
  
  assert(result.isValid === false, 'Should be invalid');
  assert(result.summary.totalMismatches === 1, 'Should have 1 mismatch');
  assert(result.lines[0].isMismatch === false, 'Line 0 should match');
  assert(result.lines[1].isMismatch === true, 'Line 1 should be a mismatch');
  assert(result.lines[1].originalWordCount === 4, 'Original line 1 should have 4 words');
  assert(result.lines[1].transliterationWordCount === 3, 'Transliteration line 1 should have 3 words');
  assert(result.lines[1].difference === 1, 'Difference should be +1');
  assert(result.lines[1].displayValue === '+1', 'Display value should be +1');
});

// Test 3: Line count mismatch - original longer
runTest('Line count mismatch - original has more lines', () => {
  const original = ['Line 1', 'Line 2', 'Line 3', 'Line 4'];
  const transliteration = ['Line 1', 'Line 2', 'Line 3'];
  
  const result = validateLyricsAlignment(original, transliteration);
  
  assert(result.isValid === false, 'Should be invalid');
  assert(result.lineCount.originalVsTransliteration.difference === 1, 'Difference should be +1');
  assert(result.lineCount.originalVsTransliteration.displayValue === '+1', 'Display should be +1');
  assert(result.lineCount.originalVsTransliteration.isMismatch === true, 'Should be marked as mismatch');
  assert(result.lines[3].status === 'TRANSLITERATION_MISSING', 'Line 3 should show transliteration missing');
  assert(result.lines[3].difference === 'LINE MISSING', 'Difference should be LINE MISSING');
  assert(result.summary.missingTransliterationLines === 1, 'Should have 1 missing transliteration line');
});

// Test 4: Line count mismatch - transliteration longer
runTest('Line count mismatch - transliteration has more lines', () => {
  const original = ['Line 1', 'Line 2'];
  const transliteration = ['Line 1', 'Line 2', 'Line 3'];
  
  const result = validateLyricsAlignment(original, transliteration);
  
  assert(result.isValid === false, 'Should be invalid');
  assert(result.lineCount.originalVsTransliteration.difference === -1, 'Difference should be -1');
  assert(result.lineCount.originalVsTransliteration.displayValue === '-1', 'Display should be -1');
  assert(result.lines[2].status === 'ORIGINAL_MISSING', 'Line 2 should show original missing');
  assert(result.lines[2].difference === 'LINE MISSING', 'Difference should be LINE MISSING');
  assert(result.summary.missingOriginalLines === 1, 'Should have 1 missing original line');
});

// Test 5: Empty strings should count as 0 words
runTest('Empty strings and whitespace handling', () => {
  const original = ['', '   ', 'word1 word2'];
  const transliteration = ['', '   ', 'word1 word2'];
  
  const result = validateLyricsAlignment(original, transliteration);
  
  assert(result.isValid === true, 'Should be valid');
  assert(result.lines[0].originalWordCount === 0, 'Empty string should have 0 words');
  assert(result.lines[1].originalWordCount === 0, 'Whitespace only should have 0 words');
  assert(result.lines[2].originalWordCount === 2, 'Normal line should have 2 words');
});

// Test 6: Multiple mismatches
runTest('Multiple word count mismatches', () => {
  const original = ['one two three', 'four five', 'six seven eight nine'];
  const transliteration = ['one two', 'four five six', 'seven eight'];
  
  const result = validateLyricsAlignment(original, transliteration);
  
  assert(result.isValid === false, 'Should be invalid');
  assert(result.summary.totalMismatches === 3, 'Should have 3 mismatches');
  assert(result.lines[0].difference === 1, 'Line 0 difference should be +1');
  assert(result.lines[1].difference === -1, 'Line 1 difference should be -1');
  assert(result.lines[2].difference === 2, 'Line 2 difference should be +2');
});

// Test 7: Language/script agnostic word counting
runTest('Multi-language word counting', () => {
  const original = ['नमस्ते भारत', 'السلام عليكم', '你好 世界', 'Привет мир'];
  const transliteration = ['Namaste Bharat', 'As-salamu alaykum', 'Nǐ hǎo shìjiè', 'Privet mir'];
  
  const result = validateLyricsAlignment(original, transliteration);
  
  assert(result.isValid === true, 'Should be valid');
  assert(result.lines[0].originalWordCount === 2, 'Devanagari should count 2 words');
  assert(result.lines[1].originalWordCount === 2, 'Arabic should count 2 words');
  assert(result.lines[2].originalWordCount === 2, 'Chinese should count 2 words');
  assert(result.lines[3].originalWordCount === 2, 'Cyrillic should count 2 words');
});

// Test 8: getMismatchedLines helper
runTest('getMismatchedLines helper function', () => {
  const original = ['one two', 'three four', 'five six seven'];
  const transliteration = ['one two', 'three', 'five six seven'];
  
  const result = validateLyricsAlignment(original, transliteration);
  const mismatched = getMismatchedLines(result);
  
  assert(mismatched.length === 1, 'Should have 1 mismatched line');
  assert(mismatched[0].lineIndex === 1, 'Mismatched line should be index 1');
});

// Test 9: Edge case - all arrays empty
runTest('Edge case - all arrays empty', () => {
  const result = validateLyricsAlignment([], [], []);
  
  assert(result.isValid === true, 'Empty arrays should be valid');
  assert(result.summary.totalLines === 0, 'Should have 0 total lines');
  assert(result.lines.length === 0, 'Should have no line validations');
});

// Test 10: Edge case - null/undefined inputs
runTest('Edge case - null/undefined inputs', () => {
  const result = validateLyricsAlignment(null, undefined, null);
  
  assert(result.isValid === true, 'Should handle null/undefined gracefully');
  assert(result.summary.totalLines === 0, 'Should have 0 total lines');
});

// Test 11: formatValidationSummary
runTest('formatValidationSummary output', () => {
  const original = ['one two', 'three four'];
  const transliteration = ['one two three', 'four five'];
  
  const result = validateLyricsAlignment(original, transliteration);
  const summary = formatValidationSummary(result);
  
  assert(typeof summary === 'string', 'Should return a string');
  assert(summary.includes('INVALID'), 'Should show INVALID status');
  assert(summary.includes('Mismatches: 2'), 'Should show 2 mismatches');
  console.log('\nFormatted Summary:');
  console.log(summary);
});

console.log('\n' + '='.repeat(60));
console.log('✨ All tests completed!');
console.log('='.repeat(60));
