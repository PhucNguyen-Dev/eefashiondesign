#!/usr/bin/env node
/**
 * Patch @tamagui/constants for React 18.2.0 compatibility
 * 
 * Tamagui 1.135.4 requires React.use() which only exists in React 18.3.0+
 * This script patches all @tamagui/constants files to work with React 18.2.0
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔧 Patching @tamagui/constants for React 18.2.0 compatibility...\n');

// Find all constants files
const findCommand = 'find node_modules/@tamagui -type f \\( -name "constants.js" -o -name "constants.mjs" -o -name "constants.native.js" \\) 2>/dev/null';
const files = execSync(findCommand).toString().trim().split('\n').filter(f => f);

console.log(`Found ${files.length} files`);

let patched = 0;
let skipped = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    
    // Skip if already patched
    if (content.includes('Patched for React 18.2.0')) {
      skipped++;
      return;
    }
    
    let modified = false;
    
    // Pattern 1: import { use } from "react" + const IS_REACT_19 = !!use,
    if (content.includes('import { use } from "react"')) {
      // Remove the import line
      content = content.replace(/import\s*{\s*use\s*}\s*from\s*["']react["'];?\s*\n?/g, '');
      // Replace !!use, with false, (keep the comma!)
      content = content.replace(/const IS_REACT_19 = !!use,/g, 'const IS_REACT_19 = false /* Patched for React 18.2.0 */,');
      modified = true;
    }
    
    // Pattern 2: typeof React.use < "u"
    if (content.includes('typeof React.use')) {
      content = content.replace(
        /const IS_REACT_19 = typeof React\.use < "u"/g,
        'const IS_REACT_19 = false /* Patched for React 18.2.0 */'
      );
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(file, content);
      patched++;
    }
  } catch (e) {
    console.error(`✗ Error patching ${file}: ${e.message}`);
  }
});

console.log(`\n✅ Patch complete!`);
console.log(`   Patched: ${patched} files`);
console.log(`   Skipped: ${skipped} files (already patched)`);
