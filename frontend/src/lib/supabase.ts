import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnpualosfngrmihbvgbb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucHVhbG9zZm5ncm1paGJ2Z2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTMwMDMsImV4cCI6MjA3NDM2OTAwM30.gB2AxTRR7GxKlFWu0Fl2pLwabnAwW7QDRJ3OxE58eVI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching the Supabase schema
export interface SupabaseProject {
  id: string;
  company: string;
  sourcer: string;
  group_type: 'Israel' | 'Global';
  model_type: 'Hourly' | 'Success' | 'Success Executive';
  roles: string | null;
  roles_count: number;
  hours_or_hires: number | null;
  start_date: string | null;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}
