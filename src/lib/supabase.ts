import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

import { authStorage } from "@/features/auth/authStorage";
import { getEnv } from "./env";

const { supabaseUrl, supabaseAnonKey } = getEnv();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});