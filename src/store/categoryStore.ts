import { create } from "zustand"
import { database } from "@/database"
import Category from "@/database/models/Category"
import { useSyncStore } from "./syncStore"
import { Q } from "@nozbe/watermelondb"

export interface CategoryStoreState {
  categories: Category[]
  loading: boolean
  error: string | null
}

export interface CategoryStoreActions {
  fetchCategories: () => Promise<void>
  addCategory: (data: {
    name: string
    icon: string
    color: string
    isIncome: boolean
  }) => Promise<Category>
  updateCategory: (
    categoryId: string,
    data: { name?: string; icon?: string; color?: string },
  ) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
  reorderCategories: (reorderedCategories: Category[]) => Promise<void>
  getCategoriesByType: (isIncome: boolean) => Category[]
  reset: () => void
}

export type CategoryStore = CategoryStoreState & CategoryStoreActions

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  // State
  categories: [],
  loading: false,
  error: null,

  // Actions
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null })
      const categoriesCollection = database.get<Category>("categories")
      const allCategories = await categoriesCollection
        .query(Q.where("deleted_at", null), Q.sortBy("sort_order", Q.asc))
        .fetch()
      if (__DEV__) {
        console.log("allCategories", allCategories)
      }
      set({ categories: allCategories, loading: false })
    } catch (error) {
      console.error("Error fetching categories:", error)
      set({ error: "Failed to fetch categories", loading: false })
    }
  },

  addCategory: async (data) => {
    try {
      const { categories } = get()
      const maxSortOrder = Math.max(...categories.map((c) => c.sortOrder), 0)

      const newCategory = await database.write(async () => {
        const categoriesCollection = database.get<Category>("categories")
        return await categoriesCollection.create((category) => {
          category.name = data.name
          category.icon = data.icon
          category.color = data.color
          category.isIncome = data.isIncome
          category.sortOrder = maxSortOrder + 1
          category.isDefault = false
          category.categorySyncStatus = "pending"
        })
      })

      // Enqueue sync operation
      useSyncStore.getState().enqueue({
        id: newCategory.id,
        op: "create",
        payload: {
          id: newCategory.id,
          name: data.name,
          icon: data.icon,
          color: data.color,
          isIncome: data.isIncome,
          sortOrder: maxSortOrder + 1,
          isDefault: false,
        },
      })

      // Refresh categories
      await get().fetchCategories()
      return newCategory
    } catch (error) {
      console.error("Error adding category:", error)
      set({ error: "Failed to add category" })
      throw error
    }
  },

  updateCategory: async (categoryId, data) => {
    try {
      const category = await database.get<Category>("categories").find(categoryId)

      await database.write(async () => {
        await category.update((cat) => {
          if (data.name !== undefined) cat.name = data.name
          if (data.icon !== undefined) cat.icon = data.icon
          if (data.color !== undefined) cat.color = data.color
          cat.categorySyncStatus = "pending"
        })
      })

      // Enqueue sync operation
      useSyncStore.getState().enqueue({
        id: categoryId,
        op: "update",
        payload: {
          id: categoryId,
          ...data,
        },
      })

      // Refresh categories
      await get().fetchCategories()
    } catch (error) {
      console.error("Error updating category:", error)
      set({ error: "Failed to update category" })
      throw error
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const category = await database.get<Category>("categories").find(categoryId)

      if (category.isDefault) {
        throw new Error("Cannot delete default categories")
      }

      await database.write(async () => {
        await category.update((cat) => {
          cat.deletedAt = Date.now()
          cat.categorySyncStatus = "pending"
        })
      })

      // Enqueue sync operation
      useSyncStore.getState().enqueue({
        id: categoryId,
        op: "delete",
        payload: { id: categoryId },
      })

      // Refresh categories
      await get().fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
      set({ error: "Failed to delete category" })
      throw error
    }
  },

  reorderCategories: async (reorderedCategories) => {
    try {
      await database.write(async () => {
        const updatePromises = reorderedCategories.map((category, index) =>
          category.update((cat) => {
            cat.sortOrder = index
            cat.categorySyncStatus = "pending"
          }),
        )
        await Promise.all(updatePromises)
      })

      // Enqueue sync operations for reordered categories
      const syncOperations = reorderedCategories.map((category, index) => ({
        id: category.id,
        op: "update" as const,
        payload: {
          id: category.id,
          sortOrder: index,
        },
      }))

      const syncStore = useSyncStore.getState()
      syncOperations.forEach((op) => syncStore.enqueue(op))

      // Refresh categories
      await get().fetchCategories()
    } catch (error) {
      console.error("Error reordering categories:", error)
      set({ error: "Failed to reorder categories" })
      throw error
    }
  },

  getCategoriesByType: (isIncome: boolean) => {
    const { categories } = get()
    return categories.filter((category) => category.isIncome === isIncome)
  },

  reset: () => {
    set({
      categories: [],
      loading: false,
      error: null,
    })
  },
}))
