const fs = require('fs');

function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    
    // 1. Restore unintended control characters
    // My previous script accidentally inserted literal tabs into strings
    let fixed = str
        .replace(/\t/g, '\\text') // Tab was almost certainly \text macro
        .replace(/\r/g, '\\rightarrow') // \r was usually \rightarrow
        .replace(/\f/g, '\\forall');  // \f was usually \forall
    
    // 2. Fix over-escaping of delimiters
    // Convert \\$ to $ so markdown detects the math block correctly
    fixed = fixed.replace(/\\\\\$/g, '$');
    
    // 3. Normalize LaTeX macros: convert \\macro to \macro
    // This ensures that after JSON.stringify, they are stored as \\macro in the file.
    fixed = fixed.replace(/\\\\([a-zA-Z]+)/g, '\\$1');
    
    // 4. Specifically fix roster braces \{ and \}
    // If they were over-escaped to \\\{, convert them to \{
    fixed = fixed.replace(/\\\\\{/g, '\\{');
    fixed = fixed.replace(/\\\\/g, '\\');
    
    // 5. Final pass: Ensure no literal doubled-doubled backslashes remain
    // We want the string value to contain single backslashes for all LaTeX.
    while (fixed.includes('\\\\')) {
        fixed = fixed.replace(/\\\\/g, '\\');
    }

    return fixed;
}

function traverse(obj) {
    if (Array.isArray(obj)) {
        return obj.map(traverse);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            newObj[key] = traverse(obj[key]);
        }
        return newObj;
    } else if (typeof obj === 'string') {
        return sanitizeString(obj);
    }
    return obj;
}

const files = [
    'd:/dev/code/personal projects/examOS-v1/frontend/src/data/maths_data.json',
    'd:/dev/code/personal projects/examOS-v1/frontend/src/data/co_data.json'
];

files.forEach(f => {
    try {
        const raw = fs.readFileSync(f, 'utf8');
        const data = JSON.parse(raw);
        const sanitized = traverse(data);
        fs.writeFileSync(f, JSON.stringify(sanitized, null, 2), 'utf8');
        console.log(`Sanitized ${f}`);
    } catch (e) {
        console.error(`Error processing ${f}: ${e.message}`);
    }
});
