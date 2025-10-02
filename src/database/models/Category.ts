import { Model } from "@nozbe/watermelondb"
import { field, readonly, date, children } from "@nozbe/watermelondb/decorators"
import type { Associations } from "@nozbe/watermelondb/Model"
import { CategorySyncStatus } from "@/types"

export default class Category extends Model {
  static table = "categories"
  static associations: Associations = {
    transactions: { type: "has_many", foreignKey: "category_id" },
  }

  @field("name") name!: string
  @field("color") color!: string
  @field("icon") icon!: string
  @field("is_income") isIncome!: boolean
  @field("sort_order") sortOrder!: number
  @field("is_default") isDefault!: boolean
  @field("deleted_at") deletedAt?: number
  @field("category_sync_status") categorySyncStatus!: CategorySyncStatus
  @readonly @date("created_at") createdAt!: Date
  @readonly @date("updated_at") updatedAt!: Date

  @children("transactions") transactions: any
}
