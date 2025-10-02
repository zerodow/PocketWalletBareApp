# Task 1: Reports Navigation & Screen Scaffold

## Overview

Add a Reports/Analytics entry and base screens to host Epic 2 features. Establish routes, placeholders, and a minimal layout to iterate quickly.

## Tasks

- [ ] Add `ReportsHomeScreen` with sections: KPIs, Trends, Comparisons.
- [ ] Add navigation route and tab/drawer entry.
- [ ] Wire placeholder components for upcoming charts and tables.

## Acceptance Criteria

- [ ] Navigating to Reports shows a basic screen with three sections and stub components.
- [ ] No crashes; back navigation works from all subroutes.
- [ ] Uses existing theme/typography and respects safe areas.

## Priority

High

## Process

0%

## Estimated Time

3 hours

## Dependencies

- Epic 1 Task 2 (DB & Models) present in project layout
- App navigation configured (stack/tab root)

## Libraries to Install

None (chart libs added in later tasks)

## Implementation Details

### 1) Screens & Components

- `ReportsHomeScreen`: simple sections with placeholders (`KpiSection`, `TrendsSection`, `CompareSection`).
- Reusable container with scroll, padding, and empty states.

### 2) Navigation

- Add `Reports` route to main navigator; ensure header title and back behavior.

## Development Workflow

### Before Starting
1. Create branch: `feat/e2-task1-reports-nav`

### When Complete
1. Commit and open PR targeting `dev`

## Implementation Steps

### Phase 1: Route & Screen
1. Add route to navigator and create `ReportsHomeScreen` with three placeholders.
2. Verify navigation on both iOS and Android.
