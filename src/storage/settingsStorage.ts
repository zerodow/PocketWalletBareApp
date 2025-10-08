import { storage } from '@/utils/storage';

// Storage keys for settings
const SETTINGS_KEYS = {
  THEME_MODE: 'settings_themeMode',
  LANGUAGE: 'settings_language',
  CURRENCY_CODE: 'settings_currencyCode',
  DEFAULT_TX_TYPE: 'settings_defaultTxType',
} as const;

// Type definitions
export interface StoredSettings {
  themeMode: 'light' | 'dark' | 'system';
  language: string;
  currencyCode: string;
  defaultTxType: 'income' | 'expense';
}

/**
 * Settings storage adapter
 * Handles app settings persistence using MMKV
 */
export const settingsStorage = {
  /**
   * Save theme mode to storage
   */
  saveThemeMode: (themeMode: 'light' | 'dark' | 'system'): void => {
    storage.set(SETTINGS_KEYS.THEME_MODE, themeMode);
  },

  /**
   * Save language to storage
   */
  saveLanguage: (language: string): void => {
    storage.set(SETTINGS_KEYS.LANGUAGE, language);
  },

  /**
   * Save currency code to storage
   */
  saveCurrency: (currencyCode: string): void => {
    storage.set(SETTINGS_KEYS.CURRENCY_CODE, currencyCode);
  },

  /**
   * Save default transaction type to storage
   */
  saveDefaultTxType: (type: 'income' | 'expense'): void => {
    storage.set(SETTINGS_KEYS.DEFAULT_TX_TYPE, type);
  },

  /**
   * Load all settings from storage
   */
  loadSettings: (): StoredSettings => {
    const themeMode =
      (storage.getString(SETTINGS_KEYS.THEME_MODE) as
        | 'light'
        | 'dark'
        | 'system') || 'system';
    const language = storage.getString(SETTINGS_KEYS.LANGUAGE) || 'en';
    const currencyCode =
      storage.getString(SETTINGS_KEYS.CURRENCY_CODE) || 'VND';
    const defaultTxType =
      (storage.getString(SETTINGS_KEYS.DEFAULT_TX_TYPE) as
        | 'income'
        | 'expense') || 'expense';

    return {
      themeMode,
      language,
      currencyCode,
      defaultTxType,
    };
  },

  /**
   * Clear all settings from storage
   */
  clearSettings: (): void => {
    storage.delete(SETTINGS_KEYS.THEME_MODE);
    storage.delete(SETTINGS_KEYS.LANGUAGE);
    storage.delete(SETTINGS_KEYS.CURRENCY_CODE);
    storage.delete(SETTINGS_KEYS.DEFAULT_TX_TYPE);
  },
};
