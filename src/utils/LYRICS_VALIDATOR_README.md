# Lyrics Alignment Validator

A production-ready JavaScript utility for validating alignment between original text, transliteration, and translation arrays.

## Features

✅ **Line count validation** - No errors thrown, just numeric differences  
✅ **Word count comparison** - Language/script agnostic (whitespace-based)  
✅ **Per-line analysis** - Detailed validation for each line  
✅ **Missing line detection** - Graceful handling of array length mismatches  
✅ **UI-friendly output** - Includes flags for conditional styling  
✅ **Zero dependencies** - Pure JavaScript

## Installation

The validator is located at `src/utils/lyricsValidator.js` and can be imported directly:

```javascript
import { validateLyricsAlignment } from './utils/lyricsValidator';
```

## Quick Start

```javascript
import { validateLyricsAlignment } from './utils/lyricsValidator';

const original = ['ॐ नमः शिवाय', 'हर हर महादेव'];
const transliteration = ['Om Namah Shivaya', 'Har Har Mahadev'];
const translation = ['I bow to Shiva', 'Hail the Lord'];

const result = validateLyricsAlignment(original, transliteration, translation);

console.log(result.isValid); // true or false
console.log(result.summary.totalMismatches); // number of mismatched lines
```

## API Reference

### `validateLyricsAlignment(original, transliteration, translation)`

Main validation function.

**Parameters:**
- `original` (Array<string>): Array of original text lines
- `transliteration` (Array<string>): Array of transliteration lines
- `translation` (Array<string>, optional): Array of translation lines

**Returns:** Object with the following structure:

```javascript
{
  isValid: boolean,              // Overall validation status
  
  lineCount: {
    original: number,            // Count of original lines
    transliteration: number,     // Count of transliteration lines
    translation: number,         // Count of translation lines
    originalVsTransliteration: {
      difference: number,        // Numeric difference (e.g., 1, -2, 0)
      displayValue: string,      // Formatted string (e.g., "+1", "-2", "0")
      isMismatch: boolean        // true if difference !== 0
    },
    // Similar structures for other comparisons...
  },
  
  lines: [
    {
      lineIndex: number,         // 0-based line index
      status: string,            // "BOTH_PRESENT", "ORIGINAL_MISSING", "TRANSLITERATION_MISSING"
      originalWordCount: number,
      transliterationWordCount: number,
      difference: number|string, // Numeric difference or "LINE MISSING"
      displayValue: string,      // Formatted difference (e.g., "+1", "0")
      isMismatch: boolean,       // true if words don't match
      message: string            // Human-readable description
    },
    // ... one entry per line
  ],
  
  summary: {
    totalLines: number,          // Maximum line count across arrays
    totalMatches: number,        // Count of matching lines
    totalMismatches: number,     // Count of mismatched lines
    missingOriginalLines: number,
    missingTransliterationLines: number,
    hasLineMismatch: boolean,    // true if line counts differ
    hasWordMismatch: boolean     // true if any word counts differ
  }
}
```

### `getMismatchedLines(validationResult)`

Helper function to filter only mismatched lines.

**Parameters:**
- `validationResult` (Object): Result from `validateLyricsAlignment`

**Returns:** Array of line objects that have `isMismatch: true`

### `formatValidationSummary(validationResult)`

Formats validation results as a human-readable text summary.

**Parameters:**
- `validationResult` (Object): Result from `validateLyricsAlignment`

**Returns:** String with formatted summary

## Usage Examples

### Example 1: Basic Validation

```javascript
const result = validateLyricsAlignment(
  ['ॐ नमः शिवाय'],
  ['Om Namah Shivaya'],
  ['I bow to Shiva']
);

if (!result.isValid) {
  console.log(`Found ${result.summary.totalMismatches} issues`);
}
```

### Example 2: Detecting Word Count Mismatches

```javascript
const original = ['हर हर महादेव श्री'];      // 4 words
const transliteration = ['Har Har Mahadev'];  // 3 words

const result = validateLyricsAlignment(original, transliteration);

result.lines.forEach((line, index) => {
  if (line.isMismatch) {
    console.log(`Line ${index}: ${line.originalWordCount} vs ${line.transliterationWordCount} words`);
    console.log(`Difference: ${line.displayValue}`);
  }
});
```

### Example 3: Handling Missing Lines

```javascript
const original = ['Line 1', 'Line 2', 'Line 3'];
const transliteration = ['Line 1', 'Line 2']; // Missing line 3

const result = validateLyricsAlignment(original, transliteration);

// Check line count difference
console.log(result.lineCount.originalVsTransliteration.displayValue); // "+1"

// Check specific line
if (result.lines[2].status === 'TRANSLITERATION_MISSING') {
  console.log('Line 3 is missing in transliteration');
}
```

### Example 4: Using with JSON Data

```javascript
// Load from your JSON structure
const lyricsData = await fetch('/public/Lyrics_data/mantra/english/lyrics.json')
  .then(res => res.json());

const result = validateLyricsAlignment(
  lyricsData.original,
  lyricsData.transliteration,
  lyricsData.translation
);

// Get only problematic lines
const issues = getMismatchedLines(result);
console.log(`Found ${issues.length} lines with issues`);
```

