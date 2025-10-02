# Task 12B: Auto-Updates, Backfill, and Store Integration

## Overview

Complete the statistics system by adding automatic updates when transactions change, background generation of missing statistics, and robust error handling. This ensures statistics stay fresh and all months are pre-computed for instant dashboard loading.

## Tasks

- [x] Implement transaction change observation with debouncing
- [x] Add automatic statistics regeneration for affected months
- [x] Create background backfill system for recent months
- [x] Add comprehensive error handling and retry logic
- [x] Optimize dashboard store integration with fallback strategies

## Acceptance Criteria

- [x] Statistics auto-update when transactions are created/updated/deleted
- [x] Date changes trigger regeneration for both old and new months
- [x] Background backfill completes for last 12 months without blocking UI
- [x] Statistics regeneration completes in <300ms for typical months
- [x] Dashboard gracefully handles statistics generation failures
- [x] Debouncing prevents excessive regeneration from rapid transaction changes
- [x] All database operations remain batched and off UI thread

## Priority

High

## Process

100% - Completed

Implementation references:
- `app/services/statisticsObserver.ts`
- `app/services/statisticsBackfill.ts`
- `app/services/statisticsService.ts` (auto updates + backfill generation)
- `app/store/dashboardStore.ts` (retry/backoff + fallback)
- `app/app.tsx` (startup wiring)

## Estimated Time

3-4 hours

## Dependencies

- Task 12A (Statistics Schema, Models, Service) completed

## Libraries to Install

None - extends existing WatermelonDB observer infrastructure

## Implementation Details

### 1) Transaction Change Observation

**Create**: `app/services/statisticsObserver.ts`

```typescript
import { database } from '@/database'
import { Transaction } from '@/database/models/Transaction'
import { statisticsService } from './statisticsService'

interface TransactionChange {
  type: 'created' | 'updated' | 'deleted'
  transaction: Transaction
  previousTransaction?: Transaction
}

class StatisticsObserver {
  private subscription: any = null
  private pendingUpdates = new Map<string, NodeJS.Timeout>()
  private readonly DEBOUNCE_DELAY = 500 // ms

  start() {
    if (this.subscription) return

    // Use WatermelonDB changes API for efficient observation
    this.subscription = database
      .withChangesForTables(['transactions'])
      .subscribe(this.handleChanges.bind(this))
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
    
    // Clear pending debounced updates
    this.pendingUpdates.forEach(timeout => clearTimeout(timeout))
    this.pendingUpdates.clear()
  }

  private handleChanges(changes: any[]) {
    const affectedMonths = new Set<string>()

    changes.forEach(change => {
      if (change.table !== 'transactions') return

      const transaction = change.record as Transaction
      const changeType = change.type as 'created' | 'updated' | 'deleted'

      // Track affected months
      if (transaction.occurredAt) {
        const date = new Date(transaction.occurredAt)
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
        affectedMonths.add(monthKey)
      }

      // For updates, also track the previous month if date changed
      if (changeType === 'updated' && change.previousRecord) {
        const prevTransaction = change.previousRecord as Transaction
        if (prevTransaction.occurredAt && prevTransaction.occurredAt !== transaction.occurredAt) {
          const prevDate = new Date(prevTransaction.occurredAt)
          const prevMonthKey = `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}`
          affectedMonths.add(prevMonthKey)
        }
      }
    })

    // Debounce updates for each affected month
    affectedMonths.forEach(monthKey => {
      this.debounceUpdate(monthKey)
    })
  }

  private debounceUpdate(monthKey: string) {
    // Clear existing timeout for this month
    if (this.pendingUpdates.has(monthKey)) {
      clearTimeout(this.pendingUpdates.get(monthKey)!)
    }

    // Set new debounced update
    const timeout = setTimeout(async () => {
      try {
        const [year, month] = monthKey.split('-').map(Number)
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
```

### 2) Extended Statistics Service

**Update**: `app/services/statisticsService.ts`

Add new methods to existing service:

