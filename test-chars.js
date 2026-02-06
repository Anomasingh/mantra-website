// Testing character codes for different scripts
const devanagari_0 = '०'; // Devanagari zero
const devanagari_9 = '९'; // Devanagari nine
const kannada_0 = '೦'; // Kannada zero
const kannada_9 = '೯'; // Kannada nine
const bengali_0 = '০'; // Bengali zero
const bengali_9 = '৯'; // Bengali nine
const arabic_0 = '٠'; // Arabic-Indic zero
const arabic_9 = '٩'; // Arabic-Indic nine

console.log('Devanagari 0:', devanagari_0, 'Code:', devanagari_0.charCodeAt(0).toString(16));
console.log('Devanagari 9:', devanagari_9, 'Code:', devanagari_9.charCodeAt(0).toString(16));
console.log('Kannada 0:', kannada_0, 'Code:', kannada_0.charCodeAt(0).toString(16));
console.log('Kannada 9:', kannada_9, 'Code:', kannada_9.charCodeAt(0).toString(16));
console.log('Bengali 0:', bengali_0, 'Code:', bengali_0.charCodeAt(0).toString(16));
console.log('Bengali 9:', bengali_9, 'Code:', bengali_9.charCodeAt(0).toString(16));
console.log('Arabic 0:', arabic_0, 'Code:', arabic_0.charCodeAt(0).toString(16));
console.log('Arabic 9:', arabic_9, 'Code:', arabic_9.charCodeAt(0).toString(16));

// Test the verse marker
const verseMarker = '॥೧॥';
console.log('\nVerse marker: ', verseMarker);
console.log('Characters:');
for (let i = 0; i < verseMarker.length; i++) {
  console.log(`  ${i}: ${verseMarker[i]} (U+${verseMarker.charCodeAt(i).toString(16).toUpperCase()})`);
}

// Test if current regex catches it
const symbolOnlyRegex = /^[॥।०-९०-९०-९٠-٩0-9\(\)\[\]\{\}\.,;:!?\-\s"']+$/;
console.log('\nCurrent regex test:', symbolOnlyRegex.test(verseMarker));

// Test with Kannada digits included
const fixedRegex = /^[॥।०-९०-९०-९०-९٠-٩0-9\(\)\[\]\{\}\.,;:!?\-\s"']+$/;
console.log('Fixed regex test:', fixedRegex.test(verseMarker));
