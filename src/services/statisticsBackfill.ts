import { InteractionManager } from "react-native"
import { statisticsService } from "./statisticsService"

class StatisticsBackfill {
  private isRunning = false

  async start() {
    if (this.isRunning) return
    this.isRunning = true

    // Wait for UI to settle before starting background work
    InteractionManager.runAfterInteractions(async () => {
      try {
        if (__DEV__) {
          console.log("Starting statistics backfill...")
        }
        const startTime = Date.now()

        await statisticsService.generateMissingStatistics(12)

        const duration = Date.now() - startTime
        if (__DEV__) {
          console.log(`Statistics backfill completed in ${duration}ms`)
        }
      } catch (error) {
        console.error("Statistics backfill failed:", error)
      } finally {
        this.isRunning = false
      }
    })
  }

  get running() {
    return this.isRunning
  }
}

export const statisticsBackfill = new StatisticsBackfill()
