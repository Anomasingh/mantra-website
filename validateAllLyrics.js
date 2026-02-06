/**
 * Validation Script for All Mantras
 * Checks alignment between original (Hindi/Devanagari) and all language transliterations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateLyricsAlignment, getMismatchedLines } from './src/utils/lyricsValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LYRICS_BASE_PATH = path.join(__dirname, 'public', 'Lyrics_data');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Load JSON file safely
 */
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Get all mantra directories
 */
function getMantraDirectories() {
  const entries = fs.readdirSync(LYRICS_BASE_PATH, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

/**
 * Get all language directories for a mantra
 */
function getLanguageDirectories(mantraPath) {
  const entries = fs.readdirSync(mantraPath, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

/**
 * Validate a single mantra-language combination
 */
function validateMantraLanguage(mantraName, originalLyrics, languageName, languagePath) {
  const transliterationPath = path.join(languagePath, 'lyrics_transliteration.json');
  const translationPath = path.join(languagePath, 'lyrics_translation.json');

  const transliterationData = loadJSON(transliterationPath);
  const translationData = loadJSON(translationPath);

  if (!transliterationData || !transliterationData.lyrics) {
    return {
      mantra: mantraName,
      language: languageName,
      status: 'MISSING_FILE',
      error: 'Transliteration file not found or invalid'
    };
  }

  const validation = validateLyricsAlignment(
    originalLyrics,
    transliterationData.lyrics,
    translationData?.lyrics || []
  );

  return {
    mantra: mantraName,
    language: languageName,
    status: validation.isValid ? 'VALID' : 'INVALID',
    validation,
    mismatches: getMismatchedLines(validation)
  };
}

/**
 * Main validation function
 */
function validateAllMantras() {
  console.log(`${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║        LYRICS ALIGNMENT VALIDATION REPORT                  ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const mantras = getMantraDirectories();
  const results = {
    total: 0,
    valid: 0,
    invalid: 0,
    missing: 0,
    details: []
  };

  mantras.forEach(mantraName => {
    const mantraPath = path.join(LYRICS_BASE_PATH, mantraName);
    const languages = getLanguageDirectories(mantraPath);

    // Use Hindi as reference (original) for most mantras
    const hindiPath = path.join(mantraPath, 'hindi', 'lyrics_transliteration.json');
    const hindiData = loadJSON(hindiPath);

    if (!hindiData || !hindiData.lyrics) {
      console.log(`${colors.yellow}⚠ Skipping ${mantraName}: No Hindi reference found${colors.reset}`);
      return;
    }

    const originalLyrics = hindiData.lyrics;

    console.log(`${colors.bold}${colors.magenta}\n▶ ${mantraName.toUpperCase()}${colors.reset}`);
    console.log(`${colors.blue}  Reference: Hindi (${originalLyrics.length} lines)${colors.reset}`);

    languages.forEach(languageName => {
      if (languageName === 'hindi') return; // Skip comparing Hindi to itself

      results.total++;
      const languagePath = path.join(mantraPath, languageName);
      const result = validateMantraLanguage(mantraName, originalLyrics, languageName, languagePath);
      results.details.push(result);

      if (result.status === 'VALID') {
        results.valid++;
        console.log(`  ${colors.green}✓${colors.reset} ${languageName.padEnd(15)} - Valid`);
      } else if (result.status === 'INVALID') {
        results.invalid++;
        const { summary, lineCount } = result.validation;
        console.log(`  ${colors.red}✗${colors.reset} ${languageName.padEnd(15)} - ${colors.red}${summary.totalMismatches} mismatches${colors.reset}`);
        
        // Show line count difference
        if (lineCount.originalVsTransliteration.isMismatch) {
          console.log(`    ${colors.yellow}Line count diff: ${lineCount.originalVsTransliteration.displayValue}${colors.reset}`);
        }

        // Show first 5 mismatched lines
        const mismatches = result.mismatches.slice(0, 5);
        mismatches.forEach(line => {
          if (line.status === 'BOTH_PRESENT') {
            console.log(`    ${colors.red}Line ${line.lineIndex + 1}: ${line.originalWordCount} vs ${line.transliterationWordCount} words (${line.displayValue})${colors.reset}`);
          } else {
            console.log(`    ${colors.red}Line ${line.lineIndex + 1}: ${line.difference}${colors.reset}`);
          }
        });

        if (result.mismatches.length > 5) {
          console.log(`    ${colors.yellow}... and ${result.mismatches.length - 5} more${colors.reset}`);
        }
      } else {
        results.missing++;
        console.log(`  ${colors.yellow}⚠${colors.reset} ${languageName.padEnd(15)} - ${result.error}`);
      }
    });
  });

  // Summary
  console.log(`\n${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║                    VALIDATION SUMMARY                      ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  console.log(`  Total Checked:    ${results.total}`);
  console.log(`  ${colors.green}✓ Valid:          ${results.valid}${colors.reset}`);
  console.log(`  ${colors.red}✗ Invalid:        ${results.invalid}${colors.reset}`);
  console.log(`  ${colors.yellow}⚠ Missing/Error:  ${results.missing}${colors.reset}\n`);

  const successRate = results.total > 0 ? ((results.valid / results.total) * 100).toFixed(1) : 0;
  console.log(`  Success Rate:     ${successRate}%\n`);

  // Export detailed report
  const reportPath = path.join(__dirname, 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`${colors.cyan}📄 Detailed report saved to: validation-report.json${colors.reset}\n`);

  return results;
}

// Run validation
validateAllMantras();
