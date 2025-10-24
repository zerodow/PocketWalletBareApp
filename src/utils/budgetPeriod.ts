/**
 * Budget period calculation utilities
 * Handles budget periods that may not align with calendar months
 */

export interface BudgetPeriod {
  year: number
  month: number
  startDate: Date
  endDate: Date
  daysInPeriod: number
  daysRemaining: number
}

/**
 * Calculate the budget period for a given date and reset day
 *
 * @param date - The date to calculate the period for (defaults to now)
 * @param resetDay - Day of month when budget period starts (1-31, defaults to 1)
 * @returns Budget period information
 *
 * @example
 * // If today is Oct 20, 2024 and resetDay is 25:
 * // - Budget period is Sept 25 - Oct 24 (uses Sept's budget)
 * // - Returns { year: 2024, month: 9, ... }
 *
 * @example
 * // If today is Oct 26, 2024 and resetDay is 25:
 * // - Budget period is Oct 25 - Nov 24 (uses Oct's budget)
 * // - Returns { year: 2024, month: 10, ... }
 */
export function getBudgetPeriod(date: Date = new Date(), resetDay: number = 1): BudgetPeriod {
  const currentDay = date.getDate()
  let year = date.getFullYear()
  let month = date.getMonth() + 1 // 1-12

  // If we haven't reached the reset day this month, we're still in the previous month's budget period
  if (currentDay < resetDay) {
    if (month === 1) {
      month = 12
      year--
    } else {
      month--
    }
  }

  // Calculate start date (reset day of the budget month)
  const startDate = new Date(year, month - 1, resetDay, 0, 0, 0, 0)

  // Calculate end date (day before reset day of next month)
  const endYear = month === 12 ? year + 1 : year
  const endMonth = month === 12 ? 1 : month + 1
  const endDate = new Date(endYear, endMonth - 1, resetDay, 0, 0, 0, 0)
  endDate.setDate(endDate.getDate() - 1) // Day before reset day
  endDate.setHours(23, 59, 59, 999) // End of day

  // Calculate days in period and days remaining
  const totalMs = endDate.getTime() - startDate.getTime()
  const daysInPeriod = Math.ceil(totalMs / (1000 * 60 * 60 * 24)) + 1

  const remainingMs = endDate.getTime() - date.getTime()
  const daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)))

  return {
    year,
    month,
    startDate,
    endDate,
    daysInPeriod,
    daysRemaining,
  }
}

/**
 * Get the date range for a budget period
 * Useful for querying transactions within the budget period
 *
 * @param year - Budget year
 * @param month - Budget month
 * @param resetDay - Day of month when budget period starts (1-31, defaults to 1)
 * @returns Start and end dates for the budget period
 */
export function getBudgetPeriodDateRange(
  year: number,
  month: number,
  resetDay: number = 1,
): { startDate: Date; endDate: Date } {
  // Start date is reset day of the budget month
  const startDate = new Date(year, month - 1, resetDay, 0, 0, 0, 0)

  // End date is day before reset day of next month
  const endYear = month === 12 ? year + 1 : year
  const endMonth = month === 12 ? 1 : month + 1
  const endDate = new Date(endYear, endMonth - 1, resetDay, 0, 0, 0, 0)
  endDate.setDate(endDate.getDate() - 1)
  endDate.setHours(23, 59, 59, 999)

  return { startDate, endDate }
}

/**
 * Calculate daily budget based on total budget and period
 *
 * @param totalBudget - Total budget amount for the period
 * @param daysInPeriod - Number of days in the budget period
 * @returns Daily budget amount
 */
export function calculateDailyBudget(totalBudget: number, daysInPeriod: number): number {
  return daysInPeriod > 0 ? totalBudget / daysInPeriod : 0
}

/**
 * Format budget period for display
 *
 * @param period - Budget period object
 * @returns Formatted string (e.g., "Oct 25 - Nov 24")
 */
export function formatBudgetPeriod(period: BudgetPeriod): string {
  const startMonth = period.startDate.toLocaleString("en", { month: "short" })
  const startDay = period.startDate.getDate()
  const endMonth = period.endDate.toLocaleString("en", { month: "short" })
  const endDay = period.endDate.getDate()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
}
