# PocketWallet Local Database Specification

**Version:** 6
**Database Engine:** WatermelonDB with SQLite Adapter (JSI enabled)
**Database Name:** `PocketWallet`
**Last Updated:** 2025-10-09
**Target Audience:** LLMs, developers, architects

---

## 1. Global Conventions

### 1.1 Naming Conventions
- **Database columns**: `snake_case` (e.g., `amount_minor_units`, `category_id`)
- **Model properties**: `camelCase` (e.g., `amountMinorUnits`, `categoryId`)
- **Table names**: lowercase plural (e.g., `categories`, `transactions`, `monthly_budgets`)

### 1.2 ID Generation
- **Primary Key**: WatermelonDB auto-generates UUIDs (v4) for all records
- **Composite ID Pattern**: Some models use static `generateId()` methods for deterministic IDs:
  - `MonthlyStatistics`: `{year}-{MM}` (e.g., `"2025-03"`)
  - `DailyStatistics`: `{year}-{MM}-{DD}` (e.g., `"2025-03-15"`)
  - `CategoryStatistics`: `{year}-{MM}-{categoryId}` (e.g., `"2025-03-abc123"`)
  - `MonthlyBudget`: `budget-{year}-{MM}` (e.g., `"budget-2025-03"`)

### 1.3 Date/Time Fields
- **Timestamps**: Stored as Unix epoch milliseconds (`number` type)
- **Date strings**: `YYYY-MM-DD` format for `daily_statistics.date`
- **ISO-8601**: Not used in database; timestamps are numeric
- **Indexed**: `created_at`, `updated_at`, `occurred_at`, `trashed_at` are indexed for performance

### 1.4 Money & Currency
- **Minor Units**: All monetary amounts stored in smallest currency unit (e.g., cents for USD, dong for VND)
- **Field**: `amount_minor_units` (type: `number`)
- **Currency Code**: ISO 4217 codes (e.g., `"USD"`, `"VND"`)
- **Precision**: Integer storage prevents floating-point errors
- **Display**: Convert to major units in UI layer (divide by currency divisor)

### 1.5 Enums
All enums are stored as string literals:

```typescript
// Sync status (shared across Category and Transaction)
type SyncStatus = "pending" | "syncing" | "synced" | "failed"

// Transaction type (derived from Category.is_income)
type TransactionType = "income" | "expense"
```

### 1.6 Sync Semantics
- **Offline-first**: All data created locally with `pending` status
- **Sync fields**:
  - `{entity}_sync_status`: Current sync state
  - `synced_at`: Timestamp of last successful sync (optional)
- **Conflict resolution**: Not implemented (future consideration)

### 1.7 Soft Delete
- **Pattern**: Timestamp-based soft delete via `deleted_at` or `trashed_at` fields
- **Semantics**:
  - `null`/`undefined`: Active record
  - Unix timestamp: Trashed/deleted at this time
- **Tables using soft delete**:
  - `categories.deleted_at`
  - `transactions.trashed_at` (supports trash/recycle bin feature)

### 1.8 PII & Security
- **No user authentication data**: Auth stored in encrypted MMKV (not database)
- **No sensitive PII**: Only transaction descriptions (user-generated)
- **Local-only**: Database is device-local SQLite

---

## 2. System Overview

### 2.1 Architecture
- **Local-first**: Authoritative data source is on-device
- **Normalized**: Transactions reference Categories via foreign key
- **Denormalized aggregates**: Statistics tables cache computed values
- **WatermelonDB**: ORM with reactive queries and lazy loading
- **JSI**: JavaScript Interface for native performance

### 2.2 Data Flow
1. User creates/edits transaction → `transactions` table (status: `pending`)
2. Background observer → Updates `monthly_statistics`, `daily_statistics`, `category_statistics`
3. Sync service (future) → Pushes changes to server, updates `*_sync_status`

### 2.3 Performance Optimizations
- **Indexed fields**: Composite indexes on year/month for statistics queries
- **Pagination**: Use `DatabaseQueries.getTransactionsPaginated()`
- **Lazy relations**: WatermelonDB loads relations on-demand
- **JSI mode**: Direct native SQLite access (no bridge)

---

