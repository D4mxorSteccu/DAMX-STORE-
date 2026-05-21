import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wopjstgdtuuwxcfvhfcx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvcGpzdGdkdHV1d3hjZnZoZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MzY0MTUsImV4cCI6MjA2MzIxMjQxNX0.hsU7lvnT_WXlqttbthnDxRg_jOGxVWp';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to generate unique IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);
