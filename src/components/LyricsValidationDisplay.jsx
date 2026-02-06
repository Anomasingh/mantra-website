import React, { useState, useEffect } from 'react';
import { validateLyricsAlignment } from '../utils/lyricsValidator';

/**
 * LyricsValidationDisplay Component
 * 
 * Displays lyrics with validation highlighting for mismatches.
 * Shows original, transliteration, and translation side by side with
 * visual indicators for alignment issues.
 */
const LyricsValidationDisplay = ({ original = [], transliteration = [], translation = [] }) => {
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    const result = validateLyricsAlignment(original, transliteration, translation);
    setValidation(result);
  }, [original, transliteration, translation]);

  if (!validation) {
    return <div>Loading validation...</div>;
  }

  const { isValid, lineCount, lines, summary } = validation;

  return (
    <div style={styles.container}>
      {/* Validation Summary Header */}
      <div style={isValid ? styles.summaryValid : styles.summaryInvalid}>
        <h3 style={styles.summaryTitle}>
          {isValid ? '✓ Alignment Valid' : '⚠ Alignment Issues Detected'}
        </h3>
        <div style={styles.summaryStats}>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Lines:</span>
            <span style={styles.statValue}>
              Original: {lineCount.original} | 
              Transliteration: {lineCount.transliteration} | 
              Translation: {lineCount.translation}
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Line Count Diff:</span>
            <span style={lineCount.originalVsTransliteration.isMismatch ? styles.mismatchValue : styles.matchValue}>
              {lineCount.originalVsTransliteration.displayValue}
            </span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statLabel}>Mismatches:</span>
            <span style={summary.totalMismatches > 0 ? styles.mismatchValue : styles.matchValue}>
              {summary.totalMismatches} / {summary.totalLines}
            </span>
          </div>
        </div>
      </div>

      {/* Line-by-line display */}
      <div style={styles.lyricsContainer}>
        {lines.map((lineValidation, index) => {
          const { lineIndex, isMismatch, status, originalWordCount, transliterationWordCount, difference, displayValue } = lineValidation;
          const originalLine = original[index] || '';
          const transliterationLine = transliteration[index] || '';
          const translationLine = translation[index] || '';

          return (
            <div 
              key={lineIndex} 
              style={isMismatch ? styles.lineRowMismatch : styles.lineRowMatch}
            >
              {/* Line number */}
              <div style={styles.lineNumber}>
                <span style={isMismatch ? styles.lineNumberMismatch : styles.lineNumberMatch}>
                  {lineIndex + 1}
                </span>
              </div>

              {/* Original */}
              <div style={styles.column}>
                <div style={status === 'ORIGINAL_MISSING' ? styles.missingText : styles.text}>
                  {originalLine || <em style={styles.missingLabel}>LINE MISSING</em>}
                </div>
                <div style={styles.wordCount}>
                  {status !== 'ORIGINAL_MISSING' && `${originalWordCount} words`}
                </div>
              </div>

              {/* Transliteration */}
              <div style={styles.column}>
                <div style={status === 'TRANSLITERATION_MISSING' ? styles.missingText : styles.text}>
                  {transliterationLine || <em style={styles.missingLabel}>LINE MISSING</em>}
                </div>
                <div style={styles.wordCount}>
                  {status !== 'TRANSLITERATION_MISSING' && `${transliterationWordCount} words`}
                </div>
              </div>

              {/* Translation */}
              <div style={styles.column}>
                <div style={styles.text}>
                  {translationLine || <em style={styles.emptyLabel}>—</em>}
                </div>
              </div>

              {/* Difference indicator */}
              <div style={styles.differenceColumn}>
                {status === 'BOTH_PRESENT' && (
                  <span style={isMismatch ? styles.differenceValueMismatch : styles.differenceValueMatch}>
                    {displayValue}
                  </span>
                )}
                {status !== 'BOTH_PRESENT' && (
                  <span style={styles.differenceValueMismatch}>
                    MISSING
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Inline styles (you can move these to CSS/styled-components)
const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
  summaryValid: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  summaryInvalid: {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  summaryTitle: {
    margin: '0 0 15px 0',
    fontSize: '20px',
    fontWeight: '600',
  },
  summaryStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  stat: {
    display: 'flex',
    gap: '10px',
    fontSize: '14px',
  },
  statLabel: {
    fontWeight: '600',
    minWidth: '120px',
  },
  statValue: {
    color: '#555',
  },
  matchValue: {
    color: '#28a745',
    fontWeight: '600',
  },
  mismatchValue: {
    color: '#dc3545',
    fontWeight: '600',
  },
  lyricsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  lineRowMatch: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 1fr 1fr 80px',
    gap: '15px',
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    alignItems: 'start',
  },
  lineRowMismatch: {
    display: 'grid',
    gridTemplateColumns: '40px 1fr 1fr 1fr 80px',
    gap: '15px',
    padding: '12px',
    backgroundColor: '#fff5f5',
    border: '2px solid #dc3545',
    borderRadius: '4px',
    alignItems: 'start',
  },
  lineNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineNumberMatch: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#e9ecef',
    color: '#495057',
    fontSize: '13px',
    fontWeight: '600',
  },
  lineNumberMismatch: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  text: {
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#212529',
  },
  missingText: {
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#dc3545',
    fontStyle: 'italic',
  },
  missingLabel: {
    color: '#dc3545',
    fontSize: '13px',
    fontWeight: '600',
  },
  emptyLabel: {
    color: '#adb5bd',
    fontSize: '13px',
  },
  wordCount: {
    fontSize: '11px',
    color: '#6c757d',
    fontWeight: '500',
  },
  differenceColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  differenceValueMatch: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 12px',
    borderRadius: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    fontSize: '13px',
    fontWeight: '600',
  },
  differenceValueMismatch: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 12px',
    borderRadius: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    fontSize: '13px',
    fontWeight: '600',
  },
};

export default LyricsValidationDisplay;
