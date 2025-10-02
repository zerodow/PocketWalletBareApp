# Task 11: Transaction List Pagination

**Epic**: Epic 1 - Core Features & Local Database  
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Dependencies**: Tasks 1-10 (Foundation & Core Features)

## 🎯 Objective

Add pagination to transaction lists to fix 2-3 second delays when switching to transaction tab with large datasets.

## 📋 Problem

Current implementation loads ALL transactions at once causing UI freezes:

```typescript
// Problem: Loads everything into memory
const records = await transactionsCollection.query().fetch()
```

## 🚀 Solution

Implement paginated loading with infinite scroll:

- Load 20 transactions initially
- Load more on scroll
- Cache pages in memory

## 🔧 Implementation Steps

### 1. Add Paginated Database Query (1 hour)

**Create**: `app/database/queries.ts`

```typescript
async getTransactionsPaginated(
  page: number = 0,
  limit: number = 20
): Promise<{
  transactions: Transaction[]
  hasMore: boolean
  totalCount: number
}> {
  const offset = page * limit

  const transactions = await database
    .get<Transaction>("transactions")
    .query(
      Q.where("trashed_at", Q.eq(null)),
      Q.sortBy("occurred_at", Q.desc),
      Q.skip(offset),
      Q.take(limit)
    )
    .fetch()

  const totalCount = await database
    .get<Transaction>("transactions")
    .query(Q.where("trashed_at", Q.eq(null)))
    .fetchCount()

  return {
    transactions,
    hasMore: (offset + limit) < totalCount,
    totalCount
  }
}
```

### 2. Update Transaction List Screen (1.5 hours)

**Update**: `app/screens/TransactionListScreen.tsx`

Add pagination state:

```typescript
interface PaginationState {
  currentPage: number
  hasMore: boolean
  isLoadingMore: boolean
  totalCount: number
  pageSize: number
}

const [pagination, setPagination] = useState<PaginationState>({
  currentPage: 0,
  hasMore: true,
  isLoadingMore: false,
  totalCount: 0,
  pageSize: 20,
})
```

Update load function:

```typescript
const loadTransactions = async (reset: boolean = true) => {
  const page = reset ? 0 : pagination.currentPage
  const result = await DatabaseQueries.getTransactionsPaginated(page, 20)

  if (reset) {
    setTransactions(result.transactions)
  } else {
    setTransactions((prev) => [...prev, ...result.transactions])
  }

  setPagination((prev) => ({
    ...prev,
    currentPage: page + 1,
    hasMore: result.hasMore,
    totalCount: result.totalCount,
  }))
}
```

### 3. Add Infinite Scroll FlatList (0.5 hours)

Update FlatList:

```typescript
<FlatList
  data={transactions}
  keyExtractor={(item) => item.id}
  renderItem={renderTransactionItem}

  // Pagination
  onEndReached={() => loadTransactions(false)}
  onEndReachedThreshold={0.1}

  // Performance
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  initialNumToRender={20}
  windowSize={10}
/>
```

Add loading footer:

```typescript
const renderFooter = () => {
  if (!pagination.isLoadingMore) return null
  return (
    <View style={$loadingFooter}>
      <ActivityIndicator size="small" />
      <Text>Loading more...</Text>
    </View>
  )
}
```

### 4. Testing (1 hour)

**Test Cases:**

- [ ] Initial load shows first 20 transactions
- [ ] Scroll triggers pagination
- [ ] Pull-to-refresh resets pagination
- [ ] Loading states display correctly
- [ ] Performance under 200ms per page

## ✅ Success Criteria

**Performance:**

- [ ] Initial load: <100ms
- [ ] Pagination load: <200ms
- [ ] Tab switch: <150ms
- [ ] Memory usage capped

**Functionality:**

- [ ] Infinite scroll works smoothly
- [ ] Pull-to-refresh works
- [ ] Loading indicators shown
- [ ] No duplicate items

## Development Workflow

1. Branch: `git checkout -b feat/task11-transaction-list-pagination`
2. Implement changes above
3. Test with large datasets
4. Create PR to `dev` branch

**Expected Impact**: Eliminates 2-3 second delays, improves memory usage by 80%
