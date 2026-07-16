const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// Find all matches for `term: "..."`
const regex = /term:\s*"([^"]+)"/g;
let match;
const counts = {};

// Count frequencies
while ((match = regex.exec(content)) !== null) {
    const term = match[1];
    counts[term] = (counts[term] || 0) + 1;
}

// Now replace them
const seen = {};
content = content.replace(regex, (fullMatch, term) => {
    if (counts[term] > 1) {
        seen[term] = (seen[term] || 0) + 1;
        // if it's the first occurrence, maybe leave it or append 1? 
        // User says "append 1 or 2". Let's append ` ${seen[term]}` to all of them.
        return `term: "${term} ${seen[term]}"`;
    }
    return fullMatch;
});

fs.writeFileSync('index.html', content);
console.log('Duplicates fixed!');
