# PocketWallet – Product Requirements Document (PRD) v0.2 (Optimized & Actionable)

_Updated: September 01, 2025_

> This version incorporates the “Review & Comments” feedback (2025‑09‑02): tighter MVP, explicit research plan,
> concrete success criteria, clearer security/privacy, error handling, monitoring thresholds, and a simple bill‑splitting architecture.

---

## 1) Product Overview

**Idea.** A lightweight, offline‑first personal finance app (Android/iOS) to record income/expense, view a simple monthly dashboard, and split shared bills quickly.

**Problem.** Manual tracking is tedious and error‑prone; many apps are complex or not localized for Vietnam (roommate bill‑splitting norms, offline reliability).

**Vision.** Be the fastest way to log a transaction and keep simple control of money. Start in Vietnam; scale features (budgets, OCR, AI) later.

**MVP constraints.**

- Solo personal project, **free** at launch.
- **No** bank/payment integrations (no MoMo/bank linking).
- **Cloud sync: YES (basic)** for backup and simple sharing (see §7 & §9).
- No visual mockups yet (wireframes to be produced in Week 1).

---

## 2) Goals & Objectives

- **G1. Speed:** Record a transaction in **≤10 seconds (p80)**.
- **G2. Clarity:** A **monthly dashboard** with totals and savings rate.
- **G3. Sharing:** **Simple bill splitting** that roommates understand and trust.
- **G4. Reliability:** Works **fully offline**; syncs safely when online.
- **G5. Feasibility:** Operate on free‑tier infra without surprises.

---

## 3) User Research Plan (Week 0–1)

**Recruitment sources.** University groups, co‑working spaces, Facebook/Zalo community groups (HCMC/Hanoi), friends/roommates network.

**Screening.** Age 18–35; shares bills or tracks expenses monthly; Android/iOS user.

**Interview prompts.**

- How do you currently track expenses? (apps, notes, spreadsheets)
- How often do you split bills? Pain points/examples?
- Would you add transactions daily? What makes it fast or annoying?
- What data do you need in a monthly view to feel “in control”?
- What would make you trust an offline‑first finance app?

**Success criteria.**

- ≥70% confirm **bill splitting** is a real pain point.
- ≥60% report willingness to log **daily** if the flow is ≤10s.
- Top 3 dashboard metrics validated (income, expense, savings rate).

**Artifacts.** 10–15 interviews → journey map, top problems, validated personas.

---

## 4) Scope & Release Plan

### MVP (target 4–6 weeks)

1. **Auth & Lock:** Mock authentication with MMKV storage; app lock with PIN/biometrics.
2. **Transactions:** Add/edit/delete income & expense; notes; timestamp; category.
3. **Categories:** 10 predefined + custom (name + emoji/icon).
4. **Dashboard:** Month totals (income, expense), **savings %** (income−expense)/income.
5. **Bill Splitting:** **Flat split calculator** with **shareable link** (no accounts required).
6. **Data Export:** CSV export (transactions).

**Out of scope (MVP).** Warranty tracking, budgets/alerts, recurring, shared debts, OCR, AI/ML, bank integrations.

### V1 (8–10 weeks, post‑MVP)

- Warranty tracking + reminders.
- Budgets with monthly caps and alerts.
- Recurring transactions.
- Shared debt tracking (IOUs).

### V2+ (future)

- OCR receipts, AI categorization, forecasting.
- Advanced splitting (weighted, per‑meter readings).
- Asset allocation & net‑worth.

---

## 5) UX & Core Flows (Wireframes in Week 1)

**Design principles.** Minimal, one‑hand use, offline‑instant, undo‑friendly.

**Flows to wireframe & test.**

1. **Quick Add Transaction (≤10s):**
   - Open → amount keypad → category → (optional) note → Save → toast undo (5s).
2. **Monthly Dashboard:** header month switcher → cards (Income, Expense, Savings %) → top categories list.
3. **Bill Split Calculator:**
   - Enter total + #people → per‑person amount → **Generate share link** → Copy/Share.
