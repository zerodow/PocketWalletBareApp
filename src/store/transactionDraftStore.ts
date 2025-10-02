import { create } from "zustand"
import { TransactionType } from "@/types"

export interface TransactionDraft {
  amount: string // String for easier input handling
  type: TransactionType
  categoryId: string
  note: string
  date: number // timestamp
}

interface TransactionDraftStore {
  draft: TransactionDraft
  setField: <K extends keyof TransactionDraft>(field: K, value: TransactionDraft[K]) => void
  reset: () => void
  applySuggestion: (categoryId: string) => void
}

const initialDraft: TransactionDraft = {
  amount: "",
  type: "expense",
  categoryId: "",
  note: "",
  date: Date.now(),
}

export const useTransactionDraftStore = create<TransactionDraftStore>((set) => ({
  draft: initialDraft,

  setField: (field, value) =>
    set((state) => ({
      draft: { ...state.draft, [field]: value },
    })),

  reset: () =>
    set({
      draft: { ...initialDraft, date: Date.now() },
    }),

  applySuggestion: (categoryId) =>
    set((state) => ({
      draft: { ...state.draft, categoryId },
    })),
}))
