# PocketWallet – Epic 3 Task List (Asset Management & Allocation)

_Generated: 2025-09-17_

> Scope based on PRD/Feature List. Focus on: net worth tracking, asset allocation, and "runway" calculation. Stays offline-first with local DB.

---

## ✅ Goals (Epic 3)

- Track net worth across different accounts (cash, bank, investments).
- Visualize asset allocation (e.g., cash vs. investments).
- Calculate user's financial "runway" based on liquid assets and expenses.
- Provide a framework for advanced concepts like asset pyramid and AI-driven advice.

---

## 📦 Deliverables

- Asset management screens in the mobile app (RN/Expo).
- Logic for calculating Net Worth and Runway.
- Charts: Asset allocation donut/pie chart.
- A new "Assets" tab/section in the app's navigation.

---

## 🧭 Milestones (suggested)

1.  Foundation: Account/Asset data models and services.
2.  Core Feature: Net Worth calculation and display.
3.  Asset Allocation: Visualization and comparison against targets.
4.  Runway Calculator: Implement the "runway" estimation logic.
5.  Advanced (Optional): Stubs for Asset Pyramid and AI advice.
6.  Testing & Polish.

---

## 📱 Mobile (RN/Expo) — Asset Management

### 0) Foundation

- [ ] Add navigation entry for "Assets" screen.
- [ ] Create data models for different account types (cash, bank, savings, investment).
- [ ] Implement services to manage accounts (add, edit, delete, update balance).
- [ ] Ensure internal transfers between accounts do not count as income/expense.

### 1) Net Worth

- [ ] Calculate Net Worth = (Sum of all asset balances) - (Sum of all liabilities/debts).
- [ ] Display Net Worth prominently on the Assets screen.
- [ ] Show a trend line for Net Worth over the last 6-12 months.

### 2) Asset Allocation

- [ ] Group assets into categories (e.g., Cash, Savings, Investments, Other).
- [ ] Display allocation as a donut or pie chart.
- [ ] (Optional V1) Allow users to set target allocation percentages and see the difference.

### 3) "Runway" Calculator

- [ ] Create a dedicated screen or section for the Runway calculation.
- [ ] Implement the formula: `Runway (months) = Liquid Assets / (Monthly Essential Spend * N people)`.
- [ ] Allow user to input number of dependents (N) and adjust "essential spend" factor.
- [ ] Define which asset types are "liquid" (e.g., cash, bank accounts).

### 4) Advanced Concepts (Stubs for V2+)

- [ ] (Optional) Design a UI placeholder for the "Asset Pyramid" concept.
- [ ] (Optional) Design a UI placeholder for "AI Allocation Advice".

### 5) UX/Perf & Polish

- [ ] Ensure calculations are fast, using memoized selectors.
- [ ] Use clear and accessible chart colors.
- [ ] Provide info tooltips to explain terms like "Net Worth" and "Runway".

### 6) Testing

- [ ] Unit: Net Worth calculation, Runway formula, internal transfer logic.
- [ ] Component: Charts render correctly with fixture data.
- [ ] Integration: Flow of adding a new account and seeing it reflected in Net Worth and Allocation.

---

## 🧪 Testing Strategy — Assets

**Recommendation:** Focus on calculation accuracy and handling of different account types.

- Shared fixtures (JSON): list of accounts with different types and balances, expected net worth.
- Unit tests for the core calculation logic.
- Snapshot tests for charts.

---

## 📋 Acceptance Criteria Checklist (traceability)

- [ ] Net Worth is calculated correctly and matches test fixtures.
- [ ] Internal transfers between two accounts do not affect total income/expense reports.
- [ ] Asset allocation chart accurately reflects the proportion of different asset groups.
- [ ] Runway calculator produces a correct estimate based on user inputs.

---

## 📎 Out of Scope (this epic)

- Real-time integration with bank accounts or investment platforms.
- Detailed debt management features.
- Complex investment performance tracking (e.g., ROI, IRR).

---

## 📚 References

- Feature List: EPIC 3 — Quản lý Tài sản & Phân bổ (`docs/FeatureList-Pocketwallet.md`).
- PRD v0.2 — net worth and runway definitions (`docs/PRD-Pocketwallet-v1.0.md`).
---