import { Model } from "@nozbe/watermelondb"
import { field, date } from "@nozbe/watermelondb/decorators"

export default class DailyStatistics extends Model {
  static table = "daily_statistics"

  @field("date") date!: string // YYYY-MM-DD
  @field("year") year!: number
  @field("month") month!: number
  @field("day") day!: number
  @field("total_income") totalIncome!: number
  @field("total_expense") totalExpense!: number
  @field("net_amount") netAmount!: number
  @field("transaction_count") transactionCount!: number
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  static generateId(year: number, month: number, day: number): string {
    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }
}