## 3. Global JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PocketWallet Database Schema",
  "version": 6,
  "tables": {
    "categories": {
      "primary_key": "id",
      "relations": ["has_many:transactions"],
      "soft_delete": "deleted_at"
    },
    "transactions": {
      "primary_key": "id",
      "relations": ["belongs_to:categories"],
      "soft_delete": "trashed_at"
    },
    "monthly_statistics": {
      "primary_key": "id",
      "composite_key": ["year", "month"],
      "denormalized": true
    },
    "daily_statistics": {
      "primary_key": "id",
      "composite_key": ["year", "month", "day"],
      "denormalized": true
    },
    "category_statistics": {
      "primary_key": "id",
      "composite_key": ["category_id", "year", "month"],
      "denormalized": true
    },
    "monthly_budgets": {
      "primary_key": "id",
      "composite_key": ["year", "month"]
    }
  }
}
```

---

## 4. Table-by-Table Breakdown

### 4.1 Table: `categories`

**Purpose**: Stores income/expense categories for transaction classification.

**Sync Scope**: User-specific (with system defaults seeded on first run)

**PII Level**: None

**Lifecycle**:
- Created: App initialization (defaults) or user action
- Updated: User edits category properties or reorders
- Deleted: Soft-deleted via `deleted_at` timestamp

---

#### 4.1.1 Columns

| Column | Type | Nullable | Indexed | Description |
|--------|------|----------|---------|-------------|
| `id` | string | NO | YES (PK) | WatermelonDB UUID (auto-generated) |
| `name` | string | NO | NO | Display name (e.g., "Groceries", "Salary") |
| `color` | string | NO | NO | Hex color code (e.g., "#FF5733") |
| `icon` | string | NO | NO | Icon identifier (e.g., "food", "money") |
| `is_income` | boolean | NO | NO | `true` for income categories, `false` for expense |
| `sort_order` | number | NO | YES | User-defined display order (0-based) |
| `is_default` | boolean | NO | NO | System default category (seeded on init) |
| `deleted_at` | number | YES | NO | Soft delete timestamp (Unix ms), `null` if active |
| `category_sync_status` | string | NO | YES | Sync status: `"pending"`, `"syncing"`, `"synced"`, `"failed"` |
| `created_at` | number | NO | YES | Creation timestamp (Unix ms) |
| `updated_at` | number | NO | YES | Last update timestamp (Unix ms) |

---

#### 4.1.2 Relations

- **Has Many**: `transactions` (via `transactions.category_id`)

---

#### 4.1.3 Indexes

- Primary: `id`
- Secondary: `sort_order`, `category_sync_status`, `created_at`, `updated_at`

---

#### 4.1.4 Validation Rules

- `name`: Non-empty string, max 50 characters
- `color`: Valid hex color (e.g., `#RRGGBB`)
- `icon`: Non-empty string, maps to UI icon library
- `sort_order`: Non-negative integer, unique per user
- `category_sync_status`: Must be one of enum values

---

