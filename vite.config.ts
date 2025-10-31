import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'import.meta.env.VITE_BOLT_DATABASE_URL': JSON.stringify(
      process.env.VITE_BOLT_DATABASE_URL || 'https://ujgjonnciemjmbbeygod.supabase.co'
    ),
    'import.meta.env.VITE_BOLT_DATABASE_ANON_KEY': JSON.stringify(
      process.env.VITE_BOLT_DATABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3eWxsdmJkY3BwbGNicnFzdm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDg5NzcsImV4cCI6MjA3NjcyNDk3N30.E775d9UFKrQmDphceFlkeFwbaK9Qib6YJWXhFUZCvCQ'
    ),
  },
});
