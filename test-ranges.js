// Test proper character ranges
const kannada_1 = '೧'; // Kannada digit 1
const verseMarker = '॥೧॥';

console.log('Kannada 1:', kannada_1, 'Code:', kannada_1.charCodeAt(0), 'Hex:', kannada_1.charCodeAt(0).toString(16));

// Proper Unicode escape ranges
const testRegex1 = /^[॥।\u0966-\u096F\u09E6-\u09EF\u0CE6-\u0CEF\u0660-\u06690-9\(\)\[\]\{\}\.,;:!?\-\s"']+$/;

console.log('\nTesting verse marker:', verseMarker);
console.log('Unicode range regex:', testRegex1.test(verseMarker));
