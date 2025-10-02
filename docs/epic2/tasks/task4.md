# Task 4: Fixed/Variable Flags & Shares

## Overview

Support fixed vs variable expense shares by honoring category flags and computing ratios over total expenses.

## Tasks

- [ ] Confirm or add `isFixed` flag on categories (local only).
- [ ] `selectFixedShare(range)`, `selectVariableShare(range)` selectors.
- [ ] Unit tests with category mix fixtures.

## Acceptance Criteria

- [ ] Shares computed as `fixedExpense / totalExpense` and `variableExpense / totalExpense`.
- [ ] Handles zero-expense months safely (return 0 and edge hint).
- [ ] Tests verify category-flag filtering correctness.

## Priority

High

## Process

0%

## Estimated Time

4 hours

## Dependencies

- Task 2 (ranges) and Epic 1 categories model

## Libraries to Install

None

## Implementation Details

### 1) Data & Flags

- Ensure categories have `isFixed`; default mapping for common fixed items.

### 2) Selectors

- Query expenses in range, split by `isFixed`, compute shares using decimal math.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task4-fixed-variable`

### When Complete
1. PR with unit tests

## Implementation Steps

### Phase 1: Flags & Shares
1. Add/verify flag; implement selectors and write tests for mixed data.
