// build.js — runs during Vercel build to inject environment variables
// into static HTML files before deployment.
//
// Required environment variables (set in Vercel dashboard):
//   SUPABASE_URL       — e.g. https://abcxyz.supabase.co
//   SUPABASE_ANON_KEY  — your project's public anon key
//   RESEND_API_KEY     — your Resend API key (re_xxx...)
const fs   = require('fs');
const path = require('path');
const SUPABASE_URL      = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const RESEND_API_KEY    = process.env.RESEND_API_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be set.');
  process.exit(1);
}
if (!RESEND_API_KEY) {
  console.error('ERROR: RESEND_API_KEY must be set.');
  process.exit(1);
}
function patchFile(filename, replacements) {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`WARN: ${filename} not found, skipping.`);
    return;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.replaceAll(placeholder, value);
    if (html.includes(placeholder)) {
      console.error(`ERROR: Placeholder ${placeholder} still present in ${filename} after replacement.`);
      process.exit(1);
    }
  }
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅  Patched ${filename}`);
}
// Patch index.html (Supabase creds)
patchFile('index.html', {
  '__SUPABASE_URL__':      SUPABASE_URL,
  '__SUPABASE_ANON_KEY__': SUPABASE_ANON_KEY,
});
// Patch waitlist-ios.html (Supabase creds)
patchFile('waitlist-ios.html', {
  '__SUPABASE_URL__':      SUPABASE_URL,
  '__SUPABASE_ANON_KEY__': SUPABASE_ANON_KEY,
});
// Patch submit-request.html (Resend key)
patchFile('submit_request.html', {
  '__RESEND_API_KEY__': RESEND_API_KEY,
});
console.log('');
console.log('Build summary:');
console.log(`  SUPABASE_URL      → ${SUPABASE_URL}`);
console.log(`  SUPABASE_ANON_KEY → ${SUPABASE_ANON_KEY.slice(0, 20)}…`);
console.log(`  RESEND_API_KEY    → ${RESEND_API_KEY.slice(0, 12)}…`);
