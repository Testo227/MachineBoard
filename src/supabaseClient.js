import { createClient } from '@supabase/supabase-js'

//URL und den Anon-Key aus der .env Datei
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Prüfen, ob die Variablen geladen wurden

export const supabase = createClient(supabaseUrl, supabaseAnonKey);