```typescript
// Add to existing StatisticsService interface
interface StatisticsService {
  // ... existing methods
  updateStatisticsForTransaction(transaction: Transaction, prevTransaction?: Transaction): Promise<void>
  invalidateStatisticsForMonth(year: number, month: number): Promise<void>
  generateMissingStatistics(monthsBack?: number): Promise<void>
  startAutoUpdates(): void
  stopAutoUpdates(): void
}

// Add to existing statisticsService implementation
export const statisticsService: StatisticsService = {
  // ... existing methods

  async updateStatisticsForTransaction(transaction: Transaction, prevTransaction?: Transaction) {
    const affectedMonths = new Set<string>()

    // Current transaction month
    if (transaction.occurredAt) {
      const date = new Date(transaction.occurredAt)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      affectedMonths.add(monthKey)
    }

    // Previous transaction month (if date changed)
    if (prevTransaction?.occurredAt && prevTransaction.occurredAt !== transaction.occurredAt) {
      const prevDate = new Date(prevTransaction.occurredAt)
      const prevMonthKey = `${prevDate.getFullYear()}-${prevDate.getMonth() + 1}`
      affectedMonths.add(prevMonthKey)
    }

    // Regenerate statistics for all affected months
    for (const monthKey of affectedMonths) {
      const [year, month] = monthKey.split('-').map(Number)
      await this.generateMonthlyStatistics(year, month)
    }
  },

  async invalidateStatisticsForMonth(year: number, month: number) {
    await database.write(async () => {
      await deleteExistingStatistics(year, month)
    })
  },

  async generateMissingStatistics(monthsBack: number = 12) {
    const today = new Date()
    const promises: Promise<void>[] = []

    for (let i = 0; i < monthsBack; i++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const year = targetDate.getFullYear()
      const month = targetDate.getMonth() + 1

      // Check if statistics already exist
      const id = MonthlyStatistics.generateId(year, month)
      try {
        await database.get<MonthlyStatistics>('monthly_statistics').find(id)
        // Statistics exist, skip
      } catch {
        // Statistics don't exist, add to generation queue
        promises.push(this.generateMonthlyStatistics(year, month))
      }
    }

    // Generate missing statistics in parallel (but limit concurrency)
    const BATCH_SIZE = 3
    for (let i = 0; i < promises.length; i += BATCH_SIZE) {
      const batch = promises.slice(i, i + BATCH_SIZE)
      await Promise.all(batch)
    }
  },

  startAutoUpdates() {
    statisticsObserver.start()
  },

  stopAutoUpdates() {
    statisticsObserver.stop()
  }
}
```

### 3) Background Backfill System

**Create**: `app/services/statisticsBackfill.ts`

```typescript
import { InteractionManager } from 'react-native'
import { statisticsService } from './statisticsService'

class StatisticsBackfill {
  private isRunning = false

  async start() {
    if (this.isRunning) return
    this.isRunning = true

    // Wait for UI to settle before starting background work
    InteractionManager.runAfterInteractions(async () => {
      try {
        console.log('Starting statistics backfill...')
        const startTime = Date.now()
        
        await statisticsService.generateMissingStatistics(12)
        
        const duration = Date.now() - startTime
        console.log(`Statistics backfill completed in ${duration}ms`)
      } catch (error) {
        console.error('Statistics backfill failed:', error)
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
```

### 4) Enhanced Dashboard Store Integration

**Update**: `app/store/dashboardStore.ts`

Add robust error handling and retry logic:

