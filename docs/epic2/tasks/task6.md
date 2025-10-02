# Task 6: Daily Heatmap Component

## Overview

Add a daily spending heatmap for the selected month with color intensity based on total per day.

## Tasks

- [ ] `DailyHeatmap` component rendering a 7×5/6 grid for the month.
- [ ] Selector for per-day totals in current range.
- [ ] Empty-state for months with sparse data.

## Acceptance Criteria

- [ ] Correct alignment of days to weekdays; proper month padding.
- [ ] Color scale reflects relative spend per day; accessible contrast.
- [ ] Works for 28–31 day months; no layout shifts.

## Priority

Medium

## Process

0%

## Estimated Time

4 hours

## Dependencies

- Task 2 (range selectors)

## Libraries to Install

None (use `react-native-svg` if needed, else simple views)

## Implementation Details

### 1) Component

- Inputs: `days: {date: string; value: number}[]`, `min`, `max` to derive scale.

### 2) Selector

- `selectDailyTotals(month)`: memoized totals by date.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task6-daily-heatmap`

### When Complete
1. PR with screenshots (light/dark)

## Implementation Steps

### Phase 1: Heatmap & Data
1. Build grid layout; implement selector; test February and 31-day months.
