import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"

import { migrations } from "./migrations"
import {
  Category,
  Transaction,
  MonthlyStatistics,
  DailyStatistics,
  CategoryStatistics,
} from "./models"
import { schema } from "./schema"

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: "PocketWallet",
  jsi: true, // Platform.OS === 'ios'
  onSetUpError: (error) => {
    console.error("Database setup error:", error)
  },
})

// Then, make a Watermelon database from it:
export const database = new Database({
  adapter,
  modelClasses: [Category, Transaction, MonthlyStatistics, DailyStatistics, CategoryStatistics],
})

export { Category, Transaction, MonthlyStatistics, DailyStatistics, CategoryStatistics }
export * from "./schema"
export * from "./migrations"
