# Task 14: Quick Performance Wins

**Epic**: Epic 1 - Core Features & Local Database  
**Priority**: Low  
**Estimated Time**: 2-3 hours  
**Dependencies**: None (can run in parallel with other tasks)

## 🎯 Objective

Apply immediate performance fixes that require minimal code changes but provide significant impact.

## 📋 Problems

1. **Theme Context Console Logging** (50ms delay)
   - `console.log("themeScheme", themeScheme)` runs on every render

2. **Missing React.memo** on heavy components
   - Unnecessary re-renders in chart components
   - KPI cards re-render without prop changes

3. **Database Query Inefficiencies**
   - Missing indexes on frequently queried fields
   - Suboptimal FlatList performance

4. **Bundle Size Issues**
   - Development code shipped to production
   - Large imports not tree-shaken

5. **Home Tab Fake Data**
   - Dashboard KPI cards showing static/mock data
   - Charts displaying placeholder values instead of real transactions

## 🔧 Implementation Steps

### 1. Remove Console Logging (5 minutes)

**Update**: `app/theme/context.tsx`

```typescript
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme()

  // BEFORE: Always logs
  // console.log("themeScheme", themeScheme)

  // AFTER: Only in development
  if (__DEV__) {
    console.log("themeScheme", colorScheme)
  }

  // Rest of component...
}
```

### 2. Add React.memo to Components (15 minutes)

**Update**: `app/components/dashboard/KPICard.tsx`

```typescript
import React, { memo } from 'react'

export const KPICard = memo(({
  title,
  amount,
  currency,
  icon,
  color
}: KPICardProps) => {
  // Component logic...
  return (
    <View style={themed($container)}>
      {/* Component JSX */}
    </View>
  )
})

KPICard.displayName = 'KPICard'
```

**Update**: `app/components/dashboard/DailyBarChart.tsx`

```typescript
import React, { memo, useMemo } from "react"

export const DailyBarChart = memo(({ data, isLoading }: DailyBarChartProps) => {
  // Memoize expensive calculations
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    return data.map((item, index) => ({
      ...item,
      x: index * 40,
      height: (item.amount / Math.max(...data.map((d) => d.amount))) * 150,
    }))
  }, [data])

  // Component logic...
})

DailyBarChart.displayName = "DailyBarChart"
```

### 3. Database Optimizations (30 minutes)

**Verify**: `app/database/schema.ts`

```typescript
export const appSchema = {
  version: 1,
  tables: [
    {
      name: "transactions",
      columns: [
        { name: "occurred_at", type: "number", isIndexed: true }, // ← ENSURE INDEXED
        { name: "category_id", type: "string", isIndexed: true }, // ← ENSURE INDEXED
        { name: "created_at", type: "number", isIndexed: true }, // ← ENSURE INDEXED
        { name: "trashed_at", type: "number", isOptional: true, isIndexed: true }, // ← ENSURE INDEXED
      ],
    },
  ],
}
```

**Add**: `app/database/performanceMonitor.ts`

```typescript
export const queryPerformanceMonitor = {
  measureQuery: async <T>(queryName: string, queryFn: () => Promise<T>): Promise<T> => {
    const startTime = Date.now()
    const result = await queryFn()
    const duration = Date.now() - startTime

    if (__DEV__ && duration > 100) {
      console.warn(`Slow query: ${queryName} took ${duration}ms`)
    }

    return result
  },
}
```

### 4. FlatList Optimizations (15 minutes)

**Update**: `app/screens/TransactionListScreen.tsx`

```typescript
const ITEM_HEIGHT = 80 // Fixed height for performance

const getItemLayout = (data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})

const keyExtractor = useCallback((item: TransactionItem) => item.id, [])

const renderTransactionItem = useCallback(({ item }: { item: TransactionItem }) => (
  <TransactionItemMemo item={item} onPress={handleItemPress} />
), [handleItemPress])

// Memoized item component
const TransactionItemMemo = memo(({ item, onPress }: {
  item: TransactionItem
  onPress: (id: string) => void
}) => (
  <TouchableOpacity onPress={() => onPress(item.id)}>
    {/* Item content */}
  </TouchableOpacity>
))

<FlatList
  data={transactions}
  keyExtractor={keyExtractor}
  renderItem={renderTransactionItem}
  getItemLayout={getItemLayout} // ← Enables optimizations
  removeClippedSubviews={true}   // ← Memory optimization
  maxToRenderPerBatch={10}       // ← Render batch size
  initialNumToRender={20}        // ← Initial render count
  windowSize={10}                // ← Viewport window
/>
```

### 5. Bundle Optimizations (15 minutes)

**Update**: Import optimizations across components

```typescript
// BEFORE: Import entire libraries
import * as DateFns from "date-fns"

// AFTER: Import only what's needed
import { format } from "date-fns/format"
import { startOfMonth } from "date-fns/startOfMonth"
import { endOfMonth } from "date-fns/endOfMonth"
```

**Create**: `app/utils/devUtils.ts`

```typescript
export const devLog = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`[DEV] ${message}`, data)
  }
}

// Replace all console.log calls with devLog
```

### 6. Replace Fake Data with Real Data (30 minutes)

**Update**: `app/screens/DashboardScreen.tsx`
- Import database context and transaction model
- Add state for loading transactions and loading state
- Create function to load real transactions from database (last 30 days)
- Calculate real KPIs from transaction data (balance, income, expenses for current month)
- Generate daily spending data for chart from real transactions (last 7 days)
- Pass real data to KPICard and DailyBarChart components
- Add proper loading states while data is being fetched

**Update**: `app/components/dashboard/KPICard.tsx`
- Add `isLoading` prop to KPICardProps interface
- Show loading skeleton when `isLoading` is true
- Format currency amounts properly using Intl.NumberFormat
- Handle zero/negative amounts gracefully

**Update**: `app/components/dashboard/DailyBarChart.tsx`
- Handle empty data arrays gracefully
- Show loading state while data is being calculated
- Ensure chart calculations work with real transaction amounts

## ✅ Success Criteria

**Performance:**

- [ ] Console.log removed from production
- [ ] Heavy components use React.memo
- [ ] Database queries properly indexed
- [ ] FlatList optimized for large datasets
- [ ] Real data integration completed for home tab

**Functionality:**

- [ ] No regression in existing features
- [ ] Development debugging preserved
- [ ] Bundle size reduced by 5-10%
- [ ] Render performance improved
- [ ] Dashboard displays real transaction data
- [ ] KPI calculations based on actual user data

## Development Workflow

1. Branch: `git checkout -b feat/task14-quick-performance-wins`
2. Apply all performance optimizations (steps 1-5)
3. Implement real data integration (step 6)
4. Test performance improvements
5. Verify no regressions and data accuracy
6. Create PR to `dev` branch

**Expected Impact**: 20-50ms improvement per interaction, smoother scrolling, smaller bundle
