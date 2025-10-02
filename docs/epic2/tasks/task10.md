# Task 10: Custom Comparison Picker + Result View

## Overview

Allow users to pick two arbitrary ranges or categories and view a comparison table.

## Tasks

- [ ] UI: date-range pickers (from/to) for A and B; optional category filter.
- [ ] Selector: `selectCustomCompare(input)` returning metrics for A & B.
- [ ] Result table: A vs B with Δ and Δ%.

## Acceptance Criteria

- [ ] Users can configure A and B ranges; optional category filter applied.
- [ ] Result table computes correctly and updates instantly (<300ms for local data).
- [ ] Validations prevent inverted ranges; clear error messages.

## Priority

High

## Process

0%

## Estimated Time

4 hours

## Dependencies

- Task 2 (ranges), Tasks 3–4 (metrics)

## Libraries to Install

None

## Implementation Details

### 1) UI

- Two range inputs; category selector; apply button.

### 2) Selector

- Compute metrics per input; compute deltas; memoize by input key.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task10-custom-compare`

### When Complete
1. PR with video/gif demo

## Implementation Steps

### Phase 1: Picker & Results
1. Build picker UI; implement selector; wire results table with validations.
