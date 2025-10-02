import { database } from "@/database"
import {
  MonthlyStatistics,
  DailyStatistics,
  CategoryStatistics,
  Transaction,
  Category,
} from "@/database/models"
import { Q } from "@nozbe/watermelondb"
import { format } from "date-fns"
import Decimal from "decimal.js"

interface StatisticsService {
  getMonthlyStatistics(year: number, month: number): Promise<MonthlyStatistics | null>
  getDailyStatistics(year: number, month: number): Promise<DailyStatistics[]>
  getCategoryStatistics(year: number, month: number): Promise<CategoryStatistics[]>
  generateMonthlyStatistics(year: number, month: number): Promise<void>
  updateStatisticsForTransaction(
    transaction: Transaction,
    prevTransaction?: Transaction,
  ): Promise<void>
  invalidateStatisticsForMonth(year: number, month: number): Promise<void>
  generateMissingStatistics(monthsBack?: number): Promise<void>
  startAutoUpdates(): void
  stopAutoUpdates(): void
}

// In-memory lock to prevent concurrent generation for same month
const generationLocks = new Set<string>()

export const statisticsService: StatisticsService = {
  async getMonthlyStatistics(year: number, month: number) {
    const id = MonthlyStatistics.generateId(year, month)
    try {
      return await database.get<MonthlyStatistics>("monthly_statistics").find(id)
    } catch {
      // Statistics don't exist, generate them
      await this.generateMonthlyStatistics(year, month)
      try {
        return await database.get<MonthlyStatistics>("monthly_statistics").find(id)
      } catch {
        return null
      }
    }
  },

  async getDailyStatistics(year: number, month: number) {
    const existing = await database
      .get<DailyStatistics>("daily_statistics")
      .query(Q.where("year", year), Q.where("month", month))
      .fetch()

    if (existing.length === 0) {
      await this.generateMonthlyStatistics(year, month)
      return await database
        .get<DailyStatistics>("daily_statistics")
        .query(Q.where("year", year), Q.where("month", month))
        .fetch()
    }

    return existing
  },

  async getCategoryStatistics(year: number, month: number) {
    const existing = await database
      .get<CategoryStatistics>("category_statistics")
      .query(Q.where("year", year), Q.where("month", month))
      .fetch()

    if (existing.length === 0) {
      await this.generateMonthlyStatistics(year, month)
      return await database
        .get<CategoryStatistics>("category_statistics")
        .query(Q.where("year", year), Q.where("month", month))
        .fetch()
    }

    return existing
  },

  async generateMonthlyStatistics(year: number, month: number) {
    const lockKey = `${year}-${month}`

    // Prevent concurrent generation
    if (generationLocks.has(lockKey)) {
      return
    }

    generationLocks.add(lockKey)

    try {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)

      // Query transactions for the month
      const transactions = await database
        .get<Transaction>("transactions")
        .query(
          Q.where("occurred_at", Q.between(startDate.getTime(), endDate.getTime())),
          Q.where("trashed_at", Q.eq(null)),
        )
        .fetch()

      // Get all categories for category statistics
      const categories = await database
        .get<Category>("categories")
        .query(Q.where("deleted_at", Q.eq(null)))
        .fetch()

      // Calculate statistics
      const { monthlyStats, dailyStats, categoryStats } = calculateStatistics(
        transactions,
        categories,
        year,
        month,
      )

      // Write all statistics in single transaction
      await database.write(async () => {
        // Delete existing statistics for this month
        await deleteExistingStatistics(year, month)

        // Create monthly statistics
        await database.get<MonthlyStatistics>("monthly_statistics").create((record) => {
          ;(record as any)._raw.id = MonthlyStatistics.generateId(year, month)
          record.year = year
          record.month = month
          record.totalIncome = monthlyStats.totalIncome
          record.totalExpense = monthlyStats.totalExpense
          record.savingsAmount = monthlyStats.savingsAmount
          record.transactionCount = monthlyStats.transactionCount
          record.createdAt = new Date()
          record.updatedAt = new Date()
        })

        // Create daily statistics
        for (const dayStat of dailyStats) {
          await database.get<DailyStatistics>("daily_statistics").create((record) => {
            ;(record as any)._raw.id = DailyStatistics.generateId(year, month, dayStat.day)
            record.date = dayStat.date
            record.year = year
            record.month = month
            record.day = dayStat.day
            record.totalIncome = dayStat.totalIncome
            record.totalExpense = dayStat.totalExpense
            record.netAmount = dayStat.netAmount
            record.transactionCount = dayStat.transactionCount
            record.createdAt = new Date()
            record.updatedAt = new Date()
          })
        }

        // Create category statistics
        for (const catStat of categoryStats) {
          await database.get<CategoryStatistics>("category_statistics").create((record) => {
            ;(record as any)._raw.id = CategoryStatistics.generateId(
              year,
              month,
              catStat.categoryId,
            )
            record.categoryId = catStat.categoryId
            record.year = year
            record.month = month
            record.totalAmount = catStat.totalAmount
            record.transactionCount = catStat.transactionCount
            record.percentageOfMonth = catStat.percentageOfMonth
            record.averageAmount = catStat.averageAmount
            record.createdAt = new Date()
            record.updatedAt = new Date()
          })
        }
      })
    } finally {
      generationLocks.delete(lockKey)
    }
  },

  async updateStatisticsForTransaction(transaction: Transaction, prevTransaction?: Transaction) {
    const affectedMonths = new Set<string>()

    // Current transaction month
    if (transaction.occurredAt) {
      const date = new Date(transaction.occurredAt)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      affectedMonths.add(monthKey)
    }

    // Previous transaction month (if date changed)
    if (prevTransaction?.occurredAt && prevTransaction.occurredAt !== transaction.occurredAt) {
      const prevDate = new Date(prevTransaction.occurredAt)
      const prevMonthKey = `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}`
      affectedMonths.add(prevMonthKey)
    }

    // Regenerate statistics for all affected months
    for (const monthKey of affectedMonths) {
      const [year, month] = monthKey.split("-").map(Number)
      await this.generateMonthlyStatistics(year, month)
    }
  },

  async invalidateStatisticsForMonth(year: number, month: number) {
    await database.write(async () => {
      await deleteExistingStatistics(year, month)
    })
  },

  async generateMissingStatistics(monthsBack: number = 12) {
    const today = new Date()
    const promises: Promise<void>[] = []

    for (let i = 0; i < monthsBack; i++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const year = targetDate.getFullYear()
      const month = targetDate.getMonth() + 1

      // Check if statistics already exist
      const id = MonthlyStatistics.generateId(year, month)
      try {
        await database.get<MonthlyStatistics>("monthly_statistics").find(id)
        // Statistics exist, skip
      } catch {
        // Statistics don't exist, add to generation queue
        promises.push(this.generateMonthlyStatistics(year, month))
      }
    }

    // Generate missing statistics in parallel (but limit concurrency)
    const BATCH_SIZE = 3
    for (let i = 0; i < promises.length; i += BATCH_SIZE) {
      const batch = promises.slice(i, i + BATCH_SIZE)
      await Promise.all(batch)
    }
  },

  startAutoUpdates() {
    // Import here to avoid circular dependency
    const { statisticsObserver } = require("./statisticsObserver")
    statisticsObserver.start()
  },

  stopAutoUpdates() {
    // Import here to avoid circular dependency
    const { statisticsObserver } = require("./statisticsObserver")
    statisticsObserver.stop()
  },
}

