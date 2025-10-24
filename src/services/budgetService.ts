import { Q } from "@nozbe/watermelondb"
import { database } from "@/database"
import MonthlyBudget from "@/database/models/MonthlyBudget"
import { getBudgetPeriod } from "@/utils/budgetPeriod"

export interface BudgetData {
  year: number
  month: number
  budgetAmount: number
  currencyCode: string
  resetDay?: number
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
    resetDay: number = 1,
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
            budget.resetDay = resetDay
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
            budget.resetDay = resetDay
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
   * Get budget for current month (calendar month)
   */
  async getCurrentMonthBudget(): Promise<MonthlyBudget | null> {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    return await this.getBudgetForMonth(year, month)
  },

  /**
   * Set budget for current month (calendar month)
   */
  async setCurrentMonthBudget(
    amount: number,
    currencyCode: string = "VND",
    resetDay: number = 1,
  ): Promise<MonthlyBudget> {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    return await this.setBudgetForMonth(year, month, amount, currencyCode, resetDay)
  },

  /**
   * Get budget for the current budget period based on reset day
   * This is the budget that should be displayed to the user right now
   *
   * @param resetDay - Day of month when budget period starts (1-31, defaults to 1)
   * @returns The budget for the current period, or null if not set
   *
   * @example
   * // If today is Oct 20 and resetDay is 25:
   * // Returns the budget for September (Sept 25 - Oct 24 period)
   */
  async getBudgetForCurrentPeriod(resetDay?: number): Promise<MonthlyBudget | null> {
    try {
      // If no reset day specified, try to get from current month's budget
      if (!resetDay) {
        const currentBudget = await this.getCurrentMonthBudget()
        resetDay = currentBudget?.resetDay || 1
      }

      const period = getBudgetPeriod(new Date(), resetDay)
      return await this.getBudgetForMonth(period.year, period.month)
    } catch (error) {
      console.error("Failed to get budget for current period:", error)
      return null
    }
  },

  /**
   * Set budget for the current budget period
   * This creates/updates the budget for the period we're currently in
   *
   * @param amount - Budget amount in minor units
   * @param currencyCode - Currency code (default: VND)
   * @param resetDay - Day of month when budget period starts (default: 1)
   */
  async setBudgetForCurrentPeriod(
    amount: number,
    currencyCode: string = "VND",
    resetDay: number = 1,
  ): Promise<MonthlyBudget> {
    const period = getBudgetPeriod(new Date(), resetDay)
    return await this.setBudgetForMonth(period.year, period.month, amount, currencyCode, resetDay)
  },
}