### Example 5: React Component Integration

```javascript
import React from 'react';
import { validateLyricsAlignment } from './utils/lyricsValidator';

function LyricsEditor({ lyrics }) {
  const validation = validateLyricsAlignment(
    lyrics.original,
    lyrics.transliteration,
    lyrics.translation
  );

  return (
    <div>
      {validation.lines.map((line, index) => (
        <div 
          key={index}
          style={{
            backgroundColor: line.isMismatch ? '#ffebee' : 'white',
            border: line.isMismatch ? '2px solid red' : '1px solid #ccc'
          }}
        >
          <span>{lyrics.original[index]}</span>
          <span>{lyrics.transliteration[index]}</span>
          {line.isMismatch && (
            <span className="error">
              Word count difference: {line.displayValue}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
```

## Validation Rules

### 1. Line Count Validation
- **Never throws errors**
- Computes numeric difference between array lengths
- Returns `0` if equal, `+N` if first array is longer, `-N` if shorter
- Marks non-zero differences with `isMismatch: true`

### 2. Word Count Comparison
- **Only compares original vs transliteration**
- Translation is ignored for word counting
- Uses whitespace-based splitting (language agnostic)
- Works with any script: Devanagari, Arabic, Chinese, Cyrillic, etc.

### 3. Per-Line Validation
- Compares word counts for each line index
- Returns `0` if counts match
- Returns numeric difference if counts differ
- Marks mismatches for UI highlighting

### 4. Missing Lines
- If line exists in one array but not the other: marked as `"LINE MISSING"`
- Sets appropriate status: `"ORIGINAL_MISSING"` or `"TRANSLITERATION_MISSING"`
- Does not fail validation, just flags the issue

## Word Counting Logic

The validator uses a simple, universal word counting algorithm:

```javascript
const countWords = (line) => {
  if (!line || typeof line !== 'string') return 0;
  return line.trim().split(/\s+/).filter(word => word.length > 0).length;
};
```

This works across all languages and scripts:
- Devanagari: `'ॐ नमः शिवाय'` → 3 words
- Arabic: `'السلام عليكم'` → 2 words
- Chinese: `'你好 世界'` → 2 words
- Latin: `'Om Namah Shivaya'` → 3 words

## UI Integration

The validator provides several flags for conditional styling:

```javascript
const result = validateLyricsAlignment(original, transliteration);

// Overall status
<div className={result.isValid ? 'valid' : 'invalid'}>

// Line-level styling
result.lines.map(line => (
  <div 
    className={line.isMismatch ? 'mismatch' : 'match'}
    style={{ color: line.isMismatch ? 'red' : 'black' }}
  >
    {/* line content */}
  </div>
))

// Show difference badge
{line.isMismatch && <span>{line.displayValue}</span>}
```

## Testing

Run the test suite:

```bash
node src/utils/lyricsValidator.test.js
```

See `lyricsValidator.example.js` for more usage examples.

## React Component

A ready-to-use React component is available at `src/components/LyricsValidationDisplay.jsx` that demonstrates:
- Visual highlighting of mismatched lines
- Summary statistics display
- Side-by-side comparison view
- Word count indicators
- Difference badges

## Common Use Cases

### 1. Validation During Data Entry
```javascript
function validateBeforeSave(lyrics) {
  const result = validateLyricsAlignment(
    lyrics.original,
    lyrics.transliteration
  );
  
  if (!result.isValid) {
    alert(`Please fix ${result.summary.totalMismatches} alignment issues`);
    return false;
  }
  
  return true;
}
```

### 2. Batch Validation
```javascript
async function validateAllMantras() {
  const mantras = await loadAllMantras();
  const results = mantras.map(mantra => ({
    name: mantra.name,
    validation: validateLyricsAlignment(
      mantra.original,
      mantra.transliteration
    )
  }));
  
  const invalid = results.filter(r => !r.validation.isValid);
  console.log(`${invalid.length} mantras have alignment issues`);
}
```

### 3. Real-time Validation
```javascript
function LyricsEditor() {
  const [original, setOriginal] = useState([]);
  const [transliteration, setTransliteration] = useState([]);
  const [validation, setValidation] = useState(null);
  
  useEffect(() => {
    const result = validateLyricsAlignment(original, transliteration);
    setValidation(result);
  }, [original, transliteration]);
  
  return (
    <div>
      {validation && !validation.isValid && (
        <Alert>Found {validation.summary.totalMismatches} issues</Alert>
      )}
      {/* Editor UI */}
    </div>
  );
}
```

## Performance

- ⚡ **Fast**: O(n) complexity where n is the number of lines
- 💾 **Lightweight**: No external dependencies
- 🔄 **Efficient**: Can validate hundreds of lines instantly

## Error Handling

The validator is designed to never throw errors:
- Handles `null` and `undefined` inputs
- Treats non-array inputs as empty arrays
- Treats non-string lines as empty strings
- Returns valid results even with malformed data

## License

Part of the Mantra Website project.
