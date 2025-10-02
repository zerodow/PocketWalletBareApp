import { create } from "zustand"

export interface MockUser {
  email: string
  name?: string
}

export interface AppStore {
  // Auth state
  isAuthenticated: boolean
  user: MockUser | null

  // Settings state
  themeMode: "light" | "dark" | "system"
  language: string
  currencyCode: string
  defaultTxType: "income" | "expense"

  // Hydration state
  isHydrated: boolean

  // Actions - pure state management only
  setAuthState: (isAuthenticated: boolean, user: MockUser | null) => void
  clearAuthState: () => void
  setThemeMode: (mode: "light" | "dark" | "system") => void
  setLanguage: (language: string) => void
  setCurrencyCode: (currencyCode: string) => void
  setDefaultTxType: (type: "income" | "expense") => void
  setHydrated: (hydrated: boolean) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state - will be hydrated from storage externally
  isAuthenticated: false,
  user: null,
  themeMode: "system",
  language: "en",
  currencyCode: "VND",
  defaultTxType: "expense",
  isHydrated: false,

  // Auth actions - pure state management
  setAuthState: (isAuthenticated: boolean, user: MockUser | null) => {
    set({ isAuthenticated, user })
  },

  clearAuthState: () => {
    if (__DEV__) {
      console.log("🏪 Store: clearAuthState called - setting isAuthenticated: false, user: null")
    }
    set({ isAuthenticated: false, user: null })
    const state = get()
    if (__DEV__) {
      console.log(
        "🏪 Store: after clearAuthState - isAuthenticated:",
        state.isAuthenticated,
        "user:",
        state.user,
      )
    }
  },

  // Settings actions - pure state management
  setThemeMode: (mode: "light" | "dark" | "system") => {
    set({ themeMode: mode })
  },

  setLanguage: (language: string) => {
    set({ language })
  },

  setCurrencyCode: (currencyCode: string) => {
    set({ currencyCode })
  },

  setDefaultTxType: (type: "income" | "expense") => {
    set({ defaultTxType: type })
  },

  // Hydration control
  setHydrated: (hydrated: boolean) => {
    set({ isHydrated: hydrated })
  },
}))
