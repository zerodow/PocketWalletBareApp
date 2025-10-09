import { Q } from "@nozbe/watermelondb"
import { database } from "@/database"
import MonthlyBudget from "@/database/models/MonthlyBudget"

export interface BudgetData {
  year: number
  month: number
  budgetAmount: number
  currencyCode: string
}

/**
 * Budget service for managing monthly budgets
 */
export const budgetService = {
  /**
   * Get budget for a specific month
   */
  async getBudgetForMonth(year: number, month: number): Promise<MonthlyBudget | null> {
    try {
      const budgets = await database
        .get<MonthlyBudget>("monthly_budgets")
        .query(Q.where("year", year), Q.where("month", month))
        .fetch()

      return budgets.length > 0 ? budgets[0] : null
    } catch (error) {
      console.error("Failed to get budget for month:", error)
      return null
    }
  },

  /**
   * Set or update budget for a specific month
   */
  async setBudgetForMonth(
    year: number,
    month: number,
    amount: number,
    currencyCode: string = "VND",
  ): Promise<MonthlyBudget> {
    try {
      // Check if budget already exists
      const existingBudget = await this.getBudgetForMonth(year, month)

      if (existingBudget) {
        // Update existing budget
        return await database.write(async () => {
          return await existingBudget.update((budget) => {
            budget.budgetAmount = amount
            budget.currencyCode = currencyCode
          })
        })
      } else {
        // Create new budget
        return await database.write(async () => {
          return await database.get<MonthlyBudget>("monthly_budgets").create((budget) => {
            budget._raw.id = MonthlyBudget.generateId(year, month)
            budget.year = year
            budget.month = month
            budget.budgetAmount = amount
            budget.currencyCode = currencyCode
          })
        })
      }
    } catch (error) {
      console.error("Failed to set budget for month:", error)
      throw error
    }
  },

  /**
   * Delete budget for a specific month
   */
  async deleteBudgetForMonth(year: number, month: number): Promise<void> {
    try {
      const budget = await this.getBudgetForMonth(year, month)
      if (budget) {
        await database.write(async () => {
          await budget.destroyPermanently()
        })
      }
    } catch (error) {
      console.error("Failed to delete budget for month:", error)
      throw error
    }
  },

  /**
   * Get budget for current month
   */
  async getCurrentMonthBudget(): Promise<MonthlyBudget | null> {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    return await this.getBudgetForMonth(year, month)
  },

  /**
   * Set budget for current month
   */
  async setCurrentMonthBudget(amount: number, currencyCode: string = "VND"): Promise<MonthlyBudget> {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    return await this.setBudgetForMonth(year, month, amount, currencyCode)
  },
}
