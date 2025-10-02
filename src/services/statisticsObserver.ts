import { database } from "@/database"
import { statisticsService } from "./statisticsService"

class StatisticsObserver {
  private subscription: any = null
  private pendingUpdates = new Map<string, ReturnType<typeof setTimeout>>()
  private readonly DEBOUNCE_DELAY = 500 // ms

  start() {
    if (this.subscription) return

    // Use WatermelonDB changes API for efficient observation
    this.subscription = database
      .withChangesForTables(["transactions"])
      .subscribe(this.handleChanges.bind(this))
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }

    // Clear pending debounced updates
    this.pendingUpdates.forEach((timeout) => clearTimeout(timeout))
    this.pendingUpdates.clear()
  }

  private handleChanges(changeSet: any) {
    const tx = changeSet?.changes?.transactions
    if (!tx) return

    const affectedMonths = new Set<string>()

    const addMonthFromRaw = (rawLike: any) => {
      // Depending on adapter, items may be { record: RawRecord } or RawRecord directly
      const raw = rawLike?.record ?? rawLike
      const occurredAt = raw?.occurred_at ?? raw?.occurredAt
      if (!occurredAt) return
      const d = new Date(occurredAt)
      affectedMonths.add(`${d.getFullYear()}-${d.getMonth() + 1}`)
    }

    // Handle created & updated records; hard deletes typically lack full raw data
    for (const item of tx.created || []) addMonthFromRaw(item)
    for (const item of tx.updated || []) addMonthFromRaw(item)
    // Note: tx.deleted may contain only ids; soft deletes appear as updated via trashed_at

    affectedMonths.forEach((key) => this.debounceUpdate(key))
  }

  private debounceUpdate(monthKey: string) {
    // Clear existing timeout for this month
    if (this.pendingUpdates.has(monthKey)) {
      clearTimeout(this.pendingUpdates.get(monthKey)!)
    }

    // Set new debounced update
    const timeout = setTimeout(async () => {
      try {
        const [year, month] = monthKey.split("-").map(Number)
        await statisticsService.generateMonthlyStatistics(year, month)
        this.pendingUpdates.delete(monthKey)
      } catch (error) {
        console.error(`Failed to update statistics for ${monthKey}:`, error)
        this.pendingUpdates.delete(monthKey)
      }
    }, this.DEBOUNCE_DELAY)

    this.pendingUpdates.set(monthKey, timeout)
  }
}

export const statisticsObserver = new StatisticsObserver()
