import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { validateLyricsAlignment } from '../utils/lyricsValidator';

const ValidationDetailView = () => {
  const { mantraId, language } = useParams();
  const [validation, setValidation] = useState(null);
  const [originalLyrics, setOriginalLyrics] = useState([]);
  const [transliterationLyrics, setTransliterationLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mantraName, setMantraName] = useState('');

  useEffect(() => {
    loadAndValidate();
  }, [mantraId, language]);

  const loadAndValidate = async () => {
    try {
      // Load mantra info
      const mantrasResponse = await fetch('/mantrasData.json');
      const mantrasData = await mantrasResponse.json();
      const mantra = mantrasData.mantras.find(m => m.id === mantraId);
      
      if (!mantra) {
        console.error('Mantra not found');
        return;
      }

      setMantraName(mantra.name);

      // Load Hindi (original)
      const hindiResponse = await fetch(`/Lyrics_data/${mantra.path}/hindi/lyrics_transliteration.json`);
      const hindiData = await hindiResponse.json();

      // Load selected language
      const langResponse = await fetch(`/Lyrics_data/${mantra.path}/${language}/lyrics_transliteration.json`);
      const langData = await langResponse.json();

      setOriginalLyrics(hindiData.lyrics);
      setTransliterationLyrics(langData.lyrics);

      // Validate
      const result = validateLyricsAlignment(hindiData.lyrics, langData.lyrics);
      setValidation(result);
      setLoading(false);
    } catch (error) {
      console.error('Error loading validation data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading validation...</p>
      </div>
    );
  }

  if (!validation) {
    return <div style={styles.errorContainer}>Failed to load validation data</div>;
  }

  const { isValid, lineCount, lines, summary } = validation;

  return (
    <div style={styles.container}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <Link to="/validation" style={styles.breadcrumbLink}>← Back to Dashboard</Link>
      </div>

      {/* Header */}
      <div style={isValid ? styles.headerValid : styles.headerInvalid}>
        <h1 style={styles.title}>
          {mantraName.replace(/_/g, ' ').toUpperCase()}
        </h1>
        <div style={styles.languageTag}>
          Hindi → {language.charAt(0).toUpperCase() + language.slice(1)}
        </div>
        <div style={styles.statusBadge}>
          {isValid ? '✓ Valid Alignment' : '⚠ Alignment Issues Detected'}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Lines</div>
          <div style={styles.summaryValue}>{summary.totalLines}</div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Matches</div>
          <div style={{...styles.summaryValue, color: '#27ae60'}}>{summary.totalMatches}</div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Mismatches</div>
          <div style={{...styles.summaryValue, color: '#e74c3c'}}>{summary.totalMismatches}</div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Line Count Diff</div>
          <div style={{
            ...styles.summaryValue,
            color: lineCount.originalVsTransliteration.isMismatch ? '#e74c3c' : '#27ae60'
          }}>
            {lineCount.originalVsTransliteration.displayValue}
          </div>
        </div>
      </div>

      {/* Line-by-line comparison */}
      <div style={styles.comparisonContainer}>
        <div style={styles.comparisonHeader}>
          <h2 style={styles.sectionTitle}>Line-by-Line Comparison</h2>
          <div style={styles.legend}>
            <span style={styles.legendItem}>
              <span style={{...styles.legendDot, backgroundColor: '#27ae60'}}></span>
              Match
            </span>
            <span style={styles.legendItem}>
              <span style={{...styles.legendDot, backgroundColor: '#e74c3c'}}></span>
              Mismatch
            </span>
          </div>
        </div>

        {lines.map((line, index) => {
          const originalLine = originalLyrics[index] || '';
          const transliterationLine = transliterationLyrics[index] || '';
          const isMismatch = line.isMismatch;

          return (
            <div
              key={index}
              style={isMismatch ? styles.lineRowMismatch : styles.lineRowMatch}
            >
              {/* Line Number */}
              <div style={styles.lineNumber}>
                <span style={isMismatch ? styles.lineNumberBadgeMismatch : styles.lineNumberBadgeMatch}>
                  {index + 1}
                </span>
              </div>

              {/* Original (Hindi) */}
              <div style={styles.textColumn}>
                <div style={styles.columnHeader}>Original (Hindi)</div>
                <div style={line.status === 'ORIGINAL_MISSING' ? styles.missingText : styles.text}>
                  {originalLine || <em style={styles.missingLabel}>LINE MISSING</em>}
                </div>
                {line.originalWordCount !== undefined && (
                  <div style={styles.wordCount}>{line.originalWordCount} words</div>
                )}
              </div>

              {/* Transliteration */}
              <div style={styles.textColumn}>
                <div style={styles.columnHeader}>Transliteration ({language})</div>
                <div style={line.status === 'TRANSLITERATION_MISSING' ? styles.missingText : styles.text}>
                  {transliterationLine || <em style={styles.missingLabel}>LINE MISSING</em>}
                </div>
                {line.transliterationWordCount !== undefined && (
                  <div style={styles.wordCount}>{line.transliterationWordCount} words</div>
                )}
              </div>

              {/* Difference */}
              <div style={styles.diffColumn}>
                {line.status === 'BOTH_PRESENT' && (
                  <div style={isMismatch ? styles.diffBadgeMismatch : styles.diffBadgeMatch}>
                    {line.displayValue}
                  </div>
                )}
                {line.status !== 'BOTH_PRESENT' && (
                  <div style={styles.diffBadgeMismatch}>
                    MISSING
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1600px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    padding: '40px',
    textAlign: 'center',
    color: '#e74c3c',
  },
  breadcrumb: {
    marginBottom: '20px',
  },
  breadcrumbLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  headerValid: {
    backgroundColor: '#d4edda',
    border: '2px solid #c3e6cb',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  headerInvalid: {
    backgroundColor: '#f8d7da',
    border: '2px solid #f5c6cb',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '10px',
  },
  languageTag: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '10px',
  },
  statusBadge: {
    fontSize: '18px',
    fontWeight: '600',
    marginTop: '10px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  summaryValue: {
    fontSize: '32px',
    fontWeight: '700',
  },
  comparisonContainer: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  comparisonHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e0e0e0',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
  },
  legend: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  lineRowMatch: {
    display: 'grid',
    gridTemplateColumns: '50px 1fr 1fr 100px',
    gap: '15px',
    padding: '15px',
    marginBottom: '2px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    alignItems: 'start',
  },
  lineRowMismatch: {
    display: 'grid',
    gridTemplateColumns: '50px 1fr 1fr 100px',
    gap: '15px',
    padding: '15px',
    marginBottom: '2px',
    backgroundColor: '#fff5f5',
    border: '2px solid #e74c3c',
    borderRadius: '8px',
    alignItems: 'start',
  },
  lineNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineNumberBadgeMatch: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e9ecef',
    color: '#495057',
    fontSize: '14px',
    fontWeight: '600',
  },
  lineNumberBadgeMismatch: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
  },
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  columnHeader: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '5px',
  },
  text: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#212529',
  },
  missingText: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#e74c3c',
    fontStyle: 'italic',
  },
  missingLabel: {
    color: '#e74c3c',
    fontSize: '13px',
    fontWeight: '600',
  },
  wordCount: {
    fontSize: '12px',
    color: '#6c757d',
    fontWeight: '500',
  },
  diffColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffBadgeMatch: {
    display: 'inline-flex',
    padding: '6px 14px',
    borderRadius: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    fontSize: '14px',
    fontWeight: '700',
  },
  diffBadgeMismatch: {
    display: 'inline-flex',
    padding: '6px 14px',
    borderRadius: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    fontSize: '14px',
    fontWeight: '700',
  },
};

export default ValidationDetailView;
