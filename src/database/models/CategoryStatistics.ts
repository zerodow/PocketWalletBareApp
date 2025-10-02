import { Model } from "@nozbe/watermelondb"
import { field, date } from "@nozbe/watermelondb/decorators"

export default class CategoryStatistics extends Model {
  static table = "category_statistics"

  @field("category_id") categoryId!: string
  @field("year") year!: number
  @field("month") month!: number
  @field("total_amount") totalAmount!: number
  @field("transaction_count") transactionCount!: number
  @field("percentage_of_month") percentageOfMonth!: number
  @field("average_amount") averageAmount!: number
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  static generateId(year: number, month: number, categoryId: string): string {
    return `${year}-${month.toString().padStart(2, "0")}-${categoryId}`
  }
}
