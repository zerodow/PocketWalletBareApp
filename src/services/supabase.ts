import { createClient } from "@supabase/supabase-js"
import { AppState } from "react-native"
import { secureStorage } from "../utils/storage"

// You'll need to update these with your actual Supabase project details
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase environment variables are not set")
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Handle app state changes for better session management
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
