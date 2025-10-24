import { appSchema, tableSchema } from "@nozbe/watermelondb"

export const schema = appSchema({
  version: 7,
  tables: [
    tableSchema({
      name: "categories",
      columns: [
        { name: "name", type: "string" },
        { name: "color", type: "string" },
        { name: "icon", type: "string" },
        { name: "is_income", type: "boolean" },
        { name: "sort_order", type: "number", isIndexed: true },
        { name: "is_default", type: "boolean" },
        { name: "deleted_at", type: "number", isOptional: true },
        { name: "category_sync_status", type: "string", isIndexed: true },
        { name: "created_at", type: "number", isIndexed: true },
        { name: "updated_at", type: "number", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "transactions",
      columns: [
        { name: "amount_minor_units", type: "number" }, // Store as minor units (e.g., cents for USD, dong for VND)
        { name: "currency_code", type: "string" },
        { name: "description", type: "string" },
        { name: "occurred_at", type: "number", isIndexed: true }, // Indexed for month view queries
        { name: "category_id", type: "string", isIndexed: true },
        { name: "trashed_at", type: "number", isOptional: true, isIndexed: true }, // Soft delete timestamp
        { name: "transaction_sync_status", type: "string", isIndexed: true }, // 'pending', 'syncing', 'synced', 'failed'
        { name: "synced_at", type: "number", isOptional: true },
        { name: "is_mock", type: "boolean", isOptional: true },
        { name: "created_at", type: "number", isIndexed: true },
        { name: "updated_at", type: "number", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "monthly_statistics",
      columns: [
        { name: "year", type: "number", isIndexed: true },
        { name: "month", type: "number", isIndexed: true },
        { name: "total_income", type: "number" },
        { name: "total_expense", type: "number" },
        { name: "savings_amount", type: "number" },
        { name: "transaction_count", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "daily_statistics",
      columns: [
        { name: "date", type: "string", isIndexed: true }, // YYYY-MM-DD format
        { name: "year", type: "number", isIndexed: true },
        { name: "month", type: "number", isIndexed: true },
        { name: "day", type: "number" },
        { name: "total_income", type: "number" },
        { name: "total_expense", type: "number" },
        { name: "net_amount", type: "number" },
        { name: "transaction_count", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "category_statistics",
      columns: [
        { name: "category_id", type: "string", isIndexed: true },
        { name: "year", type: "number", isIndexed: true },
        { name: "month", type: "number", isIndexed: true },
        { name: "total_amount", type: "number" },
        { name: "transaction_count", type: "number" },
        { name: "percentage_of_month", type: "number" },
        { name: "average_amount", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "monthly_budgets",
      columns: [
        { name: "year", type: "number", isIndexed: true },
        { name: "month", type: "number", isIndexed: true },
        { name: "budget_amount", type: "number" },
        { name: "currency_code", type: "string" },
        { name: "reset_day", type: "number", isOptional: true }, // Day of month when budget period starts (1-31)
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
})