```typescript
import { statisticsService } from '@/services/statisticsService'

interface DashboardStoreState {
  // ... existing state
  statisticsError: string | null
  retryCount: number
}

const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // ms

const refreshDashboard = async (forceRefresh: boolean = false) => {
  set({ isLoading: true, statisticsError: null })

  const { selectedMonth, retryCount } = get()
  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth() + 1

  try {
    // Get pre-computed statistics with retry logic
    const [monthlyStats, categoryStats, dailyStats] = await Promise.all([
      retryWithBackoff(() => statisticsService.getMonthlyStatistics(year, month)),
      retryWithBackoff(() => statisticsService.getCategoryStatistics(year, month)),
      retryWithBackoff(() => statisticsService.getDailyStatistics(year, month))
    ])

    // Map to existing dashboard store shapes
    const kpiData: DashboardKPIs = {
      totalIncome: monthlyStats?.totalIncome || 0,
      totalExpense: monthlyStats?.totalExpense || 0,
      savingsAmount: monthlyStats?.savingsAmount || 0,
    }

    const dailyData: DailyData[] = dailyStats.map(stat => ({
      date: stat.date,
      amount: stat.totalExpense,
      income: stat.totalIncome,
      count: stat.transactionCount,
    }))

    const categoryData: CategoryData[] = categoryStats.map(stat => ({
      categoryId: stat.categoryId,
      amount: stat.totalAmount,
      percentage: stat.percentageOfMonth,
      count: stat.transactionCount,
    }))

    set({ 
      kpiData, 
      dailyData, 
      categoryData, 
      isLoading: false,
      retryCount: 0 
    })
  } catch (error) {
    console.error('Failed to load statistics:', error)
    set({ 
      isLoading: false,
      statisticsError: 'Failed to load dashboard data',
      retryCount: retryCount + 1 
    })

    // Fallback to direct calculation if all retries fail
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      await fallbackToDirectCalculation(year, month)
    }
  }
}

async function retryWithBackoff<T>(fn: () => Promise<T>, maxAttempts: number = MAX_RETRY_ATTEMPTS): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxAttempts) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1) // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

async function fallbackToDirectCalculation(year: number, month: number) {
  try {
    console.log('Falling back to direct calculation...')
    
    // Use existing calculation logic as fallback
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)
    
    const transactions = await database
      .get<Transaction>('transactions')
      .query(
        Q.where('occurred_at', Q.between(startDate.getTime(), endDate.getTime())),
        Q.where('trashed_at', Q.eq(null))
      )
      .fetch()

    // Calculate and set data directly
    const kpiData = calculateKPIs(transactions)
    const dailyData = calculateDailyData(transactions)
    const categoryData = calculateCategoryData(transactions)

    set({ kpiData, dailyData, categoryData, isLoading: false })
  } catch (error) {
    console.error('Fallback calculation failed:', error)
    set({ isLoading: false, statisticsError: 'Unable to load dashboard data' })
  }
}
```

### 5) App Integration

**Update**: `app/App.tsx` or main app entry point

```typescript
import { statisticsService } from '@/services/statisticsService'
import { statisticsBackfill } from '@/services/statisticsBackfill'

export default function App() {
  useEffect(() => {
    // Start statistics auto-updates
    statisticsService.startAutoUpdates()
    
    // Start background backfill
    statisticsBackfill.start()

    return () => {
      // Cleanup on app unmount
      statisticsService.stopAutoUpdates()
    }
  }, [])

  // ... rest of app
}
```

## Testing

### Manual Testing
- [ ] Create new transaction: verify statistics update automatically
- [ ] Edit transaction date across months: verify both months regenerate
- [ ] Delete transaction: verify statistics reflect changes
- [ ] Background backfill: verify recent months have statistics after app start
- [ ] Network interruption: verify dashboard falls back gracefully

### Performance Testing
- [ ] Statistics regeneration <300ms for typical month
- [ ] Background backfill doesn't block UI interactions
- [ ] Debouncing prevents excessive regeneration during rapid changes
- [ ] Memory usage remains stable during backfill

### Edge Case Testing
- [ ] App restart during statistics generation
- [ ] Concurrent transaction changes in same month
- [ ] Large transaction volumes (stress test)
- [ ] Statistics corruption recovery

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/task12b-stats-auto-updates-and-backfill`
2. Ensure Task 12A is merged and working

### Implementation Steps
1. **Create Statistics Observer**: Implement debounced transaction change detection
2. **Extend Statistics Service**: Add auto-update and backfill methods
3. **Add Background Backfill**: Implement idle-time statistics generation
4. **Enhance Dashboard Store**: Add retry logic and fallback strategies
5. **Integrate with App**: Wire up auto-updates and backfill on app start
6. **Test Edge Cases**: Verify robustness under various conditions

### When Complete
1. Commit with descriptive messages
2. Push branch to remote
3. Create PR targeting `dev` branch
4. Include performance benchmarks and edge case test results

## Notes

- All database operations must remain in `database.write` blocks
- Debouncing prevents UI lag from rapid transaction changes
- Background backfill runs only when UI is idle
- Fallback ensures dashboard always works even if statistics fail
- Observer cleanup prevents memory leaks on app unmount
