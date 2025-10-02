# Task 8: Month-over-Month Comparison (M/M)

## Overview

Implement M/M comparison of key metrics with a compact table showing absolute and percentage deltas.

## Tasks

- [ ] Selector: `selectMoM(range)` returning current vs previous month metrics.
- [ ] UI table: metric, current, previous, Δ, Δ%.
- [ ] Edge handling for missing previous data.

## Acceptance Criteria

- [ ] Correct Δ and Δ% calculations for income, expense, savings %.
- [ ] Handles months with no previous data (shows N/A gracefully).
- [ ] Table accessible and scrollable on small screens.

## Priority

High

## Process

0%

## Estimated Time

4 hours

## Dependencies

- Task 2 & 3 & 7 (KPIs)

## Libraries to Install

None

## Implementation Details

### 1) Selector

- Compute previous month window; get KPIs; compute deltas with decimal math.

### 2) UI

- Simple table with icons/colors for direction; export-ready structure.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task8-mom-compare`

### When Complete
1. PR with unit test results

## Implementation Steps

### Phase 1: Selector & UI
1. Implement `selectMoM`; build table; add tests for 3 scenarios.
