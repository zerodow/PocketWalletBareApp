# PocketWallet – Epic 1 Task List (Transactions, Categories, Dashboard)

_Generated: 2025-09-08_

Process: 100%

> Scope based on PRD/Feature List/Tech Spec. MVP focuses on: fast transaction logging, categories, and a simple monthly dashboard. Pure offline-first with local database. Sync functionality will be added later.

---

## ✅ Goals (MVP)

- Record a transaction in ≤ 10 seconds (p80).
- Offline-first local CRUD with instant response.
- Monthly dashboard: Income, Expense, Savings %, Top categories.
- Local data storage with future sync capability.

---

## 📦 Deliverables

- Mobile app features (RN/Expo, WatermelonDB, Zustand).
- Local database with categories and transactions.
- CSV export (transactions).
- Settings screen with placeholder for future sync button.

---

## 🧭 Milestones (suggested)

1. Foundation & Local Auth
2. Local CRUD + Categories
3. Dashboard
4. Settings & Future Sync Preparation
5. Export + Testing + Beta polish

---

## 📱 Mobile (RN/Expo) — WatermelonDB + Zustand

### 0) Foundation

- [x] Expo project (TS), ESLint/Prettier, absolute imports. (100%)
- [x] Folder structure (components/screens/store/database/services/utils/types/navigation). (100%)
- [x] Error tracking (Sentry/Bugsnag) + minimal analytics events. (100%)

### 1) Local Database & Models

- [x] WatermelonDB schema & migrations for `categories`, `transactions`. (100%)
- [x] Money utils: decimal library; currency minor unit; round half up. (100%)
- [x] Indexed queries for month view (occurred_at). (100%)

### 2) Local Auth & App Lock

- [x] Local PIN/biometric authentication; secure credential storage. (100%)
- [x] App lock screen; auto-lock on background for privacy. (100%)

### 3) Transactions – UI/UX

- [x] Quick Add screen: keypad, type toggle (Thu/Chi), category chips, one-line note, date picker. (100%)
- [x] Create flow: instant local save, Undo toast 5s. (100%)
- [x] Edit/Delete flow: detail screen; delete → local Trash 30d; restore. (100%)
- [x] Category suggestion: simple rule-based matching on note keywords. (100%)
- [x] Fast, responsive UI with instant feedback. (100%)

### 4) Categories – UI/UX

- [x] Seed ≥10 default categories (VN context). (100%)
- [x] Manage categories: list, add/edit custom, icon/emoji, sortOrder. (100%)

### 5) Dashboard

- [x] Month switcher header. (100%)
- [x] KPIs: Income, Expense, Savings % = (Income − Expense) / Income. (100%)
- [x] Charts: daily bar; category donut. (100%)
- [x] Load ≤ 2s with memoized selectors. (100%)

### 6) Settings & Future Sync Preparation

- [ ] Settings screen with app preferences and configuration.
- [ ] Placeholder "Sync" section for future server synchronization.
- [ ] Local data management and privacy settings.

### 7) Export CSV (mobile)

- [ ] Settings → Export transactions → share sheet.
- [ ] Local CSV generation with proper formatting.

### 8) Mobile Testing

- [ ] Unit: money math, reducers/stores, selectors (totals, savings %).
- [ ] Component: Quick Add, Dashboard widgets, Category chips.
- [ ] Integration: local CRUD operations; Undo behavior; Trash restore.
- [ ] Manual: offline functionality; lock/unlock; export/share.

---

## 🧪 Testing Strategy — Local-First Mobile Testing

**Recommendation:** Focus on comprehensive mobile app testing with local-first functionality.

- Shared fixtures (JSON): amounts, currencies, expected rounded values, category totals, savings %.
- Unit tests for money math to guarantee calculation consistency.
- Keep E2E scenarios focused on local CRUD operations and offline functionality.

---

## 📋 Acceptance Criteria Checklist (traceability)

- [ ] p80 add transaction ≤ 10s (instrumented timer).
- [ ] All money math unit tests pass 100%.
- [ ] Local CRUD works instantly with responsive UI.
- [ ] Dashboard loads ≤ 2s and shows required KPIs/charts.
- [ ] CSV export works with proper local formatting.
- [ ] Crash rate < 1% weekly; all operations sub-second locally.

---

## 📎 Out of Scope (MVP)

- Server synchronization (will be added later as optional feature).
- Transfers between accounts, recurring transactions, budgets, receipt images, tags/subcategories, advanced analytics.
- Cloud backup and multi-device sync (future enhancement).
