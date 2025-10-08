import { storage } from '@/utils/storage';

// Storage keys for authentication
const AUTH_KEYS = {
  IS_AUTHENTICATED: 'auth_isAuthenticated',
  USER_EMAIL: 'auth_userEmail',
} as const;

// Type definitions
export interface StoredAuthData {
  isAuthenticated: boolean;
  userEmail?: string;
}

/**
 * Authentication storage adapter
 * Handles authentication state persistence using MMKV
 */
export const authStorage = {
  /**
   * Save authentication state to storage
   */
  saveAuthState: (isAuthenticated: boolean, userEmail?: string): void => {
    storage.set(AUTH_KEYS.IS_AUTHENTICATED, isAuthenticated);
    if (userEmail) {
      storage.set(AUTH_KEYS.USER_EMAIL, userEmail);
    }
  },

  /**
   * Load authentication state from storage
   */
  loadAuthState: (): StoredAuthData => {
    const isAuthenticated =
      storage.getBoolean(AUTH_KEYS.IS_AUTHENTICATED) ?? false;
    const userEmail = storage.getString(AUTH_KEYS.USER_EMAIL);

    return {
      isAuthenticated: isAuthenticated && !!userEmail,
      userEmail: userEmail || undefined,
    };
  },

  /**
   * Clear authentication data from storage
   */
  clearAuthState: (): void => {
    storage.delete(AUTH_KEYS.IS_AUTHENTICATED);
    storage.delete(AUTH_KEYS.USER_EMAIL);
  },
};
