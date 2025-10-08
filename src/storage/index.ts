import { storage } from '@/utils/storage';
import { authStorage } from './authStorage';
import { settingsStorage } from './settingsStorage';

// Re-export individual adapters
export { authStorage } from './authStorage';
export { settingsStorage } from './settingsStorage';

// Re-export types
export type { StoredAuthData } from './authStorage';
export type { StoredSettings } from './settingsStorage';

/**
 * Unified storage interface for reset operations and complex workflows
 */
export const unifiedStorage = {
  // Individual adapters
  auth: authStorage,
  settings: settingsStorage,

  // Base storage operations
  base: {
    clearAll: (): void => {
      storage.clearAll();
    },
    delete: (key: string): void => {
      storage.delete(key);
    },
  },

  // Legacy token operations (MMKV only, no Supabase)
  tokens: {
    clearAllTokens: async (): Promise<void> => {
      // Since we're using MMKV only and no longer have separate token storage,
      // this is a no-op placeholder for backward compatibility
      // In the future, if we add token storage, we can implement it here
      return Promise.resolve();
    },
  },
};

// Default export for convenience
export default {
  auth: authStorage,
  settings: settingsStorage,
  unified: unifiedStorage,
};
