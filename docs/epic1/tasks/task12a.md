# Task 12A: Statistics Schema, Models, and Service (On-Demand)

## Overview

Create persistent database tables for pre-computed dashboard statistics and implement an on-demand statistics service. This establishes the foundation for instant dashboard loading by storing calculated KPIs, daily totals, and category breakdowns in dedicated tables instead of recalculating from raw transactions every time.

## Tasks

- [x] Add statistics database schema with proper indexing
- [x] Create WatermelonDB models for statistics tables
- [x] Implement statistics service with on-demand generation
- [x] Update dashboard store to read from service
- [x] Add database migrations for schema version bump

## Acceptance Criteria

- [x] Dashboard loads existing statistics in <50ms
- [x] First-time month access generates stats and loads successfully
- [x] Database migration runs without data loss
- [x] Deterministic IDs prevent duplicate statistics for same month
- [x] Service generates all three stat types (monthly, daily, category) in single transaction
- [x] Dashboard store maps service results to existing UI data shapes
- [x] Statistics calculation handles soft-deleted transactions correctly

## Priority

High

## Process

100% - Completed

Implementation references:
- `app/database/schema.ts`
- `app/database/migrations.ts`
- `app/database/models/{MonthlyStatistics,DailyStatistics,CategoryStatistics}.ts`
- `app/services/statisticsService.ts`
- `app/store/dashboardStore.ts`

## Estimated Time

3-4 hours

## Dependencies

- Task 11 (Transaction List Pagination) completed

## Libraries to Install

None - uses existing WatermelonDB and Zustand infrastructure

## Implementation Details

### 1) Database Schema Updates

**Update**: `app/database/schema.ts`

```typescript
export const appSchema = appSchema({
  version: 5, // Increment from current version
  tables: [
    // ... existing tables
    tableSchema({
      name: 'monthly_statistics',
      columns: [
        { name: 'id', type: 'string', isIndexed: true }, // Format: YYYY-MM
        { name: 'year', type: 'number', isIndexed: true },
        { name: 'month', type: 'number', isIndexed: true },
        { name: 'total_income', type: 'number' },
        { name: 'total_expense', type: 'number' },
        { name: 'savings_amount', type: 'number' },
        { name: 'transaction_count', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'daily_statistics',
      columns: [
        { name: 'id', type: 'string', isIndexed: true }, // Format: YYYY-MM-DD
        { name: 'date', type: 'string', isIndexed: true }, // YYYY-MM-DD format
        { name: 'year', type: 'number', isIndexed: true },
        { name: 'month', type: 'number', isIndexed: true },
        { name: 'day', type: 'number' },
        { name: 'total_income', type: 'number' },
        { name: 'total_expense', type: 'number' },
        { name: 'net_amount', type: 'number' },
        { name: 'transaction_count', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'category_statistics',
      columns: [
        { name: 'id', type: 'string', isIndexed: true }, // Format: YYYY-MM-{categoryId}
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'year', type: 'number', isIndexed: true },
        { name: 'month', type: 'number', isIndexed: true },
        { name: 'total_amount', type: 'number' },
        { name: 'transaction_count', type: 'number' },
        { name: 'percentage_of_month', type: 'number' },
        { name: 'average_amount', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
  ]
})
```

**Create**: `app/database/migrations.ts`

```typescript
import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    // ... existing migrations
    {
      toVersion: 5,
      steps: [
        createTable({
          name: 'monthly_statistics',
          columns: [
            { name: 'id', type: 'string', isIndexed: true },
            { name: 'year', type: 'number', isIndexed: true },
            // ... all columns from schema
          ]
        }),
        createTable({
          name: 'daily_statistics',
          columns: [
            // ... columns
          ]
        }),
        createTable({
          name: 'category_statistics', 
          columns: [
            // ... columns
          ]
        }),
      ]
    }
  ]
})
```

### 2) Statistics Models

**Create**: `app/database/models/MonthlyStatistics.ts`

```typescript
import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export class MonthlyStatistics extends Model {
  static table = 'monthly_statistics'

  @field('year') year!: number
  @field('month') month!: number
  @field('total_income') totalIncome!: number
  @field('total_expense') totalExpense!: number
  @field('savings_amount') savingsAmount!: number
  @field('transaction_count') transactionCount!: number
  @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  static generateId(year: number, month: number): string {
    return `${year}-${month.toString().padStart(2, '0')}`
  }
}
```

**Create**: `app/database/models/DailyStatistics.ts`

