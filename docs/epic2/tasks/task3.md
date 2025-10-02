# Task 3: Savings Rate Selectors + Unit Tests

## Overview

Implement savings rate calculation for month and YTD: `(Income − Expense) / Income`, with decimal-safe math and tests.

## Tasks

- [ ] Add `selectSavingsRate(range)` using decimal math and minor units.
- [ ] Handle `Income == 0` (return 0 and flag edge case).
- [ ] Unit tests with fixtures for rounding half up.

## Acceptance Criteria

- [ ] Savings % computed matches fixtures across ranges and rounding.
- [ ] No floating-point drift; uses decimal utilities.
- [ ] Edge cases covered in tests (Income=0, tiny totals).

## Priority

High

## Process

0%

## Estimated Time

4 hours

## Dependencies

- Task 2 (range selectors, totals)
- Money utils from Epic 1 (decimal/rounding)

## Libraries to Install

None

## Implementation Details

### 1) Selector

- `selectSavingsRate(range)`: compute using `selectTotals` and decimal utils.

### 2) Tests

- Fixtures: amounts and expected percentages (minor units). Verify rounding.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task3-savings-rate`

### When Complete
1. PR with unit test coverage screenshots or summary

## Implementation Steps

### Phase 1: Implement & Test
1. Implement selector with guard for zero income.
2. Add unit tests with ≥6 cases including edge cases.