#### 4.1.5 Sample Row (JSON)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Groceries",
  "color": "#4CAF50",
  "icon": "cart",
  "is_income": false,
  "sort_order": 0,
  "is_default": true,
  "deleted_at": null,
  "category_sync_status": "synced",
  "created_at": 1709856000000,
  "updated_at": 1709856000000
}
```

---

### 4.2 Table: `transactions`

**Purpose**: Core financial transaction records (income/expense).

**Sync Scope**: User-specific

**PII Level**: Low (user-generated descriptions may contain personal info)

**Lifecycle**:
- Created: User adds transaction
- Updated: User edits amount, category, date, or description
- Trashed: Soft-deleted via `trashed_at` (supports undo)
- Permanently deleted: Hard delete after trash retention period

---

#### 4.2.1 Columns

| Column | Type | Nullable | Indexed | Description |
|--------|------|----------|---------|-------------|
| `id` | string | NO | YES (PK) | WatermelonDB UUID (auto-generated) |
| `amount_minor_units` | number | NO | NO | Amount in minor currency units (e.g., cents) |
| `currency_code` | string | NO | NO | ISO 4217 currency code (e.g., "USD", "VND") |
| `description` | string | NO | NO | User-provided description (max 200 chars) |
| `occurred_at` | number | NO | YES | Transaction date/time (Unix ms) |
| `category_id` | string | NO | YES (FK) | Reference to `categories.id` |
| `trashed_at` | number | YES | YES | Soft delete timestamp (Unix ms), `null` if active |
| `transaction_sync_status` | string | NO | YES | Sync status: `"pending"`, `"syncing"`, `"synced"`, `"failed"` |
| `synced_at` | number | YES | NO | Last successful sync timestamp (Unix ms) |
| `is_mock` | boolean | YES | NO | `true` if seeded dev data (DEV builds only) |
| `created_at` | number | NO | YES | Creation timestamp (Unix ms) |
| `updated_at` | number | NO | YES | Last update timestamp (Unix ms) |

---

#### 4.2.2 Relations

- **Belongs To**: `categories` (via `category_id`)

---

#### 4.2.3 Indexes

- Primary: `id`
- Secondary: `occurred_at`, `category_id`, `trashed_at`, `transaction_sync_status`, `created_at`, `updated_at`

---

#### 4.2.4 Validation Rules

- `amount_minor_units`: Non-zero integer
- `currency_code`: Valid ISO 4217 code
- `description`: Non-empty string, max 200 characters
- `occurred_at`: Valid Unix timestamp, not future-dated
- `category_id`: Must reference existing non-deleted category
- `transaction_sync_status`: Must be one of enum values

---

#### 4.2.5 Sample Row (JSON)

```json
{
  "id": "660e9500-f39c-51e5-b827-557766551002",
  "amount_minor_units": 2599,
  "currency_code": "USD",
  "description": "Weekly grocery shopping",
  "occurred_at": 1709913600000,
  "category_id": "550e8400-e29b-41d4-a716-446655440001",
  "trashed_at": null,
  "transaction_sync_status": "pending",
  "synced_at": null,
  "is_mock": false,
  "created_at": 1709913600000,
  "updated_at": 1709913600000
}
```

---

### 4.3 Table: `monthly_statistics`

**Purpose**: Pre-computed monthly aggregates for dashboard KPIs.

**Sync Scope**: Derived data (computed locally, not synced)

**PII Level**: None

**Lifecycle**:
- Created: First transaction in a month
- Updated: On transaction create/update/delete via `statisticsObserver`
- Deleted: Manual cleanup or data reset

---

#### 4.3.1 Columns

| Column | Type | Nullable | Indexed | Description |
|--------|------|----------|---------|-------------|
| `id` | string | NO | YES (PK) | Deterministic ID: `{year}-{MM}` (e.g., "2025-03") |
| `year` | number | NO | YES | Calendar year (e.g., 2025) |
| `month` | number | NO | YES | Month (1-12) |
| `total_income` | number | NO | NO | Sum of income transactions (minor units) |
| `total_expense` | number | NO | NO | Sum of expense transactions (minor units) |
| `savings_amount` | number | NO | NO | `total_income - total_expense` (minor units) |
| `transaction_count` | number | NO | NO | Total transaction count (both types) |
| `created_at` | number | NO | NO | Creation timestamp (Unix ms) |
| `updated_at` | number | NO | NO | Last recalculation timestamp (Unix ms) |

---

#### 4.3.2 Relations

None (denormalized aggregate)

---

#### 4.3.3 Indexes

- Primary: `id`
- Composite: `(year, month)`

---

#### 4.3.4 Validation Rules

- `year`: 4-digit year (e.g., 2025)
- `month`: Integer 1-12
- `total_income`, `total_expense`: Non-negative integers
- `savings_amount`: Can be negative (if expenses > income)
- `transaction_count`: Non-negative integer

---

#### 4.3.5 Sample Row (JSON)

```json
{
  "id": "2025-03",
  "year": 2025,
  "month": 3,
  "total_income": 500000,
  "total_expense": 325000,
  "savings_amount": 175000,
  "transaction_count": 42,
  "created_at": 1709244000000,
  "updated_at": 1709913600000
}
```

---

### 4.4 Table: `daily_statistics`

**Purpose**: Day-level aggregates for charts and trend analysis.

**Sync Scope**: Derived data (computed locally, not synced)

**PII Level**: None

**Lifecycle**:
- Created: First transaction on a date
- Updated: On transaction changes via `statisticsObserver`
- Deleted: Manual cleanup or data reset

---

#### 4.4.1 Columns

| Column | Type | Nullable | Indexed | Description |
|--------|------|----------|---------|-------------|
| `id` | string | NO | YES (PK) | Deterministic ID: `{year}-{MM}-{DD}` (e.g., "2025-03-15") |
| `date` | string | NO | YES | Date in `YYYY-MM-DD` format |
| `year` | number | NO | YES | Calendar year |
| `month` | number | NO | YES | Month (1-12) |
| `day` | number | NO | NO | Day of month (1-31) |
| `total_income` | number | NO | NO | Daily income sum (minor units) |
| `total_expense` | number | NO | NO | Daily expense sum (minor units) |
| `net_amount` | number | NO | NO | `total_income - total_expense` (minor units) |
| `transaction_count` | number | NO | NO | Daily transaction count |
| `created_at` | number | NO | NO | Creation timestamp (Unix ms) |
| `updated_at` | number | NO | NO | Last recalculation timestamp (Unix ms) |

---

#### 4.4.2 Relations

None (denormalized aggregate)

---

#### 4.4.3 Indexes

- Primary: `id`
- Secondary: `date`, `year`, `month`

---

#### 4.4.4 Validation Rules

- `date`: Valid ISO date string (`YYYY-MM-DD`)
- `year`, `month`, `day`: Valid calendar values
- `total_income`, `total_expense`: Non-negative integers
- `net_amount`: Can be negative
- `transaction_count`: Non-negative integer

---

#### 4.4.5 Sample Row (JSON)

```json
{
  "id": "2025-03-15",
  "date": "2025-03-15",
  "year": 2025,
  "month": 3,
  "day": 15,
  "total_income": 0,
  "total_expense": 12500,
  "net_amount": -12500,
  "transaction_count": 3,
  "created_at": 1710460800000,
  "updated_at": 1710460800000
}
```

---

### 4.5 Table: `category_statistics`

**Purpose**: Monthly category-level spending analysis.

**Sync Scope**: Derived data (computed locally, not synced)

**PII Level**: None

**Lifecycle**:
- Created: First transaction for category in a month
- Updated: On transaction changes via `statisticsObserver`
- Deleted: Manual cleanup or data reset

---

#### 4.5.1 Columns

| Column | Type | Nullable | Indexed | Description |
|--------|------|----------|---------|-------------|
| `id` | string | NO | YES (PK) | Deterministic ID: `{year}-{MM}-{categoryId}` |
| `category_id` | string | NO | YES | Reference to `categories.id` |
| `year` | number | NO | YES | Calendar year |
| `month` | number | NO | YES | Month (1-12) |
| `total_amount` | number | NO | NO | Category total (minor units) |
| `transaction_count` | number | NO | NO | Transaction count for category |
| `percentage_of_month` | number | NO | NO | % of monthly total (0-100) |
| `average_amount` | number | NO | NO | Average transaction amount (minor units) |
| `created_at` | number | NO | NO | Creation timestamp (Unix ms) |
| `updated_at` | number | NO | NO | Last recalculation timestamp (Unix ms) |

---

#### 4.5.2 Relations

- **Logical reference**: `category_id` → `categories.id` (not enforced FK)

---

#### 4.5.3 Indexes

- Primary: `id`
- Composite: `(category_id, year, month)`

---

#### 4.5.4 Validation Rules

- `category_id`: Must match existing category
- `year`, `month`: Valid calendar values
- `total_amount`: Non-negative integer
- `transaction_count`: Non-negative integer
- `percentage_of_month`: Float 0.0-100.0
- `average_amount`: `total_amount / transaction_count`

---

#### 4.5.5 Sample Row (JSON)

```json
{
  "id": "2025-03-550e8400-e29b-41d4-a716-446655440001",
  "category_id": "550e8400-e29b-41d4-a716-446655440001",
  "year": 2025,
  "month": 3,
  "total_amount": 45000,
  "transaction_count": 8,
  "percentage_of_month": 13.85,
  "average_amount": 5625,
  "created_at": 1709244000000,
  "updated_at": 1709913600000
}
```

---

### 4.6 Table: `monthly_budgets`

**Purpose**: User-defined monthly spending budgets.

**Sync Scope**: User-specific

**PII Level**: None

**Lifecycle**:
- Created: User sets budget for a month
- Updated: User edits budget amount
- Deleted: Hard delete (or set amount to 0)

---

#### 4.6.1 Columns

| Column | Type | Nullable | Indexed | Description |
|--------|------|----------|---------|-------------|
| `id` | string | NO | YES (PK) | Deterministic ID: `budget-{year}-{MM}` |
| `year` | number | NO | YES | Calendar year |
| `month` | number | NO | YES | Month (1-12) |
| `budget_amount` | number | NO | NO | Budget limit (minor units) |
| `currency_code` | string | NO | NO | ISO 4217 currency code |
| `created_at` | number | NO | NO | Creation timestamp (Unix ms) |
| `updated_at` | number | NO | NO | Last update timestamp (Unix ms) |

---

#### 4.6.2 Relations

None (standalone entity)

---

#### 4.6.3 Indexes

- Primary: `id`
- Composite: `(year, month)`

---

#### 4.6.4 Validation Rules

- `year`, `month`: Valid calendar values
- `budget_amount`: Positive integer
- `currency_code`: Valid ISO 4217 code (should match user's default currency)

---

#### 4.6.5 Sample Row (JSON)

```json
{
  "id": "budget-2025-03",
  "year": 2025,
  "month": 3,
  "budget_amount": 300000,
  "currency_code": "USD",
  "created_at": 1709244000000,
  "updated_at": 1709244000000
}
```

---

## 5. Query Patterns

### 5.1 Common Queries

**Get active transactions for a month:**
```typescript
// Indexed on: occurred_at, trashed_at
database.collections
  .get('transactions')
  .query(
    Q.where('occurred_at', Q.gte(startOfMonth)),
    Q.where('occurred_at', Q.lte(endOfMonth)),
    Q.where('trashed_at', null)
  )
