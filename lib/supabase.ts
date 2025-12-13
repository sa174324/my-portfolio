import { createClient } from '@supabase/supabase-js';

// 加上 || "" 是為了讓它在找不到變數時，至少塞個空字串，不要報錯
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);