// Helper functions
async function deleteExistingStatistics(year: number, month: number) {
  const [monthlyStats, dailyStats, categoryStats] = await Promise.all([
    database
      .get<MonthlyStatistics>("monthly_statistics")
      .query(Q.where("year", year), Q.where("month", month))
      .fetch(),
    database
      .get<DailyStatistics>("daily_statistics")
      .query(Q.where("year", year), Q.where("month", month))
      .fetch(),
    database
      .get<CategoryStatistics>("category_statistics")
      .query(Q.where("year", year), Q.where("month", month))
      .fetch(),
  ])

  await Promise.all([
    ...monthlyStats.map((stat) => stat.destroyPermanently()),
    ...dailyStats.map((stat) => stat.destroyPermanently()),
    ...categoryStats.map((stat) => stat.destroyPermanently()),
  ])
}

interface CalculatedMonthlyStats {
  totalIncome: number
  totalExpense: number
  savingsAmount: number
  transactionCount: number
}

interface CalculatedDailyStats {
  day: number
  date: string
  totalIncome: number
  totalExpense: number
  netAmount: number
  transactionCount: number
}

interface CalculatedCategoryStats {
  categoryId: string
  totalAmount: number
  transactionCount: number
  percentageOfMonth: number
  averageAmount: number
}

