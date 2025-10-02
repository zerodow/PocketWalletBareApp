import { create } from "zustand"
import { database } from "@/database"
import Transaction from "@/database/models/Transaction"
import Category from "@/database/models/Category"
import { statisticsService } from "@/services/statisticsService"
import { Q } from "@nozbe/watermelondb"
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns"
import { InteractionManager } from "react-native"
import Decimal from "decimal.js"

const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // ms

export interface DashboardKPIs {
  totalIncome: number
  totalExpense: number
  savingsAmount: number
  savingsPercentage: number
}

export interface DailyData {
  day: string
  amount: number
  date: Date
}

export interface CategoryData {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
  color: string
}

export interface ProgressiveLoadingState {
  phase: "skeleton" | "kpis" | "charts" | "complete"
  kpisLoaded: boolean
  chartsLoaded: boolean
}

export interface DashboardStoreState {
  selectedMonth: Date
  kpiData: DashboardKPIs | null
  dailyData: DailyData[]
  categoryData: CategoryData[]
  isLoading: boolean
  error: string | null
  statisticsError: string | null
  retryCount: number
  progressive: ProgressiveLoadingState
}

export interface DashboardStoreActions {
  setSelectedMonth: (date: Date) => void
  goToPreviousMonth: () => void
  goToNextMonth: () => void
  refreshDashboard: () => Promise<void>
  refreshDashboardProgressive: (forceRefresh?: boolean) => Promise<void>
  refreshDashboardFallback: () => Promise<void>
  calculateKPIs: (transactions: Transaction[]) => DashboardKPIs
  calculateDailyData: (transactions: Transaction[]) => DailyData[]
  calculateCategoryData: (transactions: Transaction[], categories: Category[]) => CategoryData[]
  reset: () => void
}

type DashboardStore = DashboardStoreState & DashboardStoreActions

const initialProgressiveState: ProgressiveLoadingState = {
  phase: "skeleton",
  kpisLoaded: false,
  chartsLoaded: false,
}

