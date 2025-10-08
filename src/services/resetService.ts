import { unifiedStorage } from '@/storage';
import { database } from '@/database';
import { authService } from './authService';

/**
 * Reset/cleanup operations for data management settings
 */
export const resetService = {
  /**
   * Clear non-critical caches/placeholders. Intentionally a no-op for now to preserve data.
   */
  async clearCacheSafe(): Promise<void> {
    // Placeholder: implement specific cache cleanup if added in future (e.g., image caches, temp files).
    return;
  },

  /**
   * Full reset: clears MMKV (non-secure), secure tokens, WatermelonDB, and auth state.
   */
  async fullReset(): Promise<void> {
    try {
      // Logout to clear store state + auth storage
      await authService.logout();

      // Clear settings and other MMKV state
      unifiedStorage.settings.clearSettings();
      unifiedStorage.base.clearAll();

      // Clear tokens (no-op since we're using MMKV only)
      await unifiedStorage.tokens.clearAllTokens();

      // Reset database
      await database.write(async () => {
        // Unsafe reset wipes all tables; acceptable for explicit reset
        // @ts-ignore - method exists on adapter DB
        await database.unsafeResetDatabase();
      });
    } catch (e) {
      console.error('Full reset error', e);
      throw e;
    }
  },
};
