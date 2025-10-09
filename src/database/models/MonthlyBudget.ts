import { Model } from "@nozbe/watermelondb"
import { field, date } from "@nozbe/watermelondb/decorators"

export default class MonthlyBudget extends Model {
  static table = "monthly_budgets"

  @field("year") year!: number
  @field("month") month!: number
  @field("budget_amount") budgetAmount!: number
  @field("currency_code") currencyCode!: string
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  static generateId(year: number, month: number): string {
    return `budget-${year}-${month.toString().padStart(2, "0")}`
  }
}
