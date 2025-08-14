import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.https://zjalcxefoxisyqcsvpst.supabase.co
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqYWxjeGVmb3hpc3lxY3N2cHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxODc2MDgsImV4cCI6MjA3MDc2MzYwOH0.ijw_xQs06NxXKT5cpEMWv3E9GmuZErYzMO0MGKM4msU

export const supabase = createClient(supabaseUrl, supabaseKey)
