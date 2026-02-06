/**
 * Usage Examples for Lyrics Validator
 */

import { validateLyricsAlignment, getMismatchedLines, formatValidationSummary } from './lyricsValidator.js';

// Example 1: Perfect alignment
const example1 = () => {
  const original = [
    'ॐ नमः शिवाय',
    'हर हर महादेव',
    'जय शिव शंकर'
  ];
  
  const transliteration = [
    'Om Namah Shivaya',
    'Har Har Mahadev',
    'Jai Shiv Shankar'
  ];
  
  const translation = [
    'I bow to Lord Shiva',
    'Hail the great Lord',
    'Victory to Lord Shiva'
  ];
  
  const result = validateLyricsAlignment(original, transliteration, translation);
  console.log('Example 1 - Perfect Alignment:');
  console.log(formatValidationSummary(result));
  console.log('Is Valid:', result.isValid); // true
};

// Example 2: Word count mismatch
const example2 = () => {
  const original = [
    'ॐ नमः शिवाय',
    'हर हर महादेव श्री',  // 4 words
    'जय शिव'
  ];
  
  const transliteration = [
    'Om Namah Shivaya',
    'Har Har Mahadev',  // 3 words - mismatch!
    'Jai Shiv'
  ];
  
  const result = validateLyricsAlignment(original, transliteration);
  console.log('\nExample 2 - Word Count Mismatch:');
  console.log(formatValidationSummary(result));
  console.log('Mismatched Lines:', getMismatchedLines(result));
};

// Example 3: Missing lines
const example3 = () => {
  const original = [
    'ॐ नमः शिवाय',
    'हर हर महादेव',
    'जय शिव शंकर',
    'ॐ नमो भगवते'  // Extra line in original
  ];
  
  const transliteration = [
    'Om Namah Shivaya',
    'Har Har Mahadev',
    'Jai Shiv Shankar'
    // Missing line here
  ];
  
  const result = validateLyricsAlignment(original, transliteration);
  console.log('\nExample 3 - Missing Line:');
  console.log(formatValidationSummary(result));
  console.log('Line 3 status:', result.lines[3].status);
  console.log('Line 3 message:', result.lines[3].message);
};

// Example 4: Accessing individual line results
const example4 = () => {
  const original = ['ॐ नमः शिवाय', 'हर हर'];
  const transliteration = ['Om Namah Shivaya', 'Har Har Mahadev'];
  
  const result = validateLyricsAlignment(original, transliteration);
  
  console.log('\nExample 4 - Per-line Analysis:');
  result.lines.forEach((line, index) => {
    console.log(`Line ${index}:`);
    console.log(`  Original words: ${line.originalWordCount}`);
    console.log(`  Transliteration words: ${line.transliterationWordCount}`);
    console.log(`  Difference: ${line.displayValue}`);
    console.log(`  Mismatch: ${line.isMismatch ? '❌' : '✓'}`);
  });
};

// Example 5: Using with JSON data from your file structure
const example5 = async () => {
  try {
    // Simulating loading from your JSON structure
    const lyricsData = {
      original: ['ॐ नमः शिवाय', 'हर हर महादेव'],
      transliteration: ['Om Namah Shivaya', 'Har Har Mahadev'],
      translation: ['I bow to Lord Shiva', 'Hail the great Lord']
    };
    
    const result = validateLyricsAlignment(
      lyricsData.original,
      lyricsData.transliteration,
      lyricsData.translation
    );
    
    console.log('\nExample 5 - JSON Data:');
    console.log(formatValidationSummary(result));
    
    // For UI rendering
    return {
      validation: result,
      shouldShowWarning: !result.isValid,
      mismatchedLineIndices: result.lines
        .filter(line => line.isMismatch)
        .map(line => line.lineIndex)
    };
  } catch (error) {
    console.error('Error validating lyrics:', error);
  }
};

// Run all examples
export const runAllExamples = () => {
  example1();
  example2();
  example3();
  example4();
  example5();
};

// Uncomment to run examples:
// runAllExamples();
