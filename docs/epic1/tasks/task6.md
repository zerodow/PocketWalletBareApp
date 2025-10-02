# Task 6: Mobile Dashboard

## Overview

Create a monthly financial dashboard with KPIs, charts, and month navigation for quick financial insights.

## Tasks

- [ ] Month switcher header
- [ ] KPIs: Income, Expense, Savings % = (Income − Expense) / Income
- [ ] Charts: daily bar; category donut
- [ ] Load ≤ 2s with memoized selectors

## Acceptance Criteria

- Month switcher allows navigation between different months/years
- Current month is highlighted and easy to identify
- Income KPI displays total monthly income correctly
- Expense KPI displays total monthly expenses correctly
- Savings % calculated as (Income - Expense) / Income \* 100
- Savings % handles edge cases (zero income, negative savings)
- Daily bar chart shows spending patterns across the month
- Category donut chart shows expense breakdown by category
- Dashboard loads in ≤2 seconds (performance requirement)
- Data is properly memoized to prevent unnecessary re-calculations
- Charts are responsive and work on different screen sizes
- Empty states handled gracefully (no data for selected month)
- Pull-to-refresh functionality for real-time updates

## Priority

High

## Process

✅ **COMPLETED** - All acceptance criteria satisfied

## Estimated Time

10-12 hours

## Dependencies

- Task 2 (Database & Models) completed (local DB + models available)
- Task 4 (Transactions UI) for transaction data and integration
- Task 5 (Categories) for category data and integration

## Libraries to Install

- `react-native-chart-kit` or `victory-native` (for charts)
  - **Note**: Consider implementing custom charts if requirements are simple, as third-party libraries may not fit specific requirements
  - **Note**: If using chart libraries, use context7 MCP tool to get up-to-date documentation and implementation context
- `date-fns` or `moment` (for date manipulation)
- `react-native-svg` (required for chart libraries or custom SVG-based charts)
- `lodash` or similar (for data grouping and calculations)

## Implementation Details

### 1) Screens & Components

- `DashboardScreen`:
  - Main dashboard container with month switcher and KPIs
  - Scrollable layout with RefreshControl for pull-to-refresh
  - Loading states and error handling for data fetching
  - Responsive layout for different screen sizes

- Reusable UI components:
  - `MonthSwitcher`: Navigation component with prev/next month buttons and current month display
  - `KPICard`: Displays individual KPI (Income, Expense, Savings %) with formatting
  - `DailyBarChart`: Bar chart showing daily spending patterns across the month
  - `CategoryDonutChart`: Donut/pie chart showing expense breakdown by category
  - `EmptyStateCard`: Displays when no data available for selected month

### 2) Navigation

- Entry point: Dashboard should be accessible from main tab navigation or home screen
- The `DashboardScreen` integrates with existing navigation structure
- Deep linking support for specific months (optional)

### 3) State Management (Zustand)

- `dashboardStore` (or extend existing stores):
  - Holds dashboard data: `selectedMonth`, `kpiData`, `chartData`, `isLoading`
  - Memoized selectors: `getKPIsForMonth`, `getDailyDataForMonth`, `getCategoryDataForMonth`
  - Actions: `setSelectedMonth`, `refreshDashboard`, `calculateKPIs`
  - These actions will query the local database and calculate analytics

### 4) Database & Models

- **Analytics Queries**:
  - Monthly income sum: `SELECT SUM(amount) FROM transactions WHERE type='income' AND month=? AND deletedAt IS NULL`
  - Monthly expense sum: `SELECT SUM(amount) FROM transactions WHERE type='expense' AND month=? AND deletedAt IS NULL`
  - Daily breakdown: `SELECT DATE(date), SUM(amount) FROM transactions GROUP BY DATE(date)`
  - Category breakdown: `SELECT categoryId, SUM(amount) FROM transactions WHERE type='expense' GROUP BY categoryId`