```typescript
import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export class DailyStatistics extends Model {
  static table = 'daily_statistics'

  @field('date') date!: string // YYYY-MM-DD
  @field('year') year!: number
  @field('month') month!: number
  @field('day') day!: number
  @field('total_income') totalIncome!: number
  @field('total_expense') totalExpense!: number
  @field('net_amount') netAmount!: number
  @field('transaction_count') transactionCount!: number
  @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  static generateId(year: number, month: number, day: number): string {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  }
}
```

**Create**: `app/database/models/CategoryStatistics.ts`

```typescript
import { Model } from '@nozbe/watermelondb'
import { field, date } from '@nozbe/watermelondb/decorators'

export class CategoryStatistics extends Model {
  static table = 'category_statistics'

  @field('category_id') categoryId!: string
  @field('year') year!: number
  @field('month') month!: number
  @field('total_amount') totalAmount!: number
  @field('transaction_count') transactionCount!: number
  @field('percentage_of_month') percentageOfMonth!: number
  @field('average_amount') averageAmount!: number
  @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  static generateId(year: number, month: number, categoryId: string): string {
    return `${year}-${month.toString().padStart(2, '0')}-${categoryId}`
  }
}
```

### 3) Statistics Service Implementation

**Create**: `app/services/statisticsService.ts`

```typescript
import { database } from '@/database'
import { MonthlyStatistics, DailyStatistics, CategoryStatistics } from '@/database/models'
import { Transaction } from '@/database/models/Transaction'
import { Q } from '@nozbe/watermelondb'

interface StatisticsService {
  getMonthlyStatistics(year: number, month: number): Promise<MonthlyStatistics | null>
  getDailyStatistics(year: number, month: number): Promise<DailyStatistics[]>
  getCategoryStatistics(year: number, month: number): Promise<CategoryStatistics[]>
  generateMonthlyStatistics(year: number, month: number): Promise<void>
}

// In-memory lock to prevent concurrent generation for same month
const generationLocks = new Set<string>()

export const statisticsService: StatisticsService = {
  async getMonthlyStatistics(year: number, month: number) {
    const id = MonthlyStatistics.generateId(year, month)
    try {
      return await database.get<MonthlyStatistics>('monthly_statistics').find(id)
    } catch {
      // Statistics don't exist, generate them
      await this.generateMonthlyStatistics(year, month)
      return await database.get<MonthlyStatistics>('monthly_statistics').find(id)
    }
  },

  async getDailyStatistics(year: number, month: number) {
    const existing = await database
      .get<DailyStatistics>('daily_statistics')
      .query(Q.where('year', year), Q.where('month', month))
      .fetch()
    
    if (existing.length === 0) {
      await this.generateMonthlyStatistics(year, month)
      return await database
        .get<DailyStatistics>('daily_statistics')
        .query(Q.where('year', year), Q.where('month', month))
        .fetch()
    }
    
    return existing
  },

  async getCategoryStatistics(year: number, month: number) {
    const existing = await database
      .get<CategoryStatistics>('category_statistics')
      .query(Q.where('year', year), Q.where('month', month))
      .fetch()
    
    if (existing.length === 0) {
      await this.generateMonthlyStatistics(year, month)
      return await database
        .get<CategoryStatistics>('category_statistics')
        .query(Q.where('year', year), Q.where('month', month))
        .fetch()
    }
    
    return existing
  },

  async generateMonthlyStatistics(year: number, month: number) {
    const lockKey = `${year}-${month}`
    
    // Prevent concurrent generation
    if (generationLocks.has(lockKey)) {
      return
    }
    
    generationLocks.add(lockKey)
    
    try {
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)
      
      // Query transactions for the month
      const transactions = await database
        .get<Transaction>('transactions')
        .query(
          Q.where('occurred_at', Q.between(startDate.getTime(), endDate.getTime())),
          Q.where('trashed_at', Q.eq(null))
        )
        .fetch()

      // Calculate statistics
      const {
        monthlyStats,
        dailyStats,
        categoryStats
      } = calculateStatistics(transactions, year, month)

      // Write all statistics in single transaction
      await database.write(async () => {
        // Delete existing statistics for this month
        await deleteExistingStatistics(year, month)
        
        // Create monthly statistics
        await database.get<MonthlyStatistics>('monthly_statistics').create(record => {
          record.id = MonthlyStatistics.generateId(year, month)
          record.year = year
          record.month = month
          record.totalIncome = monthlyStats.totalIncome
          record.totalExpense = monthlyStats.totalExpense
          record.savingsAmount = monthlyStats.savingsAmount
          record.transactionCount = monthlyStats.transactionCount
          record.createdAt = new Date()
          record.updatedAt = new Date()
        })

        // Create daily statistics
        for (const dayStat of dailyStats) {
          await database.get<DailyStatistics>('daily_statistics').create(record => {
            record.id = DailyStatistics.generateId(year, month, dayStat.day)
            record.date = dayStat.date
            record.year = year
            record.month = month
            record.day = dayStat.day
            record.totalIncome = dayStat.totalIncome
            record.totalExpense = dayStat.totalExpense
            record.netAmount = dayStat.netAmount
            record.transactionCount = dayStat.transactionCount
            record.createdAt = new Date()
            record.updatedAt = new Date()
          })
        }

        // Create category statistics
        for (const catStat of categoryStats) {
          await database.get<CategoryStatistics>('category_statistics').create(record => {
            record.id = CategoryStatistics.generateId(year, month, catStat.categoryId)
            record.categoryId = catStat.categoryId
            record.year = year
            record.month = month
            record.totalAmount = catStat.totalAmount
            record.transactionCount = catStat.transactionCount
            record.percentageOfMonth = catStat.percentageOfMonth
            record.averageAmount = catStat.averageAmount
            record.createdAt = new Date()
            record.updatedAt = new Date()
          })
        }
      })
    } finally {
      generationLocks.delete(lockKey)
    }
  }
}

// Helper functions
async function deleteExistingStatistics(year: number, month: number) {
  const [monthlyStats, dailyStats, categoryStats] = await Promise.all([
    database.get<MonthlyStatistics>('monthly_statistics')
      .query(Q.where('year', year), Q.where('month', month)).fetch(),
    database.get<DailyStatistics>('daily_statistics')
      .query(Q.where('year', year), Q.where('month', month)).fetch(),
    database.get<CategoryStatistics>('category_statistics')
      .query(Q.where('year', year), Q.where('month', month)).fetch()
  ])

  await Promise.all([
    ...monthlyStats.map(stat => stat.markAsDeleted()),
    ...dailyStats.map(stat => stat.markAsDeleted()),
    ...categoryStats.map(stat => stat.markAsDeleted())
  ])
}

function calculateStatistics(transactions: Transaction[], year: number, month: number) {
  // Implementation of calculation logic
  // Returns { monthlyStats, dailyStats, categoryStats }
}
```

