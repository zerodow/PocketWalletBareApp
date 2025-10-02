# Task 7: KPI Cards Component

## Overview

Create KPI cards for Income, Expense, Savings %, with compact layout and trend arrows.

## Tasks

- [ ] `KpiCards` component with three cards and small delta indicator.
- [ ] Selectors for current month KPI and previous month for delta.
- [ ] Formatting utils (currency, percent) reused from Epic 1.

## Acceptance Criteria

- [ ] Cards show current values and up/down/flat indicators.
- [ ] Values formatted correctly; supports VN locale.
- [ ] No jank on load; sub-200ms render on data change.

## Priority

Medium

## Process

0%

## Estimated Time

3 hours

## Dependencies

- Task 2 (ranges); Task 3 (savings)

## Libraries to Install

None

## Implementation Details

### 1) Component

- Props: `income`, `expense`, `savingsRate`, `deltas`.

### 2) Selectors

- `selectKpis(range)` and `selectKpiDeltas()` vs previous month.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task7-kpi-cards`

### When Complete
1. PR with screenshots

## Implementation Steps

### Phase 1: KPIs & Deltas
1. Build component; wire selectors; verify on device.