- **Cached Data Model** (optional for performance):
  - `monthly_analytics` table:
    - `id` (string, UUID)
    - `month` (string, YYYY-MM format)
    - `totalIncome` (number)
    - `totalExpense` (number)
    - `savingsRate` (number)
    - `lastCalculated` (timestamp)

### 5) UX & Performance

- Use `React.memo` for chart components to prevent unnecessary re-renders
- Implement memoized selectors using `useMemo` and `useCallback` hooks
- Pre-calculate common aggregations and cache results
- Lazy load chart libraries to reduce initial bundle size
- Implement skeleton loading states for better perceived performance
- Use Vietnamese number formatting with proper comma separators
- Handle edge cases gracefully (zero income, negative savings, no data)

### 6) Testing

- **Unit**:
  - KPI calculation functions (income, expense, savings percentage)
  - Date manipulation and month navigation logic
  - Vietnamese number formatting
  - Edge case handling (division by zero, negative values)
- **Component**:
  - KPI cards render correct values and formatting
  - Charts display data correctly and handle loading states
  - Month switcher navigation works properly
  - Pull-to-refresh functionality
- **Performance**:
  - Dashboard loads within 2 seconds with sample data
  - Memory usage during chart rendering
  - Smooth scrolling with large datasets

## Development Workflow

### Before Starting

1. Create a new feature branch: `git checkout -b feat/task6-mobile-dashboard`
2. Start development work

### When Complete

1. Commit all changes with descriptive messages
2. Push branch to remote repository
3. Create PR using GitHub MCP: Use `mcp__github__create_pull_request` to create PR targeting `dev` branch
4. Add comprehensive PR description with implementation details and test results

## Implementation Steps

### Phase 1: Setup & Dependencies

1. **Install Dependencies**: Add required chart and utility libraries.
   - `yarn add react-native-chart-kit react-native-svg date-fns lodash`
   - Follow platform-specific setup for react-native-svg
2. **Create Store**: Implement dashboard store with selectors.
   - `app/store/dashboardStore.ts`: Zustand store for dashboard state and analytics
3. **Create Files**: Scaffold the dashboard screen and components.
   - `app/screens/DashboardScreen.tsx`
   - `app/components/dashboard/MonthSwitcher.tsx`
   - `app/components/dashboard/KPICard.tsx`
   - `app/components/dashboard/DailyBarChart.tsx`
   - `app/components/dashboard/CategoryDonutChart.tsx`
4. **Update Navigation**:
   - Add `Dashboard` route to `app/navigators/MainNavigator.tsx`
   - Update tab navigation or main menu to include dashboard entry point

### Phase 2: Core Dashboard Implementation

5. **Implement Dashboard Store**:
   - Create memoized selectors for KPI calculations
   - Add actions for month navigation and data refreshing
   - Integrate with transaction and category stores
6. **Build Month Switcher**:
   - Navigation between months with prev/next buttons
   - Display current month in Vietnamese format
   - Handle year transitions properly
7. **Implement KPI Cards**:
   - Income, Expense, and Savings % calculations
   - Vietnamese number formatting with proper comma separators
   - Handle edge cases (zero income, negative savings)
8. **Create Chart Components**:
   - Daily bar chart showing spending patterns across days
   - Category donut chart with proper color coding and labels
   - Loading states and error handling for both charts
   - **Note**: For simple charts, consider custom implementation using React Native's built-in components and animations instead of external libraries

### Phase 3: Performance & Polish

9. **Optimize Performance**:
   - Implement memoization for expensive calculations
   - Add proper loading states and skeleton screens
   - Test with large datasets to ensure ≤2s load time
10. **Add Interactive Features**:
    - Pull-to-refresh for real-time data updates
    - Empty states for months with no data
    - Chart interactions (tap to show details)
11. **Integration & Testing**:
    - Integrate with existing transaction and category data
    - Perform performance testing with 1000+ transactions
    - Manual testing across different screen sizes and orientations