### 4) Dashboard Store Integration

**Update**: `app/store/dashboardStore.ts`

```typescript
import { statisticsService } from '@/services/statisticsService'

const refreshDashboard = async (forceRefresh: boolean = false) => {
  set({ isLoading: true })

  const { selectedMonth } = get()
  const year = selectedMonth.getFullYear()
  const month = selectedMonth.getMonth() + 1

  try {
    // Get pre-computed statistics (instant if exists, generates if missing)
    const [monthlyStats, categoryStats, dailyStats] = await Promise.all([
      statisticsService.getMonthlyStatistics(year, month),
      statisticsService.getCategoryStatistics(year, month),
      statisticsService.getDailyStatistics(year, month)
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

    set({ kpiData, dailyData, categoryData, isLoading: false })
  } catch (error) {
    console.error('Failed to load statistics:', error)
    set({ isLoading: false })
    // Fallback to existing calculation if needed
  }
}
```

## Testing

### Manual Testing
- [ ] Fresh install: verify migration creates new tables
- [ ] First month access: generates statistics and loads dashboard
- [ ] Second access to same month: loads instantly from database
- [ ] Different month access: generates new statistics
- [ ] Statistics accuracy: compare with manual calculations

### Performance Testing
- [ ] Dashboard load time <50ms for existing statistics
- [ ] Statistics generation <500ms for typical month
- [ ] Database migration completes without errors

## Development Workflow

### Before Starting
1. Create feature branch: `git checkout -b feat/task12a-stats-schema-and-service`
2. Verify current database schema version

### Implementation Steps
1. **Update Database Schema**: Add statistics tables and bump schema version
2. **Add Database Migration**: Ensure clean upgrade path
3. **Create Statistics Models**: Implement WatermelonDB models with proper decorators
4. **Implement Statistics Service**: Build on-demand generation and retrieval
5. **Update Dashboard Store**: Replace calculations with service calls
6. **Test Migration**: Verify schema upgrade works correctly
7. **Test Statistics**: Verify generation and retrieval accuracy

### When Complete
1. Commit with descriptive messages
2. Push branch to remote
3. Create PR targeting `dev` branch
4. Include performance test results in PR description

## Notes

- Keep heavy computations off UI thread using `InteractionManager`
- Use single `database.write` batch for all statistics creation
- Deterministic IDs prevent duplicate statistics for same month
- Statistics service is foundation for Task 12B auto-updates
