# Task 2: Time Range State & Selectors Base

## Overview

Create time-range state and foundational selectors for month, YTD, and custom ranges to support analytics queries.

## Tasks

- [ ] Add `analyticsStore` slice for `selectedRange` and presets (This Month, Last Month, YTD, Custom).
- [ ] Utility date helpers for month boundaries and rolling windows.
- [ ] Base selectors: totals by range (income, expense).

## Acceptance Criteria

- [ ] Switching presets updates the store and recomputes base totals.
- [ ] Date helpers return correct start/end across months and year boundaries.
- [ ] Unit tests cover month and YTD boundaries.

## Priority

High

## Process

0%

## Estimated Time

3.5 hours

## Dependencies

- Task 1 scaffold exists
- Epic 1 DB models for transactions

## Libraries to Install

None

## Implementation Details

### 1) State & Helpers

- Add `selectedRange` with `{type: 'month'|'ytd'|'custom', from, to}`.
- Date helpers: `startOfMonth`, `endOfMonth`, `rangeForPreset`.

### 2) Selectors

- `selectTotals(range)`: sums income/expense using local DB queries.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task2-range-selectors`

### When Complete
1. PR with unit test results

## Implementation Steps

### Phase 1: Store & Helpers
1. Add store slice, presets, and date utilities.
2. Implement base totals selector and tests.