function calculateStatistics(
  transactions: Transaction[],
  categories: Category[],
  year: number,
  month: number,
) {
  // Calculate monthly statistics
  let totalIncome = new Decimal(0)
  let totalExpense = new Decimal(0)

  transactions.forEach((transaction) => {
    const amount = new Decimal(transaction.amountMinorUnits).dividedBy(100)

    if (amount.greaterThan(0)) {
      totalIncome = totalIncome.plus(amount)
    } else {
      totalExpense = totalExpense.plus(amount.abs())
    }
  })

  const savingsAmount = totalIncome.minus(totalExpense)

  const monthlyStats: CalculatedMonthlyStats = {
    totalIncome: totalIncome.toNumber(),
    totalExpense: totalExpense.toNumber(),
    savingsAmount: savingsAmount.toNumber(),
    transactionCount: transactions.length,
  }

  // Calculate daily statistics
  const dailyMap = new Map<number, { income: Decimal; expense: Decimal; count: number }>()

  transactions.forEach((transaction) => {
    const date = new Date(transaction.occurredAt)
    const day = date.getDate()
    const amount = new Decimal(transaction.amountMinorUnits).dividedBy(100)

    const existing = dailyMap.get(day) || {
      income: new Decimal(0),
      expense: new Decimal(0),
      count: 0,
    }

    if (amount.greaterThan(0)) {
      existing.income = existing.income.plus(amount)
    } else {
      existing.expense = existing.expense.plus(amount.abs())
    }
    existing.count += 1

    dailyMap.set(day, existing)
  })

  const dailyStats: CalculatedDailyStats[] = Array.from(dailyMap.entries()).map(([day, data]) => ({
    day,
    date: format(new Date(year, month - 1, day), "yyyy-MM-dd"),
    totalIncome: data.income.toNumber(),
    totalExpense: data.expense.toNumber(),
    netAmount: data.income.minus(data.expense).toNumber(),
    transactionCount: data.count,
  }))

  // Calculate category statistics
  const categoryMap = new Map<string, { amount: Decimal; count: number }>()

  transactions.forEach((transaction) => {
    const amount = new Decimal(transaction.amountMinorUnits).dividedBy(100)

    // Only consider expenses for category breakdown
    if (amount.lessThan(0)) {
      const existing = categoryMap.get(transaction.categoryId) || {
        amount: new Decimal(0),
        count: 0,
      }
      existing.amount = existing.amount.plus(amount.abs())
      existing.count += 1
      categoryMap.set(transaction.categoryId, existing)
    }
  })

  const categoryStats: CalculatedCategoryStats[] = Array.from(categoryMap.entries()).map(
    ([categoryId, data]) => {
      const percentage = totalExpense.greaterThan(0)
        ? data.amount.dividedBy(totalExpense).times(100)
        : new Decimal(0)

      const averageAmount = data.count > 0 ? data.amount.dividedBy(data.count) : new Decimal(0)

      return {
        categoryId,
        totalAmount: data.amount.toNumber(),
        transactionCount: data.count,
        percentageOfMonth: percentage.toNumber(),
        averageAmount: averageAmount.toNumber(),
      }
    },
  )

  return { monthlyStats, dailyStats, categoryStats }
}
