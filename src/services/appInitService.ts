import { authService } from './authService';
import { settingsService } from './settingsService';
import { categorySeedService } from './categorySeedService';
import { useAppStore } from '@/store/appStore';

/**
 * App initialization service that handles startup hydration
 */
export const appInitService = {
  /**
   * Initialize app state from storage and seed default data
   */
  initializeApp: async (): Promise<void> => {
    try {
      // Hydrate auth state
      authService.hydrateAuthFromStorage();

      // Hydrate settings
      settingsService.hydrateSettingsFromStorage();

      // Seed default categories (idempotent)
      await categorySeedService.seedDefaultCategories();

      // [DEV ONLY] Seed mock data
      if (__DEV__) {
        // await devDataSeedService.seedMockTransactions();
      }

      // Mark as hydrated
      useAppStore.getState().setHydrated(true);
    } catch (error) {
      console.error('Failed to initialize app from storage:', error);
      // Still mark as hydrated to prevent loading state from hanging
      useAppStore.getState().setHydrated(true);
    }
  },
};
