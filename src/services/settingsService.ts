import { settingsStorage } from '@/storage';
import { useAppStore } from '@/store/appStore';
import { i18n } from '@/i18n';

/**
 * Settings service that handles business logic and storage
 */
export const settingsService = {
  /**
   * Update theme mode
   */
  setThemeMode: (mode: 'light' | 'dark' | 'system'): void => {
    // Update store state
    useAppStore.getState().setThemeMode(mode);

    // Persist to storage
    settingsStorage.saveThemeMode(mode);
  },

  /**
   * Update language
   */
  setLanguage: (language: string): void => {
    // Update store state
    useAppStore.getState().setLanguage(language);

    // Persist to storage
    settingsStorage.saveLanguage(language);

    // Update i18n runtime language
    try {
      i18n.changeLanguage(language);
    } catch (e) {
      console.warn('i18n changeLanguage failed', e);
    }
  },

  /** Update currency */
  setCurrency: (currencyCode: string): void => {
    useAppStore.getState().setCurrencyCode(currencyCode);
    settingsStorage.saveCurrency(currencyCode);
  },

  /** Update default transaction type */
  setDefaultTxType: (type: 'income' | 'expense'): void => {
    useAppStore.getState().setDefaultTxType(type);
    settingsStorage.saveDefaultTxType(type);
  },

  /**
   * Load settings from storage and hydrate store
   */
  hydrateSettingsFromStorage: (): void => {
    const { themeMode, language, currencyCode, defaultTxType } =
      settingsStorage.loadSettings();

    useAppStore.getState().setThemeMode(themeMode);
    useAppStore.getState().setLanguage(language);
    useAppStore.getState().setCurrencyCode(currencyCode);
    useAppStore.getState().setDefaultTxType(defaultTxType);

    // Ensure i18n uses the stored language
    try {
      i18n.changeLanguage(language);
    } catch {}
  },
};
