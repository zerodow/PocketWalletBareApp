import { Model } from "@nozbe/watermelondb"
import { field, date } from "@nozbe/watermelondb/decorators"

export default class MonthlyStatistics extends Model {
  static table = "monthly_statistics"

  @field("year") year!: number
  @field("month") month!: number
  @field("total_income") totalIncome!: number
  @field("total_expense") totalExpense!: number
  @field("savings_amount") savingsAmount!: number
  @field("transaction_count") transactionCount!: number
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  static generateId(year: number, month: number): string {
    return `${year}-${month.toString().padStart(2, "0")}`
  }
}
