// ============================================================
// COZY NEST — Supabase Config
// Replace the two values below with your own from:
// Supabase Dashboard > Settings > API
// ============================================================

const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY';

// ── Supabase client (loaded via CDN in index.html) ──────────
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Shorthand helpers ────────────────────────────────────────
const db = {
  from: (t) => sb.from(t),
  auth: sb.auth,
  channel: (n) => sb.channel(n),
};
