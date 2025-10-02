# Task 12: Simple Forecast (Next Month Estimate)

## Overview

Compute a basic next-month estimate based on average of last 3–6 months plus recurring transactions, and display as a band (min–max).

## Tasks

- [ ] Selector: `selectForecastNextMonth()` with min–max band.
- [ ] UI card showing estimate with disclaimer.
- [ ] Unit tests for rolling-average logic.

## Acceptance Criteria

- [ ] Forecast band computed reproducibly from fixtures.
- [ ] UI labels clearly mark it as estimate; no confusion with actuals.
- [ ] Fast computation (<50ms on local dataset of 12 months).

## Priority

Low (Optional/Basic)

## Process

0%

## Estimated Time

4 hours

## Dependencies

- Task 5 (monthly totals selector)

## Libraries to Install

None

## Implementation Details

### 1) Selector

- Use last N months (configurable, default 3) to compute average, derive ±variance for band.

### 2) UI

- Simple card with min–max and a brief tooltip/help.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task12-forecast`

### When Complete
1. PR with unit test outputs

## Implementation Steps

### Phase 1: Forecast & UI
1. Implement selector and tests; add UI card on Reports home.
