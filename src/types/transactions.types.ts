// Common type definitions
export {};

// Sync status for offline-first functionality
export type TransactionSyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';
export type CategorySyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

// Transaction types
export type TransactionType = 'income' | 'expense';

// Wallet-related types
export interface WalletAccount {
  id: string;
  name: string;
  address: string;
  balance: number;
  type: 'bitcoin' | 'ethereum' | 'other';
}

export interface Transaction {
  id: string;
  amount: number;
  from: string;
  to: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  hash: string;
}
