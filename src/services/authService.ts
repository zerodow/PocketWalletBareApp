import { authStorage } from "@/utils/storage"
import { useAppStore } from "@/store/appStore"
import type { MockUser } from "@/store/appStore"

/**
 * Authentication service that handles business logic and storage
 */
export const authService = {
  /**
   * Mock login - accepts any non-empty credentials
   */
  login: async (email: string, password: string): Promise<void> => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Email and password are required")
    }

    const mockUser: MockUser = {
      email: email.trim(),
      name: email.split("@")[0],
    }

    // Update store state
    useAppStore.getState().setAuthState(true, mockUser)

    // Persist to storage
    authStorage.saveAuthState(true, email.trim())
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    if (__DEV__) {
      console.log("🔓 Logout called - clearing auth state...")
    }

    // Clear store state
    useAppStore.getState().clearAuthState()

    // Verify state was cleared
    const { isAuthenticated, user } = useAppStore.getState()
    if (__DEV__) {
      console.log("🔓 After clearAuthState - isAuthenticated:", isAuthenticated, "user:", user)
    }

    // Clear storage
    authStorage.clearAuthState()

    if (__DEV__) {
      console.log("🔓 Logout completed - auth state and storage cleared")
    }
  },

  /**
   * Load auth state from storage and hydrate store
   */
  hydrateAuthFromStorage: (): void => {
    const { isAuthenticated, userEmail } = authStorage.loadAuthState()

    if (isAuthenticated && userEmail) {
      const mockUser: MockUser = {
        email: userEmail,
        name: userEmail.split("@")[0],
      }
      useAppStore.getState().setAuthState(true, mockUser)
    }
  },
}
