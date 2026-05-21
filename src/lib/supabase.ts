import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jtnesemibweylqtgchwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bmVzZW1pYndleWxxdGdjaHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MTM1NjUsImV4cCI6MjA2MzM4OTU2NX0.OuWfSPV6_NNpZpTXikPAuRu9bOCGt-Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to generate unique IDs
export const generateId = () => Math.random().toString(36).substr(2, 9);
