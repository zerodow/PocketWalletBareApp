# Task 9: Year-over-Year Comparison (Y/Y)

## Overview

Implement Y/Y comparison for the same month last year, mirroring M/M structure.

## Tasks

- [ ] Selector: `selectYoY(range)` for current month vs same month last year.
- [ ] UI table: metric, current, last year, Δ, Δ%.
- [ ] Graceful handling when last year data missing.

## Acceptance Criteria

- [ ] Δ and Δ% computed correctly; units formatted properly.
- [ ] Works across leap years and year boundaries.
- [ ] Matches M/M table look and feel.

## Priority

Medium

## Process

0%

## Estimated Time

3.5 hours

## Dependencies

- Task 8 (table), Task 2 (ranges)

## Libraries to Install

None

## Implementation Details

### 1) Selector

- Compute same-month-last-year window; reuse KPI selectors.

### 2) UI

- Reuse table component from Task 8 with different labels.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task9-yoy-compare`

### When Complete
1. PR with tests

## Implementation Steps

### Phase 1: Selector & UI
1. Implement `selectYoY`; integrate with table; add unit tests.
