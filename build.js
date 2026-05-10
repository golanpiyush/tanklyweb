// build.js — runs during Vercel build to inject environment variables
// into the static index.html before deployment.
//
// Required environment variables (set in Vercel dashboard):
//   SUPABASE_URL       — e.g. https://abcxyz.supabase.co
//   SUPABASE_ANON_KEY  — your project's public anon key

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const supabaseUrl     = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be set as environment variables.');
  process.exit(1);
}

// Replace the CONFIG object with baked-in values
html = html.replace(
  /const CONFIG = \{[\s\S]*?\};/,
  `const CONFIG = {\n    supabaseUrl:     '${supabaseUrl}',\n    supabaseAnonKey: '${supabaseAnonKey}',\n  };`
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('✅ Built index.html with environment variables injected.');