const initialState: DashboardStoreState = {
  selectedMonth: new Date(),
  kpiData: null,
  dailyData: [],
  categoryData: [],
  isLoading: false,
  error: null,
  statisticsError: null,
  retryCount: 0,
  progressive: initialProgressiveState,
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  ...initialState,

  setSelectedMonth: (date: Date) => {
    set({ selectedMonth: date })
    get().refreshDashboard()
  },

  goToPreviousMonth: () => {
    const currentMonth = get().selectedMonth
    const previousMonth = subMonths(currentMonth, 1)
    get().setSelectedMonth(previousMonth)
  },

  goToNextMonth: () => {
    const currentMonth = get().selectedMonth
    const nextMonth = addMonths(currentMonth, 1)
    get().setSelectedMonth(nextMonth)
  },

  refreshDashboard: async () => {
    set({ isLoading: true, error: null, statisticsError: null })

    const { selectedMonth, retryCount } = get()
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth() + 1

    try {
      // Get pre-computed statistics with retry logic
      const [monthlyStats, categoryStats, dailyStats] = await Promise.all([
        retryWithBackoff(() => statisticsService.getMonthlyStatistics(year, month)),
        retryWithBackoff(() => statisticsService.getCategoryStatistics(year, month)),
        retryWithBackoff(() => statisticsService.getDailyStatistics(year, month)),
      ])

      // Map statistics to existing dashboard store shapes
      const kpiData: DashboardKPIs = {
        totalIncome: monthlyStats?.totalIncome || 0,
        totalExpense: monthlyStats?.totalExpense || 0,
        savingsAmount: monthlyStats?.savingsAmount || 0,
        savingsPercentage: monthlyStats?.totalIncome
          ? (monthlyStats.savingsAmount / monthlyStats.totalIncome) * 100
          : 0,
      }

      const dailyData: DailyData[] = dailyStats.map((stat) => ({
        day: format(new Date(stat.date), "dd"),
        amount: stat.totalExpense,
        date: new Date(stat.date),
      }))

      // Get category names for category data
      const categories = await database
        .get<Category>("categories")
        .query(Q.where("deleted_at", Q.eq(null)))
        .fetch()

      const categoryMap = new Map(categories.map((cat) => [cat.id, cat]))

      const categoryData: CategoryData[] = categoryStats
        .map((stat) => {
          const category = categoryMap.get(stat.categoryId)
          return {
            categoryId: stat.categoryId,
            categoryName: category?.name || "Unknown",
            amount: stat.totalAmount,
            percentage: stat.percentageOfMonth,
            color: category?.color || "#6B7280",
          }
        })
        .sort((a, b) => b.amount - a.amount) // Sort by amount descending

      set({
        kpiData,
        dailyData,
        categoryData,
        isLoading: false,
        error: null,
        retryCount: 0,
      })
    } catch (error) {
      console.error("Failed to load statistics:", error)
      set({
        isLoading: false,
        statisticsError: "Failed to load dashboard data",
        retryCount: retryCount + 1,
      })

      // Fallback to direct calculation if all retries fail
      if (retryCount >= MAX_RETRY_ATTEMPTS) {
        await fallbackToDirectCalculation(year, month, set, get)
      }
    }
  },

  refreshDashboardProgressive: async (_forceRefresh: boolean = false) => {
    // Phase 0: Show skeleton immediately
    set({
      progressive: initialProgressiveState,
      isLoading: true,
    })

    const { selectedMonth } = get()
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth() + 1

    // Phase 1: Load KPIs first (priority) - Now using statistics service
    InteractionManager.runAfterInteractions(async () => {
      try {
        const monthlyStats = await statisticsService.getMonthlyStatistics(year, month)

        const kpiData: DashboardKPIs = {
          totalIncome: monthlyStats?.totalIncome || 0,
          totalExpense: monthlyStats?.totalExpense || 0,
          savingsAmount: monthlyStats?.savingsAmount || 0,
          savingsPercentage: monthlyStats?.totalIncome
            ? (monthlyStats.savingsAmount / monthlyStats.totalIncome) * 100
            : 0,
        }

        set({
          kpiData,
          progressive: { ...get().progressive, phase: "kpis", kpisLoaded: true },
        })

        // Phase 2: Load charts (lower priority) - Also using statistics service
        setTimeout(async () => {
          try {
            const [categoryStats, dailyStats] = await Promise.all([
              statisticsService.getCategoryStatistics(year, month),
              statisticsService.getDailyStatistics(year, month),
            ])

            const dailyData: DailyData[] = dailyStats.map((stat) => ({
              day: format(new Date(stat.date), "dd"),
              amount: stat.totalExpense,
              date: new Date(stat.date),
            }))

            // Get category names for category data
            const categories = await database
              .get<Category>("categories")
              .query(Q.where("deleted_at", Q.eq(null)))
              .fetch()

            const categoryMap = new Map(categories.map((cat) => [cat.id, cat]))

            const categoryData: CategoryData[] = categoryStats
              .map((stat) => {
                const category = categoryMap.get(stat.categoryId)
                return {
                  categoryId: stat.categoryId,
                  categoryName: category?.name || "Unknown",
                  amount: stat.totalAmount,
                  percentage: stat.percentageOfMonth,
                  color: category?.color || "#6B7280",
                }
              })
              .sort((a, b) => b.amount - a.amount)

            set({
              dailyData,
              categoryData,
              progressive: { phase: "complete", kpisLoaded: true, chartsLoaded: true },
              isLoading: false,
            })
          } catch (error) {
            console.error("Failed to load charts data:", error)
            set({
              progressive: { ...get().progressive, chartsLoaded: false },
              isLoading: false,
              error: "Failed to load charts data",
            })
          }
        }, 50) // Much faster with pre-computed statistics
      } catch (error) {
        console.error("Failed to load KPI data:", error)
        set({
          progressive: { ...get().progressive, kpisLoaded: false },
          error: "Failed to load KPI data",
        })
      }
    })
  },

  refreshDashboardFallback: async () => {
    try {
      const { selectedMonth } = get()
      const monthStart = startOfMonth(selectedMonth)
      const monthEnd = endOfMonth(selectedMonth)

      // Fetch transactions for the selected month (original logic)
      const transactions = await database
        .get<Transaction>("transactions")
        .query(
          Q.where("occurred_at", Q.between(monthStart.getTime(), monthEnd.getTime())),
          Q.where("trashed_at", Q.eq(null)), // Exclude trashed transactions
        )
        .fetch()

      // Fetch all categories for category data calculation
      const categories = await database
        .get<Category>("categories")
        .query(Q.where("deleted_at", Q.eq(null)))
        .fetch()

      // Calculate analytics using existing methods
      const kpiData = get().calculateKPIs(transactions)
      const dailyData = get().calculateDailyData(transactions)
      const categoryData = get().calculateCategoryData(transactions, categories)

      set({
        kpiData,
        dailyData,
        categoryData,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error("Dashboard fallback refresh error:", error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to load dashboard data",
      })
    }
  },

  calculateKPIs: (transactions: Transaction[]): DashboardKPIs => {
    let totalIncome = new Decimal(0)
    let totalExpense = new Decimal(0)

    // Sum up transactions by type (assuming positive amounts for income, negative for expense based on description)
    transactions.forEach((transaction) => {
      const amount = new Decimal(transaction.amountMinorUnits).dividedBy(100) // Convert from minor units

      // Determine if income or expense based on amount sign or category
      if (amount.greaterThan(0)) {
        totalIncome = totalIncome.plus(amount)
      } else {
        totalExpense = totalExpense.plus(amount.abs()) // Make expense positive for calculations
      }
    })

    const savingsAmount = totalIncome.minus(totalExpense)
    const savingsPercentage = totalIncome.greaterThan(0)
      ? savingsAmount.dividedBy(totalIncome).times(100)
      : new Decimal(0)

    return {
      totalIncome: totalIncome.toNumber(),
      totalExpense: totalExpense.toNumber(),
      savingsAmount: savingsAmount.toNumber(),
      savingsPercentage: savingsPercentage.toNumber(),
    }
  },

  calculateDailyData: (transactions: Transaction[]): DailyData[] => {
    const dailyMap = new Map<string, Decimal>()

    transactions.forEach((transaction) => {
      const date = new Date(transaction.occurredAt)
      const dayKey = format(date, "yyyy-MM-dd")
      const amount = new Decimal(transaction.amountMinorUnits).dividedBy(100)

      // Only consider expenses (negative amounts or expenses) for daily spending pattern
      if (amount.lessThan(0)) {
        const currentAmount = dailyMap.get(dayKey) || new Decimal(0)
        dailyMap.set(dayKey, currentAmount.plus(amount.abs()))
      }
    })

    // Convert to array and sort by date
    const dailyData: DailyData[] = Array.from(dailyMap.entries()).map(([dayKey, amount]) => ({
      day: format(new Date(dayKey), "dd"),
      amount: amount.toNumber(),
      date: new Date(dayKey),
    }))

    return dailyData.sort((a, b) => a.date.getTime() - b.date.getTime())
  },

  calculateCategoryData: (transactions: Transaction[], categories: Category[]): CategoryData[] => {
    const categoryMap = new Map<string, Decimal>()
    const categoryNames = new Map<string, Category>()

    // Build category lookup map
    categories.forEach((category) => {
      categoryNames.set(category.id, category)
    })

    // Sum expenses by category
    transactions.forEach((transaction) => {
      const amount = new Decimal(transaction.amountMinorUnits).dividedBy(100)

      // Only consider expenses for category breakdown
      if (amount.lessThan(0)) {
        const currentAmount = categoryMap.get(transaction.categoryId) || new Decimal(0)
        categoryMap.set(transaction.categoryId, currentAmount.plus(amount.abs()))
      }
    })

    // Calculate total expense for percentage calculation
    const totalExpense = Array.from(categoryMap.values()).reduce(
      (sum, amount) => sum.plus(amount),
      new Decimal(0),
    )

    // Convert to array with category information
    const categoryData: CategoryData[] = Array.from(categoryMap.entries())
      .map(([categoryId, amount]) => {
        const category = categoryNames.get(categoryId)
        const percentage = totalExpense.greaterThan(0)
          ? amount.dividedBy(totalExpense).times(100)
          : new Decimal(0)

        return {
          categoryId,
          categoryName: category?.name || "Unknown",
          amount: amount.toNumber(),
          percentage: percentage.toNumber(),
          color: category?.color || "#6B7280",
        }
      })
      .sort((a, b) => b.amount - a.amount) // Sort by amount descending

    return categoryData
  },

  reset: () => {
    set(initialState)
  },
}))

