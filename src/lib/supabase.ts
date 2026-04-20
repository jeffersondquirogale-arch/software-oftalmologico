    import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vpdtereegwgifeeomtsx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZHRlcmVlZ3dnaWZlZW9tdHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MzE2MTEsImV4cCI6MjA5MTAwNzYxMX0.FjSuJNkbZS5m-OEn0JxC1MEbYgrQA1oPS_ROl_HBzEQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
