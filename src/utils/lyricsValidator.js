/**
 * Lyrics Alignment Validator
 * 
 * Validates alignment between original, transliteration, and translation arrays.
 * Provides detailed metrics for UI highlighting of mismatches.
 */

/**
 * Counts words in a text line (language/script agnostic)
 * Excludes verse markers, numbers, and punctuation symbols
 * @param {string} line - Text line to count words from
 * @returns {number} Word count
 */
const countWords = (line) => {
  if (!line || typeof line !== 'string') return 0;
  
  // Split by whitespace and filter out non-word elements
  const words = line.trim().split(/\s+/).filter(word => {
    const trimmedWord = word.trim();
    
    // Skip empty words
    if (trimmedWord === '') return false;
    
    // Skip words that contain only:
    // - Devanagari punctuation (॥, ।, etc.)
    // - Numbers from all Indic scripts (14 languages):
    //   - Devanagari (Hindi/Marathi): \u0966-\u096F (०-९)
    //   - Bengali: \u09E6-\u09EF (০-৯)
    //   - Gurmukhi (Punjabi): \u0A66-\u0A6F (੦-੯)
    //   - Gujarati: \u0AE6-\u0AEF (૦-૯)
    //   - Telugu: \u0C66-\u0C6F (౦-౯)
    //   - Kannada: \u0CE6-\u0CEF (೦-೯)
    //   - Malayalam: \u0D66-\u0D6F (൦-൯)
    //   - Tamil: \u0BE6-\u0BEF (௦-௯)
    //   - Arabic/Urdu: \u0660-\u0669 (٠-٩)
    //   - Regular: 0-9
    // - Common punctuation marks
    // - Brackets, parentheses, etc.
    // - Verse markers like ॥१॥, ॥൧॥, ॥೧॥, etc.
    const symbolOnlyRegex = /^[॥।\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0660-\u06690-9\(\)\[\]\{\}\.,;:!?\-\s"']+$/;
    
    return !symbolOnlyRegex.test(trimmedWord);
  });
  
  return words.length;
};

/**
 * Calculates line count difference
 * @param {number} count1 - First array length
 * @param {number} count2 - Second array length
 * @returns {object} Difference object with value and mismatch flag
 */
const calculateLineDifference = (count1, count2) => {
  const difference = count1 - count2;
  return {
    difference,
    displayValue: difference === 0 ? '0' : (difference > 0 ? `+${difference}` : `${difference}`),
    isMismatch: difference !== 0
  };
};

/**
 * Validates a single line's word count between original and transliteration
 * @param {string|undefined} originalLine - Line from original text
 * @param {string|undefined} transliterationLine - Line from transliteration text
 * @param {number} lineIndex - Line index (0-based)
 * @returns {object} Validation result for the line
 */
const validateLine = (originalLine, transliterationLine, lineIndex) => {
  // Handle missing lines
  if (originalLine === undefined && transliterationLine === undefined) {
    return {
      lineIndex,
      status: 'BOTH_MISSING',
      difference: 0,
      isMismatch: true,
      message: 'Line missing in both arrays'
    };
  }

  if (originalLine === undefined) {
    return {
      lineIndex,
      status: 'ORIGINAL_MISSING',
      originalWordCount: 0,
      transliterationWordCount: countWords(transliterationLine),
      difference: 'LINE MISSING',
      isMismatch: true,
      message: 'Line missing in original'
    };
  }

  if (transliterationLine === undefined) {
    return {
      lineIndex,
      status: 'TRANSLITERATION_MISSING',
      originalWordCount: countWords(originalLine),
      transliterationWordCount: 0,
      difference: 'LINE MISSING',
      isMismatch: true,
      message: 'Line missing in transliteration'
    };
  }

  // Both lines exist - compare word counts
  const originalWordCount = countWords(originalLine);
  const transliterationWordCount = countWords(transliterationLine);
  const difference = originalWordCount - transliterationWordCount;

  return {
    lineIndex,
    status: 'BOTH_PRESENT',
    originalWordCount,
    transliterationWordCount,
    difference,
    displayValue: difference === 0 ? '0' : (difference > 0 ? `+${difference}` : `${difference}`),
    isMismatch: difference !== 0,
    message: difference === 0 ? 'Word counts match' : `Word count mismatch: ${difference}`
  };
};

/**
 * Main validation function for lyrics alignment
 * @param {string[]} original - Array of original text lines
 * @param {string[]} transliteration - Array of transliteration text lines
 * @param {string[]} translation - Array of translation text lines (optional, for metadata)
 * @returns {object} Complete validation results
 */
export const validateLyricsAlignment = (original = [], transliteration = [], translation = []) => {
  // Ensure inputs are arrays
  const originalArray = Array.isArray(original) ? original : [];
  const transliterationArray = Array.isArray(transliteration) ? transliteration : [];
  const translationArray = Array.isArray(translation) ? translation : [];

  // Line count validation
  const lineCountComparison = {
    original: originalArray.length,
    transliteration: transliterationArray.length,
    translation: translationArray.length,
    originalVsTransliteration: calculateLineDifference(
      originalArray.length,
      transliterationArray.length
    ),
    originalVsTranslation: calculateLineDifference(
      originalArray.length,
      translationArray.length
    ),
    transliterationVsTranslation: calculateLineDifference(
      transliterationArray.length,
      translationArray.length
    )
  };

  // Per-line validation (only original vs transliteration)
  const maxLines = Math.max(originalArray.length, transliterationArray.length);
  const lineValidations = [];

  for (let i = 0; i < maxLines; i++) {
    lineValidations.push(
      validateLine(originalArray[i], transliterationArray[i], i)
    );
  }

  // Summary statistics
  const totalMismatches = lineValidations.filter(line => line.isMismatch).length;
  const totalMatches = lineValidations.filter(line => !line.isMismatch).length;
  const missingOriginalLines = lineValidations.filter(
    line => line.status === 'ORIGINAL_MISSING'
  ).length;
  const missingTransliterationLines = lineValidations.filter(
    line => line.status === 'TRANSLITERATION_MISSING'
  ).length;

  // Overall validation status
  const hasLineMismatch = lineCountComparison.originalVsTransliteration.isMismatch;
  const hasWordMismatch = totalMismatches > 0;
  const isValid = !hasLineMismatch && !hasWordMismatch;

  return {
    isValid,
    lineCount: lineCountComparison,
    lines: lineValidations,
    summary: {
      totalLines: maxLines,
      totalMatches,
      totalMismatches,
      missingOriginalLines,
      missingTransliterationLines,
      hasLineMismatch,
      hasWordMismatch
    }
  };
};

/**
 * Helper function to get only mismatched lines
 * @param {object} validationResult - Result from validateLyricsAlignment
 * @returns {array} Array of only mismatched lines
 */
export const getMismatchedLines = (validationResult) => {
  return validationResult.lines.filter(line => line.isMismatch);
};

/**
 * Helper function to format validation results for display
 * @param {object} validationResult - Result from validateLyricsAlignment
 * @returns {string} Formatted text summary
 */
export const formatValidationSummary = (validationResult) => {
  const { isValid, lineCount, summary } = validationResult;
  
  let output = [];
  output.push(`Validation Status: ${isValid ? '✓ VALID' : '✗ INVALID'}`);
  output.push('');
  output.push('Line Counts:');
  output.push(`  Original: ${lineCount.original}`);
  output.push(`  Transliteration: ${lineCount.transliteration}`);
  output.push(`  Translation: ${lineCount.translation}`);
  output.push('');
  output.push('Differences:');
  output.push(`  Original vs Transliteration: ${lineCount.originalVsTransliteration.displayValue}`);
  output.push('');
  output.push('Summary:');
  output.push(`  Total Lines: ${summary.totalLines}`);
  output.push(`  Matches: ${summary.totalMatches}`);
  output.push(`  Mismatches: ${summary.totalMismatches}`);
  if (summary.missingOriginalLines > 0) {
    output.push(`  Missing in Original: ${summary.missingOriginalLines}`);
  }
  if (summary.missingTransliterationLines > 0) {
    output.push(`  Missing in Transliteration: ${summary.missingTransliterationLines}`);
  }
  
  return output.join('\n');
};

export default validateLyricsAlignment;
