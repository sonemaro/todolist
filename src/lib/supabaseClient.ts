import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_BOLT_DATABASE_URL
const anon = import.meta.env.VITE_BOLT_DATABASE_ANON_KEY

if (!url || !anon) {
  console.error('[auth] Missing ENV. Set VITE_BOLT_DATABASE_URL / VITE_BOLT_DATABASE_ANON_KEY')
}

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})
