// build.js — runs during Vercel build to inject environment variables
// into the static index.html before deployment.
//
// Required environment variables (set in Vercel dashboard):
//   SUPABASE_URL             — e.g. https://abcxyz.supabase.co
//   SUPABASE_PUBLIC_ANON_KEY — your project's public anon key (publishable)

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

const supabaseUrl     = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_PUBLIC_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_PUBLIC_ANON_KEY must be set as environment variables.');
  process.exit(1);
}

// Simple placeholder replacement — matches exactly what's in index.html
html = html.replace('__SUPABASE_URL__',      supabaseUrl);
html = html.replace('__SUPABASE_ANON_KEY__', supabaseAnonKey);

// Verify the replacements actually happened
if (html.includes('__SUPABASE_URL__') || html.includes('__SUPABASE_ANON_KEY__')) {
  console.error('ERROR: Placeholder replacement failed — placeholders still present in output.');
  process.exit(1);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('✅ Built index.html with environment variables injected.');
console.log(`   SUPABASE_URL             → ${supabaseUrl}`);
console.log(`   SUPABASE_PUBLIC_ANON_KEY → ${supabaseAnonKey.slice(0, 20)}...`);
