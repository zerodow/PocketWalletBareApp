import { Model } from "@nozbe/watermelondb"
import { field, readonly, date, relation } from "@nozbe/watermelondb/decorators"
import type { Associations } from "@nozbe/watermelondb/Model"
import { TransactionSyncStatus } from "@/types"

export default class Transaction extends Model {
  static table = "transactions"
  static associations: Associations = {
    category: { type: "belongs_to", key: "category_id" },
  }

  @field("amount_minor_units") amountMinorUnits!: number // Stored as minor units for precision
  @field("currency_code") currencyCode!: string
  @field("description") description!: string
  @field("occurred_at") occurredAt!: number
  @field("category_id") categoryId!: string
  @field("trashed_at") trashedAt?: number // Soft delete timestamp
  @field("transaction_sync_status") transactionSyncStatus!: TransactionSyncStatus // 'pending', 'syncing', 'synced', 'failed'
  @field("synced_at") syncedAt?: number
  @readonly @date("created_at") createdAt!: Date
  @readonly @date("updated_at") updatedAt!: Date

  @relation("categories", "category_id") category: any
}
