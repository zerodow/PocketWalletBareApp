import { create } from "zustand"
import NetInfo from "@react-native-community/netinfo"

export type SyncOperation = {
  id: string
  op: "create" | "update" | "delete"
  payload: any
  retries: number
  lastRetryAt?: number
}

interface SyncStore {
  // Connection state
  isOnline: boolean
  isSyncing: boolean
  syncedCount: number
  lastError?: string

  // Queue management
  queue: SyncOperation[]

  // Actions
  setOnline: (online: boolean) => void
  enqueue: (operation: Omit<SyncOperation, "retries">) => void
  dequeue: (operationId: string) => void
  process: () => Promise<void>
  markSynced: (operationId: string) => void
  markFailed: (operationId: string, error: string) => void
  clearError: () => void

  // Initialization
  initialize: () => void
}

const MAX_RETRIES = 3
const INITIAL_BACKOFF_MS = 1000
const MAX_BACKOFF_MS = 30000

export const useSyncStore = create<SyncStore>((set, get) => ({
  isOnline: true,
  isSyncing: false,
  syncedCount: 0,
  lastError: undefined,
  queue: [],

  setOnline: (online) => set({ isOnline: online }),

  enqueue: (operation) =>
    set((state) => ({
      queue: [...state.queue, { ...operation, retries: 0 }],
    })),

  dequeue: (operationId) =>
    set((state) => ({
      queue: state.queue.filter((op) => op.id !== operationId),
    })),

  process: async () => {
    const { isOnline, isSyncing, queue } = get()

    if (!isOnline || isSyncing || queue.length === 0) {
      return
    }

    set({ isSyncing: true })
    let syncedCount = 0

    try {
      for (const operation of [...queue]) {
        const now = Date.now()

        // Check if we should retry based on backoff
        if (operation.lastRetryAt) {
          const backoffMs = Math.min(
            INITIAL_BACKOFF_MS * Math.pow(2, operation.retries),
            MAX_BACKOFF_MS,
          )

          if (now - operation.lastRetryAt < backoffMs) {
            continue
          }
        }

        try {
          // TODO: Implement actual API calls based on operation.op
          if (__DEV__) {
            console.log("Processing sync operation:", operation)
          }

          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 100))

          // Mark as synced and remove from queue
          get().markSynced(operation.id)
          syncedCount++
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error"

          if (operation.retries < MAX_RETRIES) {
            // Retry with backoff
            set((state) => ({
              queue: state.queue.map((op) =>
                op.id === operation.id ? { ...op, retries: op.retries + 1, lastRetryAt: now } : op,
              ),
            }))
          } else {
            // Max retries reached, mark as failed
            get().markFailed(operation.id, errorMessage)
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sync process failed"
      set({ lastError: errorMessage })
    } finally {
      set((state) => ({
        isSyncing: false,
        syncedCount: state.syncedCount + syncedCount,
      }))
    }
  },

  markSynced: (operationId) =>
    set((state) => ({
      queue: state.queue.filter((op) => op.id !== operationId),
    })),

  markFailed: (operationId, error) =>
    set((state) => ({
      queue: state.queue.filter((op) => op.id !== operationId),
      lastError: error,
    })),

  clearError: () => set({ lastError: undefined }),

  initialize: () => {
    // Set up network listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected ?? false
      get().setOnline(isOnline)

      // Auto-process queue when coming online
      if (isOnline) {
        setTimeout(() => get().process(), 1000)
      }
    })

    // Initial network check
    NetInfo.fetch().then((state) => {
      get().setOnline(state.isConnected ?? false)
    })

    return unsubscribe
  },
}))
