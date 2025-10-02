# Task 11: CSV Export for Comparison Results

## Overview

Export comparison tables (M/M, Y/Y, Custom) to CSV with proper headers and decimal-safe formatting.

## Tasks

- [ ] CSV builder: headers, rows for A, B, Δ, Δ%.
- [ ] Share sheet integration (reuse Epic 1 export patterns).
- [ ] Unit tests for CSV formatting and delimiter correctness.

## Acceptance Criteria

- [ ] CSV opens in Excel/Sheets with correct columns and formats.
- [ ] Decimal rounding matches UI; percent rendered as `0.00%`.
- [ ] Works offline and respects file permissions.

## Priority

Medium

## Process

0%

## Estimated Time

3 hours

## Dependencies

- Task 8/9/10 (tables exist)
- Epic 1 export util (if present)

## Libraries to Install

None (reuse existing file/share libs)

## Implementation Details

### 1) Service

- `buildComparisonCsv(result, options)` returns string/Blob.

### 2) UI Hook

- Button in comparison views to export current result.

## Development Workflow

### Before Starting
1. Branch: `feat/e2-task11-compare-csv`

### When Complete
1. PR with attached sample CSV

## Implementation Steps

### Phase 1: CSV & Share
1. Implement builder; integrate share sheet; add tests with fixture results.
