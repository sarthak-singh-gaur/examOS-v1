const fs = require('fs');
const path = 'd:/dev/code/personal projects/examOS-v1/frontend/src/data/dsa_data.json';

try {
    let content = fs.readFileSync(path, 'utf8');
    
    // 1. Double escape backslashes that are followed by characters not part of standard JSON escapes
    // Standard JSON escapes: \" \\ \/ \b \f \n \r \t \uXXXX
    // We want to turn \Omega into \\Omega
    // This regex looks for a single backslash NOT followed by one of the valid escaped chars
    content = content.replace(/\\(?![bfnrtv"\\\/]|u[0-9a-fA-F]{4})/g, '\\\\');

    // 2. Validate it
    const parsed = JSON.parse(content);
    
    // 3. Save it back prettified
    fs.writeFileSync(path, JSON.stringify(parsed, null, 2), 'utf8');
    console.log('DSA Data Repaired and Prettified!');
} catch (e) {
    console.error('Repair failed:', e.message);
    // If it failed at a specific position, let's see context
    if (e.message.includes('position')) {
        const pos = parseInt(e.message.match(/position (\d+)/)[1]);
        const start = Math.max(0, pos - 50);
        const end = Math.min(content.length, pos + 50);
        console.log('Context around error:');
        console.log(content.substring(start, end));
    }
}
