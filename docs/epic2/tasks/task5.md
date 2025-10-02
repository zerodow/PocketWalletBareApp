# Task 5: Monthly Bar/Line Chart Component

## Overview

Implement a reusable monthly bar/line chart for last 6–12 months, fed by memoized selectors.

## Tasks

- [ ] Create `MonthlyTrendChart` component with props for data, type (bar/line), and colors.
- [ ] Selector for monthly totals over N months.
- [ ] Snapshot tests with fixture data.

## Acceptance Criteria

- [ ] Chart renders totals for at least last 6 months accurately.
- [ ] Responsive on small screens; scroll or compress labels elegantly.
- [ ] Snapshot test passes; no runtime warnings.

## Priority

Medium

## Process

0%

## Estimated Time

4 hours

## Dependencies

- Task 2 (range) for date helpers

## Libraries to Install

- `victory-native` or `react-native-svg-charts` (if not already present)

## Implementation Details

### 1) Component

- Props: `data: {month: string; value: number}[]`, `variant: 'income'|'expense'`, `type: 'bar'|'line'`.

### 2) Selector

- `selectMonthlyTotals(nMonths, type)`: memoized computation from local DB.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task5-monthly-chart`

### When Complete
1. PR with screenshot attached

## Implementation Steps

### Phase 1: Chart & Selector
1. Install chart library if needed.
2. Build component and selector; add story/snapshot test with fixtures.
