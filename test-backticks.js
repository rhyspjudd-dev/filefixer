// Test backticks
const testString = '##Lowercase## (`myfilename.jpg`) filenames are strongly recommended';
console.log('Original string:', testString);

// Test the regex
const regex = /(`[^`]+`)/g;
const parts = testString.split(regex);
console.log('Parts:', parts);

parts.forEach((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
        console.log(`Found backtick part at index ${index}:`, part);
        console.log('Character codes:', Array.from(part).map(char => char.charCodeAt(0)));
    }
});
