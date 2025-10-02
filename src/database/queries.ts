import { Q } from "@nozbe/watermelondb"
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns"

import { database, Category, Transaction } from "./index"

/**
 * Query utilities for optimized database operations
 */
export const DatabaseQueries = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    return await database.get<Category>("categories").query().fetch()
  },

  /**
   * Get categories by type (income/expense)
   */
  async getCategoriesByType(isIncome: boolean): Promise<Category[]> {
    return await database.get<Category>("categories").query(Q.where("is_income", isIncome)).fetch()
  },

  /**
   * Get transactions for a specific month (optimized with indexed query)
   */
  async getTransactionsForMonth(year: number, month: number): Promise<Transaction[]> {
    const startDate = startOfMonth(new Date(year, month - 1))
    const endDate = endOfMonth(new Date(year, month - 1))

    return await database
      .get<Transaction>("transactions")
      .query(
        Q.where("occurred_at", Q.gte(startDate.getTime())),
        Q.where("occurred_at", Q.lte(endDate.getTime())),
        Q.sortBy("occurred_at", Q.desc),
      )
      .fetch()
  },

  /**
   * Get transactions for a specific day
   */
  async getTransactionsForDay(date: Date): Promise<Transaction[]> {
    const startDate = startOfDay(date)
    const endDate = endOfDay(date)

    return await database
      .get<Transaction>("transactions")
      .query(
        Q.where("occurred_at", Q.gte(startDate.getTime())),
        Q.where("occurred_at", Q.lte(endDate.getTime())),
        Q.sortBy("occurred_at", Q.desc),
      )
      .fetch()
  },

  /**
   * Get transactions for a specific category
   */
  async getTransactionsByCategory(categoryId: string): Promise<Transaction[]> {
    return await database
      .get<Transaction>("transactions")
      .query(Q.where("category_id", categoryId), Q.sortBy("occurred_at", Q.desc))
      .fetch()
  },

  /**
   * Get recent transactions (last N transactions)
   */
  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    return await database
      .get<Transaction>("transactions")
      .query(Q.sortBy("occurred_at", Q.desc), Q.take(limit))
      .fetch()
  },

  /**
   * Get transactions in a date range
   */
  async getTransactionsInRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await database
      .get<Transaction>("transactions")
      .query(
        Q.where("occurred_at", Q.gte(startDate.getTime())),
        Q.where("occurred_at", Q.lte(endDate.getTime())),
        Q.sortBy("occurred_at", Q.desc),
      )
      .fetch()
  },

  /**
   * Search transactions by description
   */
  async searchTransactions(searchTerm: string): Promise<Transaction[]> {
    return await database
      .get<Transaction>("transactions")
      .query(Q.where("description", Q.like(`%${searchTerm}%`)), Q.sortBy("occurred_at", Q.desc))
      .fetch()
  },

  /**
   * Get transaction count for a category
   */
  async getTransactionCountByCategory(categoryId: string): Promise<number> {
    const count = await database
      .get<Transaction>("transactions")
      .query(Q.where("category_id", categoryId))
      .fetchCount()
    return count
  },

  /**
   * Get paginated transactions with infinite scroll support
   */
  async getTransactionsPaginated(
    page: number = 0,
    limit: number = 20,
  ): Promise<{
    transactions: Transaction[]
    hasMore: boolean
    totalCount: number
  }> {
    const offset = page * limit

    // Get paginated transactions (non-deleted ones sorted by date)
    const transactions = await database
      .get<Transaction>("transactions")
      .query(
        Q.where("trashed_at", Q.eq(null)),
        Q.sortBy("occurred_at", Q.desc),
        Q.skip(offset),
        Q.take(limit),
      )
      .fetch()

    // Get total count for pagination metadata
    const totalCount = await database
      .get<Transaction>("transactions")
      .query(Q.where("trashed_at", Q.eq(null)))
      .fetchCount()

    return {
      transactions,
      hasMore: offset + transactions.length < totalCount,
      totalCount,
    }
  },

  /**
   * Get monthly summary (aggregated data for performance)
   * Returns data optimized for dashboard month view
   */
  async getMonthlySummary(
    year: number,
    month: number,
  ): Promise<{
    transactions: Transaction[]
    totalIncome: number
    totalExpenses: number
    transactionCount: number
    categorySummary: Array<{
      categoryId: string
      categoryName: string
      totalAmount: number
      transactionCount: number
      isIncome: boolean
    }>
  }> {
    const transactions = await this.getTransactionsForMonth(year, month)

    // Calculate totals
    let totalIncome = 0
    let totalExpenses = 0

    // Group by category for summary
    const categoryMap = new Map<
      string,
      {
        categoryId: string
        categoryName: string
        totalAmount: number
        transactionCount: number
        isIncome: boolean
      }
    >()

    // Load categories once
    const categories = await this.getCategories()
    const categoryLookup = new Map(categories.map((cat) => [cat.id, cat]))

    for (const transaction of transactions) {
      const category = categoryLookup.get(transaction.categoryId)
      if (!category) continue

      const amount = transaction.amountMinorUnits

      if (category.isIncome) {
        totalIncome += amount
      } else {
        totalExpenses += Math.abs(amount)
      }

      // Update category summary
      const existing = categoryMap.get(transaction.categoryId)
      if (existing) {
        existing.totalAmount += amount
        existing.transactionCount += 1
      } else {
        categoryMap.set(transaction.categoryId, {
          categoryId: transaction.categoryId,
          categoryName: category.name,
          totalAmount: amount,
          transactionCount: 1,
          isIncome: category.isIncome,
        })
      }
    }

    return {
      transactions,
      totalIncome,
      totalExpenses,
      transactionCount: transactions.length,
      categorySummary: Array.from(categoryMap.values()),
    }
  },

  /**
   * Create a new category
   */
  async createCategory(data: {
    name: string
    color: string
    icon: string
    isIncome: boolean
  }): Promise<Category> {
    return await database.write(async () => {
      return await database.get<Category>("categories").create((category) => {
        category.name = data.name
        category.color = data.color
        category.icon = data.icon
        category.isIncome = data.isIncome
      })
    })
  },

  /**
   * Create a new transaction
   */
  async createTransaction(data: {
    amountMinorUnits: number
    currencyCode: string
    description: string
    occurredAt: number
    categoryId: string
  }): Promise<Transaction> {
    return await database.write(async () => {
      return await database.get<Transaction>("transactions").create((transaction) => {
        transaction.amountMinorUnits = data.amountMinorUnits
        transaction.currencyCode = data.currencyCode
        transaction.description = data.description
        transaction.occurredAt = data.occurredAt
        transaction.categoryId = data.categoryId
      })
    })
  },

  /**
   * Update a transaction
   */
  async updateTransaction(
    transactionId: string,
    data: Partial<{
      amountMinorUnits: number
      currencyCode: string
      description: string
      occurredAt: number
      categoryId: string
    }>,
  ): Promise<Transaction> {
    return await database.write(async () => {
      const transaction = await database.get<Transaction>("transactions").find(transactionId)
      return await transaction.update((t) => {
        if (data.amountMinorUnits !== undefined) t.amountMinorUnits = data.amountMinorUnits
        if (data.currencyCode !== undefined) t.currencyCode = data.currencyCode
        if (data.description !== undefined) t.description = data.description
        if (data.occurredAt !== undefined) t.occurredAt = data.occurredAt
        if (data.categoryId !== undefined) t.categoryId = data.categoryId
      })
    })
  },

  /**
   * Delete a transaction
   */
  async deleteTransaction(transactionId: string): Promise<void> {
    await database.write(async () => {
      const transaction = await database.get<Transaction>("transactions").find(transactionId)
      await transaction.destroyPermanently()
    })
  },

  /**
   * Update a category
   */
  async updateCategory(
    categoryId: string,
    data: Partial<{
      name: string
      color: string
      icon: string
      isIncome: boolean
    }>,
  ): Promise<Category> {
    return await database.write(async () => {
      const category = await database.get<Category>("categories").find(categoryId)
      return await category.update((c) => {
        if (data.name !== undefined) c.name = data.name
        if (data.color !== undefined) c.color = data.color
        if (data.icon !== undefined) c.icon = data.icon
        if (data.isIncome !== undefined) c.isIncome = data.isIncome
      })
    })
  },

  /**
   * Delete a category (only if no transactions exist)
   */
  async deleteCategory(categoryId: string): Promise<void> {
    const transactionCount = await this.getTransactionCountByCategory(categoryId)
    if (transactionCount > 0) {
      throw new Error("Cannot delete category with existing transactions")
    }

    await database.write(async () => {
      const category = await database.get<Category>("categories").find(categoryId)
      await category.destroyPermanently()
    })
  },
}
