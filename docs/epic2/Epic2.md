# PocketWallet – Epic 2 Task List (Metrics & Comparative Analysis)

_Generated: 2025-09-17_

Process: 0%

> Scope based on PRD/Feature List. Focus on: savings rate and core spend metrics, monthly/period comparisons (M/M, Y/Y), trend visualizations, and a simple forecast. Stays offline-first with local DB; export supported.

---

## ✅ Goals (Epic 2)

- Provide clear monthly and YTD metrics (savings rate, fixed vs variable share).
- Enable M/M and Y/Y comparisons with highlights for budget overruns.
- Offer trend visualizations (daily heatmap, monthly bar/line) that load fast.
- Allow custom comparisons between periods/categories and CSV export.

---

## 📦 Deliverables

- Reports/Analytics screens in mobile app (React Native) with performant selectors.
- Memoized queries over local DB (WatermelonDB) for month, YTD, and comparison.
- Charts: daily heatmap, monthly bar/line, category share donut for comparison.
- CSV export for comparison results (period vs period, category vs category).

---

## 🧭 Milestones (suggested)

1. Data & Selectors foundation
2. Core metrics (Savings rate, Fixed/Variable)
3. Trends (daily heatmap, monthly bar/line)
4. Comparisons (M/M, Y/Y, custom)
5. Simple forecast + export
6. Testing & polish

---

## 📱 Mobile (React Native) — Reports/Analytics

### 0) Foundation

- [ ] Add navigation entry: Reports/Analytics screen(s).
- [ ] State/selectors scaffolding for time windows (month, YTD, custom range).
- [ ] Reusable chart components (axes, tooltips, loading/empty states).

### 1) Core Metrics

- [ ] Savings rate = (Income − Expense) / Income for month & YTD.
- [ ] Fixed spend share (%) = Fixed expenses / Total expenses.
- [ ] Variable spend share (%) = Variable expenses / Total expenses.
- [ ] Category flags: mark fixed categories; ensure selectors use flags.
- [ ] Performance: memoize and index for month queries.

### 2) Trends & Visualizations

- [ ] Daily spend heatmap for current month (and scrollable months).
- [ ] Monthly bar/line chart for last 6–12 months.
- [ ] KPI trend mini-cards: Income, Expense, Savings %.
- [ ] Empty-state guidance: show tips when insufficient data.

### 3) Comparisons

- [ ] Month-over-Month (M/M): current vs previous month deltas (% and absolute).
- [ ] Year-over-Year (Y/Y): same month last year.
- [ ] Highlight: months exceeding budget (if budget exists) or moving average.
- [ ] Custom compare: select two periods or two categories to compare.
- [ ] Export: CSV for comparison table with chosen fields.

### 4) Simple Forecast (Optional/Basic)

- [ ] Next-month estimate: average of last 3–6 months plus known recurring.
- [ ] Display min–max band; label clearly as estimate.

### 5) UX/Perf & Polish

- [ ] Sub-2s load for month views with memoized selectors.
- [ ] Accessible chart colors; readable on small screens.
- [ ] Persist last-selected period; sensible defaults.

### 6) Testing

- [ ] Unit: savings math, fixed/variable shares, selectors for ranges.
- [ ] Component: charts render with fixtures; empty/loading states.
- [ ] Integration: M/M & Y/Y comparison flows; CSV generation.

---

## 🧪 Testing Strategy — Analytics

**Recommendation:** Emphasize deterministic math on fixtures and selector correctness.

- Shared fixtures (JSON): monthly totals, category flags, expected savings %, fixed shares.
- Unit tests for money math and time-window selectors.
- Snapshot tests for charts with stable fixture data.
- CSV exporter tested with sample comparisons (headers, delimiters, decimals).

---

## 📋 Acceptance Criteria Checklist (traceability)

- [ ] Savings rate visible for month and YTD; matches unit-test fixtures 100%.
- [ ] Daily heatmap and monthly bar/line render in ≤ 2s on 12-month dataset.
- [ ] M/M and Y/Y comparisons show % and absolute deltas correctly.
- [ ] Custom compare supports arbitrary date ranges or categories and exports CSV.
- [ ] Highlight logic marks months over threshold (budget or moving average).

---

## 📎 Out of Scope (this epic)

- Advanced ML forecasting or anomaly detection.
- Bank integrations or automatic transaction imports.
- Complex budget scenarios beyond simple threshold highlighting.

---

## 📚 References

- Feature List: EPIC 2 — Chỉ số & Phân tích so sánh (`docs/FeatureList-Pocketwallet.md`).
- PRD v0.2 — metrics, performance, and offline-first constraints (`docs/PRD-Pocketwallet-v1.0.md`).