// Helper functions
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = MAX_RETRY_ATTEMPTS,
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxAttempts) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1) // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

async function fallbackToDirectCalculation(year: number, month: number, set: any, get: any) {
  try {
    if (__DEV__) {
      console.log("Falling back to direct calculation...")
    }

    // Use existing calculation logic as fallback
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    const transactions = await database
      .get<Transaction>("transactions")
      .query(
        Q.where("occurred_at", Q.between(startDate.getTime(), endDate.getTime())),
        Q.where("trashed_at", Q.eq(null)),
      )
      .fetch()

    // Fetch all categories for category data calculation
    const categories = await database
      .get<Category>("categories")
      .query(Q.where("deleted_at", Q.eq(null)))
      .fetch()

    // Calculate and set data directly using existing methods
    const kpiData = get().calculateKPIs(transactions)
    const dailyData = get().calculateDailyData(transactions)
    const categoryData = get().calculateCategoryData(transactions, categories)

    set({
      kpiData,
      dailyData,
      categoryData,
      isLoading: false,
      error: null,
      statisticsError: null,
    })
  } catch (error) {
    console.error("Fallback calculation failed:", error)
    set({
      isLoading: false,
      error: "Unable to load dashboard data",
      statisticsError: "Unable to load dashboard data",
    })
  }
}

// Memoized selectors for performance
export const getDashboardKPIs = (state: DashboardStore) => state.kpiData
export const getDailyData = (state: DashboardStore) => state.dailyData
export const getCategoryData = (state: DashboardStore) => state.categoryData
export const getSelectedMonthFormatted = (state: DashboardStore) =>
  format(state.selectedMonth, "MMMM yyyy", { locale: undefined }) // Will use Vietnamese locale if configured
export const getIsCurrentMonth = (state: DashboardStore) => {
  const now = new Date()
  const selected = state.selectedMonth
  return now.getMonth() === selected.getMonth() && now.getFullYear() === selected.getFullYear()
}
