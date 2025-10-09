import { schemaMigrations, createTable } from "@nozbe/watermelondb/Schema/migrations"

export const migrations = schemaMigrations({
  migrations: [
    // Note: WatermelonDB creates tables automatically from schema for version 1
    // Migrations start from version 2
    {
      toVersion: 2,
      steps: [
        {
          type: "add_columns",
          table: "transactions",
          columns: [
            { name: "trashed_at", type: "number", isOptional: true, isIndexed: true },
            { name: "transaction_sync_status", type: "string", isIndexed: true },
            { name: "synced_at", type: "number", isOptional: true },
          ],
        },
      ],
    },
    {
      toVersion: 3,
      steps: [
        {
          type: "add_columns",
          table: "categories",
          columns: [
            { name: "sort_order", type: "number", isIndexed: true },
            { name: "is_default", type: "boolean" },
            { name: "deleted_at", type: "number", isOptional: true },
            { name: "category_sync_status", type: "string", isIndexed: true },
          ],
        },
      ],
    },
    {
      toVersion: 4,
      steps: [
        {
          type: "add_columns",
          table: "transactions",
          columns: [{ name: "is_mock", type: "boolean", isOptional: true }],
        },
      ],
    },
    {
      toVersion: 5,
      steps: [
        createTable({
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
        createTable({
          name: "daily_statistics",
          columns: [
            { name: "date", type: "string", isIndexed: true },
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
        createTable({
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
      ],
    },
    {
      toVersion: 6,
      steps: [
        createTable({
          name: "monthly_budgets",
          columns: [
            { name: "year", type: "number", isIndexed: true },
            { name: "month", type: "number", isIndexed: true },
            { name: "budget_amount", type: "number" },
            { name: "currency_code", type: "string" },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
      ],
    },
  ],
})
