// ============================================================
// COZY NEST — Supabase Config
// Replace the two values below with your own from:
// Supabase Dashboard > Settings > API
// ============================================================

const SUPABASE_URL  = 'https://pjpjgyhsavubkzprnmza.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcGpneWhzYXZ1Ymt6cHJubXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjIzNjMsImV4cCI6MjA5MzU5ODM2M30.Pw4vJ0ts4J-tUBQUD1KfrYx4MlwMs87j6kfJpvsiwlY';

// ── Supabase client (loaded via CDN in index.html) ──────────
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Shorthand helpers ────────────────────────────────────────
const db = {
  from: (t) => sb.from(t),
  auth: sb.auth,
  channel: (n) => sb.channel(n),
};