```

**Get monthly statistics:**
```typescript
// Direct lookup via composite ID
database.collections
  .get('monthly_statistics')
  .findById(`${year}-${month.toString().padStart(2, '0')}`)
```

**Get categories for transaction type:**
```typescript
// Filtered by is_income, sorted by sort_order
database.collections
  .get('categories')
  .query(
    Q.where('is_income', isIncome),
    Q.where('deleted_at', null),
    Q.sortBy('sort_order', Q.asc)
  )
```

### 5.2 Performance Considerations

- Use indexed fields in `WHERE` clauses
- Paginate transaction lists with `Q.take()` and `Q.skip()`
- Batch writes with `database.write()` for statistics updates
- Lazy-load relations (don't fetch category for every transaction)

---

## 6. Migration History

| Version | Date | Changes |
|---------|------|---------|
| 1 | N/A | Initial schema (categories, transactions) |
| 2 | N/A | Added soft delete + sync fields to transactions |
| 3 | N/A | Added sort_order, is_default, soft delete to categories |
| 4 | N/A | Added is_mock flag to transactions |
| 5 | N/A | Added statistics tables (monthly, daily, category) |
| 6 | Current | Added monthly_budgets table |

---

## 7. Future Considerations

### 7.1 Planned Enhancements
- **Recurring transactions**: Template-based auto-generation
- **Multi-account support**: Wallet accounts with balances
- **Attachments**: Receipt images linked to transactions
- **Tags**: Many-to-many tagging for transactions
- **Server sync**: Backend API integration with conflict resolution

### 7.2 Schema Evolution
- Add `accounts` table with `balance` tracking
- Add `recurring_templates` table
- Add `attachments` table with foreign key to transactions
- Add `tags` and `transaction_tags` junction table

---

## 8. LLM Usage Notes

### 8.1 Code Generation
When generating queries or mutations:
- Use WatermelonDB `Q` API (not raw SQL)
- Always check for `trashed_at === null` or `deleted_at === null`
- Use composite IDs for statistics lookups
- Convert minor units to major units in UI layer

### 8.2 Data Integrity
- Never delete categories with existing transactions
- Always update statistics after transaction changes
- Respect indexed fields for query performance
- Use `database.write()` for all mutations

### 8.3 Business Logic
- Income transactions: `category.is_income === true`
- Expense transactions: `category.is_income === false`
- Soft delete transactions to trash before hard delete
- Budget comparison: `monthly_statistics.total_expense` vs `monthly_budgets.budget_amount`

---

**End of Specification**
