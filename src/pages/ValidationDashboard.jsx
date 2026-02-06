import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validateLyricsAlignment } from '../utils/lyricsValidator';

const ValidationDashboard = () => {
  const [validationData, setValidationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, valid, invalid
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMantra, setExpandedMantra] = useState(null);

  useEffect(() => {
    validateAllMantras();
  }, []);

  const validateAllMantras = async () => {
    try {
      const response = await fetch('/mantrasData.json');
      const data = await response.json();
      
      const results = [];
      
      for (const mantra of data.mantras) {
        const mantraResults = {
          id: mantra.id,
          name: mantra.name,
          languages: [],
          validCount: 0,
          invalidCount: 0
        };

        // Use hindi as reference
        const hindiPath = `/Lyrics_data/${mantra.path}/hindi/lyrics_transliteration.json`;
        let hindiData;
        
        try {
          const hindiResponse = await fetch(hindiPath);
          hindiData = await hindiResponse.json();
        } catch (error) {
          console.log(`No Hindi reference for ${mantra.name}`);
          continue;
        }

        // Validate each language
        for (const lang of mantra.languages) {
          if (lang === 'hindi') continue;

          const transliterationPath = `/Lyrics_data/${mantra.path}/${lang}/lyrics_transliteration.json`;
          
          try {
            const transliterationResponse = await fetch(transliterationPath);
            const transliterationData = await transliterationResponse.json();
            
            const validation = validateLyricsAlignment(
              hindiData.lyrics,
              transliterationData.lyrics
            );

            if (validation.isValid) {
              mantraResults.validCount++;
            } else {
              mantraResults.invalidCount++;
            }

            mantraResults.languages.push({
              language: lang,
              validation: validation,
              status: validation.isValid ? 'valid' : 'invalid'
            });
          } catch (error) {
            mantraResults.languages.push({
              language: lang,
              status: 'error',
              error: 'Failed to load'
            });
          }
        }

        results.push(mantraResults);
      }

      setValidationData(results);
      setLoading(false);
    } catch (error) {
      console.error('Error validating mantras:', error);
      setLoading(false);
    }
  };

  const filteredData = validationData.filter(mantra => {
    const matchesSearch = mantra.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'valid' && mantra.invalidCount === 0) ||
      (filterStatus === 'invalid' && mantra.invalidCount > 0);
    
    return matchesSearch && matchesFilter;
  });

  const totalMantras = validationData.length;
  const totalValid = validationData.reduce((sum, m) => sum + m.validCount, 0);
  const totalInvalid = validationData.reduce((sum, m) => sum + m.invalidCount, 0);
  const totalChecks = totalValid + totalInvalid;
  const successRate = totalChecks > 0 ? ((totalValid / totalChecks) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Validating lyrics alignment...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Lyrics Alignment Validation Dashboard</h1>
        <p style={styles.subtitle}>
          Word-by-word validation between Hindi reference and all language transliterations
        </p>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>📚</div>
          <div style={styles.summaryValue}>{totalMantras}</div>
          <div style={styles.summaryLabel}>Total Mantras</div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>✅</div>
          <div style={styles.summaryValue}>{totalValid}</div>
          <div style={styles.summaryLabel}>Valid Alignments</div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>❌</div>
          <div style={styles.summaryValue}>{totalInvalid}</div>
          <div style={styles.summaryLabel}>Invalid Alignments</div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>📊</div>
          <div style={styles.summaryValue}>{successRate}%</div>
          <div style={styles.summaryLabel}>Success Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <input
          type="text"
          placeholder="Search mantras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        
        <div style={styles.filterButtons}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{
              ...styles.filterButton,
              ...(filterStatus === 'all' ? styles.filterButtonActive : {})
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('valid')}
            style={{
              ...styles.filterButton,
              ...(filterStatus === 'valid' ? styles.filterButtonActiveGreen : {})
            }}
          >
            ✓ Valid Only
          </button>
          <button
            onClick={() => setFilterStatus('invalid')}
            style={{
              ...styles.filterButton,
              ...(filterStatus === 'invalid' ? styles.filterButtonActiveRed : {})
            }}
          >
            ✗ Has Issues
          </button>
        </div>
      </div>

      {/* Mantras List */}
      <div style={styles.mantrasList}>
        {filteredData.map((mantra) => (
          <div key={mantra.id} style={styles.mantraCard}>
            <div
              style={styles.mantraHeader}
              onClick={() => setExpandedMantra(expandedMantra === mantra.id ? null : mantra.id)}
            >
              <div style={styles.mantraInfo}>
                <h3 style={styles.mantraName}>
                  {mantra.name.replace(/_/g, ' ').toUpperCase()}
                </h3>
                <div style={styles.mantraStats}>
                  <span style={styles.statValid}>✓ {mantra.validCount} valid</span>
                  <span style={styles.statInvalid}>✗ {mantra.invalidCount} issues</span>
                  <span style={styles.statTotal}>
                    {mantra.languages.length} languages
                  </span>
                </div>
              </div>
              
              <div style={styles.expandIcon}>
                {expandedMantra === mantra.id ? '▼' : '▶'}
              </div>
            </div>

            {expandedMantra === mantra.id && (
              <div style={styles.languagesGrid}>
                {mantra.languages.map((langData) => (
                  <div
                    key={langData.language}
                    style={{
                      ...styles.languageCard,
                      ...(langData.status === 'valid' ? styles.languageCardValid : styles.languageCardInvalid)
                    }}
                  >
                    <div style={styles.languageHeader}>
                      <span style={styles.languageName}>
                        {langData.language}
                      </span>
                      <span style={styles.languageStatus}>
                        {langData.status === 'valid' ? '✓' : '✗'}
                      </span>
                    </div>
                    
                    {langData.validation && langData.status === 'invalid' && (
                      <div style={styles.languageDetails}>
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Mismatches:</span>
                          <span style={styles.detailValue}>
                            {langData.validation.summary.totalMismatches}
                          </span>
                        </div>
                        
                        {langData.validation.lineCount.originalVsTransliteration.isMismatch && (
                          <div style={styles.detailRow}>
                            <span style={styles.detailLabel}>Line difference:</span>
                            <span style={styles.detailValue}>
                              {langData.validation.lineCount.originalVsTransliteration.displayValue}
                            </span>
                          </div>
                        )}
                        
                        <Link
                          to={`/mantra/${mantra.id}/validate/${langData.language}`}
                          style={styles.detailsLink}
                        >
                          View Details →
                        </Link>
                      </div>
                    )}
                    
                    {langData.status === 'valid' && (
                      <div style={styles.validMessage}>
                        Perfect alignment!
                      </div>
                    )}
                    
                    {langData.status === 'error' && (
                      <div style={styles.errorMessage}>
                        {langData.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div style={styles.emptyState}>
          <p>No mantras found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
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
  loadingText: {
    fontSize: '16px',
    color: '#666',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  summaryIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  summaryValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '5px',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  filtersContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    flex: '1',
    minWidth: '250px',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
  },
  filterButton: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterButtonActive: {
    backgroundColor: '#3498db',
    color: '#fff',
    borderColor: '#3498db',
  },
  filterButtonActiveGreen: {
    backgroundColor: '#27ae60',
    color: '#fff',
    borderColor: '#27ae60',
  },
  filterButtonActiveRed: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    borderColor: '#e74c3c',
  },
  mantrasList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  mantraCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  mantraHeader: {
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  mantraInfo: {
    flex: 1,
  },
  mantraName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '10px',
  },
  mantraStats: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
  },
  statValid: {
    color: '#27ae60',
    fontWeight: '600',
  },
  statInvalid: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  statTotal: {
    color: '#666',
  },
  expandIcon: {
    fontSize: '18px',
    color: '#666',
  },
  languagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
    padding: '20px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  languageCard: {
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid',
  },
  languageCardValid: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  languageCardInvalid: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  languageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  languageName: {
    fontSize: '16px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  languageStatus: {
    fontSize: '18px',
  },
  languageDetails: {
    fontSize: '13px',
    color: '#666',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  detailLabel: {
    fontWeight: '500',
  },
  detailValue: {
    fontWeight: '700',
    color: '#e74c3c',
  },
  detailsLink: {
    display: 'inline-block',
    marginTop: '10px',
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13px',
  },
  validMessage: {
    color: '#27ae60',
    fontSize: '13px',
    fontWeight: '500',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: '13px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
    fontSize: '16px',
  },
};

export default ValidationDashboard;
