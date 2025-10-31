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
      process.env.VITE_BOLT_DATABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZ2pvbm5jaWVtam1iYmV5Z29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDkwMTYsImV4cCI6MjA3NjcyNTAxNn0.SWqk0hje3cHmJlqHd1_CO62P7nqgOuOWxnJ0mBumldM'
    ),
  },
});
