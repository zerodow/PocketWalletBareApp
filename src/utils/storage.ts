import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const STORAGE_KEY = {
  KEYCHAIN_PASSKEY: 'mmkv',
  USER_ROLE: 'user_role',
  DEBUG_MODE: 'app_debug_mode',
};

export const storage = new MMKV({
  id: '@pocket_wallet_app',
  encryptionKey: 'e2f7c0a8d5b47391f1c02a8b715e7345',
});

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key: string): string | null {
  try {
    return storage.getString(key) ?? null;
  } catch {
    // not sure why this would fail... even reading the RN docs I'm unclear
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key: string, value: string): boolean {
  try {
    storage.set(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from storage and runs it thru JSON.parse.
 *
 * @param key The key to fetch.
 */
export function load<T>(key: string): T | null {
  let almostThere: string | null = null;
  try {
    almostThere = loadString(key);
    return JSON.parse(almostThere ?? '') as T;
  } catch {
    return (almostThere as T) ?? null;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save(key: string, value: unknown): boolean {
  try {
    saveString(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Saves a boolean value to storage.
 *
 * @param key The key to fetch.
 * @param value The boolean value to store.
 */
export function saveBoolean(key: string, value: boolean): boolean {
  try {
    storage.set(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads a boolean value from storage.
 *
 * @param key The key to fetch.
 */
export function loadBoolean(key: string): boolean | null {
  try {
    return storage.getBoolean(key) ?? null;
  } catch {
    return null;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key: string): void {
  try {
    storage.delete(key);
  } catch {}
}

/**
 * Burn it all to the ground.
 */
export function clear(): void {
  try {
    storage.clearAll();
  } catch {}
}

export const zustandStorage: StateStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value !== undefined ? value : null;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};
