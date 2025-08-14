import { createClient } from '@supabase/supabase-js';

// --- Supabase Configuration ---
// IMPORTANT: For production, it's recommended to use environment variables
// to keep your credentials secure, rather than hardcoding them here.
// The original code for using environment variables is commented out below for reference.
//
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabaseUrl = 'https://zjalcxefoxisyqcsvpst.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqYWxjeGVmb3hpc3lxY3N2cHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxODc2MDgsImV4cCI6MjA3MDc2MzYwOH0.ijw_xQs06NxXKT5cpEMWv3E9GmuZErYzMO0MGKM4msU';


if (!supabaseUrl || !supabaseAnonKey) {
  // This error check is kept as a safeguard.
  throw new Error("Supabase URL and Anon Key are required and were not found.");
}

// Initialize the Supabase client singleton
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