4. **CSV Export:** Settings → Export → generate file → share sheet.

**Offline/online UX.** Local ops always work; a subtle “Syncing…” status when connectivity returns; conflicts resolved per §9.

---

## 6) Data Model (MVP)

**User:** id, displayName, locale, createdAt.
**Transaction:** id, userId, type (income|expense), amount (DECIMAL), currency, categoryId, note, occurredAt, createdAt, updatedAt, syncVersion.
**Category:** id, userId, name, icon, isDefault (bool), sortOrder.
**BillSplit (cloud‑only entity for links):** id, ownerUserId, total, peopleCount, perPerson, title?, createdAt, expiresAt (7 days).

Notes:

- Monetary fields use **decimal** math; no floating point. Rounding: **round half up** to currency minor unit.
- Local DB: WatermelonDB; **syncVersion** for LWW conflict handling.

---

## 7) Architecture & APIs (MVP)

**Frontend.** React Native (Expo), TypeScript, Zustand state, WatermelonDB offline store.
**Backend.** Node.js + Express; MMKV local storage; Render hosting.

**Cloud sync scope (MVP).**

- **Transactions & Categories:** optional cloud backup per user (on by default; user can disable).
- **Bill Splits:** created in cloud to enable **share links** (read‑only for visitors).

**API sketch (finalize as OpenAPI in Week 1).**

```
POST   /v1/auth/login                → Supabase
GET    /v1/me                        → profile
GET    /v1/tx?since=cursor           → pull user transactions (delta)
POST   /v1/tx                        → create
PATCH  /v1/tx/:id                    → update
DELETE /v1/tx/:id                    → delete

GET    /v1/categories               → list
POST   /v1/categories               → create/update

POST   /v1/splits                   → create split (total, peopleCount, title?)
GET    /v1/splits/:id               → public read (no auth), returns perPerson
```

**Sharing model (bill split).**

- **Option A (chosen):** shareable link (e.g., `app.link/s/XYZ123`) with server‑stored split.
- No multi‑user accounts for MVP; roommates just open the link to view their share.

---

## 8) Security Requirements

**Data at rest.**

- Local device: Expo SecureStore (encrypted); WatermelonDB stored in encrypted container.
- Cloud DB: Postgres with AES‑256 transparent encryption (provider‑managed).

**Data in transit.** TLS 1.3 for all API traffic; HSTS on backend.

**Auth.** Mock authentication (email/pass validation); MMKV storage; app‑level PIN/biometric lock.

**Secrets.** No secrets in client; use env on server; rotate on suspicion; least privilege DB roles.

**Threat model (top 5).**

1. Device theft → biometric/PIN lock, local encryption.
2. Token theft → short‑lived access tokens, refresh rotation, revoke on anomaly.
3. API abuse → rate limiting (IP + user), request size caps.
4. Sync conflicts leading to loss → LWW and “last change wins” with local undo.
5. Link leakage (bill splits) → unguessable IDs, auto‑expire in **7 days**, allow manual deletion.

**Audit & response.**

- Pre‑launch **security review checklist**.
- Log auth and write ops (PII minimized).
- Incident playbook: detect → assess → revoke tokens → notify users (in‑app) within 72h → post‑mortem.

---

## 9) Sync & Conflict Strategy

- **Offline‑first**: all CRUD works offline; outbound ops queued.
- **Sync order**: categories → transactions.
- **Conflict policy (MVP)**: **Last‑Write‑Wins** by `updatedAt`; client stores pre‑change snapshot to support **Undo**.
- **Visibility**: “Sync pending” indicator; “X items synced” toast on completion.

---

## 10) Error Handling & Data Recovery

**Common failures & UX.**

- **Network down** → continue offline, queue ops; banner “Working offline.”
- **Sync failure** → retry with backoff; show “Tap to retry.”
- **Transaction save crash** → local draft autosave; restore prompt on reopen.
- **Accidental delete** → 30‑day “Trash” locally; restore action.
- **Data corruption** → verify checksums on export/import; local periodic snapshot (weekly).

