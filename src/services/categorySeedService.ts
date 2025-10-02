import { database } from "@/database"
import Category from "@/database/models/Category"
import { Q } from "@nozbe/watermelondb"

const DEFAULT_VIETNAMESE_CATEGORIES = [
  // Expense categories
  { name: "Ăn uống", icon: "🍔", color: "#FF6B6B", isIncome: false },
  { name: "Đi lại", icon: "🚗", color: "#4ECDC4", isIncome: false },
  { name: "Mua sắm", icon: "🛒", color: "#45B7D1", isIncome: false },
  { name: "Tiền nhà", icon: "🏠", color: "#96CEB4", isIncome: false },
  { name: "Điện nước", icon: "⚡", color: "#FFEAA7", isIncome: false },
  { name: "Y tế", icon: "🏥", color: "#FF7675", isIncome: false },
  { name: "Giải trí", icon: "🎬", color: "#A29BFE", isIncome: false },
  { name: "Giáo dục", icon: "📚", color: "#6C5CE7", isIncome: false },
  { name: "Quần áo", icon: "👕", color: "#FD79A8", isIncome: false },
  { name: "Khác", icon: "📋", color: "#636E72", isIncome: false },

  // Income categories
  { name: "Lương", icon: "💰", color: "#00B894", isIncome: true },
  { name: "Thưởng", icon: "🎉", color: "#00CEC9", isIncome: true },
  { name: "Đầu tư", icon: "📈", color: "#74B9FF", isIncome: true },
  { name: "Quà tặng", icon: "🎁", color: "#FD79A8", isIncome: true },
  { name: "Thu nhập khác", icon: "💵", color: "#FDCB6E", isIncome: true },
]

export const categorySeedService = {
  /**
   * Seeds the default Vietnamese categories if they don't exist
   * This function is idempotent - safe to call multiple times
   */
  seedDefaultCategories: async (): Promise<void> => {
    try {
      if (__DEV__) {
        console.log("Checking if default categories need to be seeded...")
      }

      // Check if any default categories already exist
      const categoriesCollection = database.get<Category>("categories")
      const existingDefaultCategories = await categoriesCollection
        .query(Q.where("is_default", true))
        .fetch()

      if (existingDefaultCategories.length > 0) {
        if (__DEV__) {
          console.log("Default categories already exist, skipping seeding")
        }
        return
      }

      if (__DEV__) {
        console.log("Seeding default Vietnamese categories...")
      }

      // Create all default categories in a single transaction
      await database.write(async () => {
        const createPromises = DEFAULT_VIETNAMESE_CATEGORIES.map((categoryData, index) =>
          categoriesCollection.create((category) => {
            category.name = categoryData.name
            category.icon = categoryData.icon
            category.color = categoryData.color
            category.isIncome = categoryData.isIncome
            category.sortOrder = index
            category.isDefault = true
            category.categorySyncStatus = "synced" // Default categories don't need to sync
          }),
        )

        await Promise.all(createPromises)
      })

      if (__DEV__) {
        console.log(
          `Successfully seeded ${DEFAULT_VIETNAMESE_CATEGORIES.length} default categories`,
        )
      }
    } catch (error) {
      console.error("Error seeding default categories:", error)
      // Don't throw error to prevent app initialization from failing
    }
  },

  /**
   * Get the list of default categories for reference
   */
  getDefaultCategoriesData: () => DEFAULT_VIETNAMESE_CATEGORIES,
}
