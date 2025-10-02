import { database } from "@/database"
import Category from "@/database/models/Category"
import Transaction from "@/database/models/Transaction"
import { Q } from "@nozbe/watermelondb"
import { faker } from "@faker-js/faker"
import { subDays, startOfDay, endOfDay } from "date-fns"

const DAYS_TO_GENERATE = 360
const RECORDS_PER_DAY = 30
const INCOME_PROBABILITY = 0.5 // 10% chance of a transaction being income

export const devDataSeedService = {
  /**
   * Clears all mock transactions and seeds new ones for the last 90 days.
   * This function is safe to run multiple times.
   */
  seedMockTransactions: async (): Promise<void> => {
    try {
      if (__DEV__) {
        console.log("Starting to seed mock transactions...")
      }

      // 1. Fetch categories to link transactions to
      const categoriesCollection = database.get<Category>("categories")
      const allCategories = await categoriesCollection.query().fetch()
      const incomeCategories = allCategories.filter((c) => c.isIncome)
      const expenseCategories = allCategories.filter((c) => !c.isIncome)

      if (expenseCategories.length === 0 || incomeCategories.length === 0) {
        console.error("Not enough categories to seed transactions. Seed default categories first.")
        return
      }

      await database.write(async () => {
        // 2. Clear existing mock transactions
        const transactionsCollection = database.get<Transaction>("transactions")
        const oldMocks = await transactionsCollection.query(Q.where("is_mock", true)).fetch()
        const deleted = oldMocks.map((mock) => mock.prepareDestroyPermanently())
        await database.batch(...deleted)
        if (__DEV__) {
          console.log(`Cleared ${deleted.length} old mock transactions.`)
        }

        // 3. Generate new mock transactions
        const newTransactions: Transaction[] = []
        for (let i = 0; i < DAYS_TO_GENERATE; i++) {
          const date = subDays(new Date(), i)
          for (let j = 0; j < RECORDS_PER_DAY; j++) {
            const isIncome = Math.random() < INCOME_PROBABILITY
            const category = isIncome
              ? faker.helpers.arrayElement(incomeCategories)
              : faker.helpers.arrayElement(expenseCategories)

            const newTransaction = transactionsCollection.prepareCreate((t: any) => {
              // Changed Transaction to any to avoid compile error
              const baseAmount = faker.number.int({ min: 1000, max: 2000000 })
              t.amountMinorUnits = isIncome
                ? baseAmount // Positive for income
                : -baseAmount // Negative for expense
              t.currencyCode = "VND"
              t.description = faker.lorem.sentence()
              t.occurredAt = faker.date
                .between({
                  from: startOfDay(date).getTime(),
                  to: endOfDay(date).getTime(),
                })
                .getTime()
              t.category.set(category)
              t.isMock = true
              t.transactionSyncStatus = "synced"
            })
            newTransactions.push(newTransaction)
          }
        }

        await database.batch(...newTransactions)
        if (__DEV__) {
          console.log(`Successfully created ${newTransactions.length} new mock transactions.`)
        }
      })
    } catch (error) {
      console.error("Error seeding mock transactions:", error)
    }
  },
}