**Backups.**

- Local rolling snapshot (weekly, 2 copies).
- CSV export anytime; import validates schema & duplicates.

---

## 11) Privacy & Compliance (VN‑first)

- Follow Vietnam Personal Data Protection Decree **(Decree 13/2023)** principles.
- **Privacy policy** shown at signup (plain language).
- **DSR features (MVP+):** data export (CSV already), account deletion (request → purge within 30 days).
- **Data retention:** local snapshots (2 copies) and server logs (30 days) — documented for users.
- **Third‑party sharing:** none (no ads SDKs in MVP).

_(Note: consult legal guidance before public release; expand to GDPR later if targeting EU users.)_

---

## 12) Monitoring, Telemetry & Quality Gates

**Crash & perf.** Sentry or Bugsnag SDK; capture crash rate, app start time, slow renders.
**Product analytics.** Minimal, privacy‑preserving events: `tx_add`, `dash_view`, `split_create`, `export_csv`.
**Backend.** Request latency, error rate, rate‑limit hits.

**Thresholds & alerts.**

- **Crash rate** < **1%** of sessions (weekly). Alert at 0.7%.
- **API p95 latency** < **2s**; alert at 1.7s.
- **Sync success** > **95%**; alert at 92%.
- **MMKV storage**: warn at **80%**, block new writes at **95%** with friendly UI.

**Release gates (MVP).**

- p80 add‑transaction time ≤ **10s** (measured via client timer).
- Unit tests for money math & rounding pass 100%.
- No P0/P1 bugs open for 72h.

---

## 13) Testing Strategy

**Unit tests.** Decimal math (no float), rounding rules, category totals, savings %.
**Integration tests.** Offline queueing + sync; conflict resolution; CSV export/import.
**Manual scenarios.** Airplane mode flows; device lock/unlock; share link open on another device.
**Tooling.** Jest; React Native Testing Library; backend supertest.
**Data accuracy.** Use decimal library (e.g., `decimal.js`); consistent currency minor units.

---

## 14) Success Metrics & Targets (6 weeks post‑launch)

- **Engagement:** ≥ **50%** of new users log a transaction within **48h** of signup.
- **Speed:** ≥ **80%** of transactions added in **<10s**.
- **Retention:** ≥ **30% D7**, ≥ **20% D30**.
- **Bill splitting:** ≥ **5** splits/week across all users.
- **Reliability:** Sync success > **95%**; crash rate < **1%**.

---

## 15) Project Plan

**Week 0 (pre‑dev):** Interviews (5–8), pick analytics/crash tools, OpenAPI draft, security checklist v1, pick decimal library.
**Week 1:** Wireframes (4 flows), Auth + Lock, Tx model, local CRUD; begin API.
**Week 2:** Dashboard, Categories, CSV export; start cloud sync.
**Week 3:** Bill split + share links; finish sync; error handling.
**Week 4:** Monitoring/alerts; polish; accuracy test suite; beta build.
**Week 5–6:** Fixes from beta; performance pass; publish MVP.

---

## 16) Risks & Mitigations

- **Free‑tier limits:** Monitor thresholds; disable non‑critical writes; guide user to export if necessary.
- **Security incidents:** Token revoke, user notify in 72h, rotate keys, post‑mortem.
- **Sync edge cases:** Preserve local undo; never delete without Trash.
- **Feature creep:** Changes require explicit trade‑off via a one‑page RFC.

---

## 17) Stakeholders & Approvals

- **Owner/PM/Dev/Design:** You (solo).
- **Approvals:** Scope/timeline decisions recorded in repo README/CHANGELOG.

---

## 18) Open Questions

- Currency support: start VND only or multi‑currency?
- Do we gate cloud backup behind a toggle in Settings for privacy‑sensitive users?
- Should links show bill itemization (labels per person) in V1?
