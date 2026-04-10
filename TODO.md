# ProspectIQ — Development TODO

> Last updated: 2026-04-10 (Session 1)

---

## Phase 1 — Foundation (Current)

### Documentation
- [x] Create Developer Documentation (API, Routes, Conventions)
- [x] Create this TODO tracker

### Frontend Setup
- [x] Install dependencies (shadcn/ui, lucide, framer-motion, zustand, zod, recharts)
- [ ] Initialize shadcn/ui components
- [x] Create shared TypeScript types (`src/types/`)
- [x] Create shared constants (`src/lib/constants.ts`)
- [x] Create utility helpers (`src/lib/utils.ts`)

### Layout & Navigation
- [x] Root layout with fonts + metadata
- [x] Dashboard layout with sidebar + header
- [x] Auth layout (centered, no sidebar)
- [x] Admin layout with admin sidebar
- [x] Header component (logo, search shortcut, credit balance, user menu)
- [x] Sidebar component (nav links, active state, collapse)
- [x] Footer component

### Auth Pages (Frontend Only)
- [x] Login page (email/password + OAuth buttons)
- [x] Register page (name, email, password, purpose selector)

### Dashboard Pages (Frontend Only)
- [x] Dashboard — usage stats, credit balance, recent searches, quick search
- [x] Search — unified search bar, filter panel, results grid, progress bar
- [x] Profile/[id] — unified profile card, contact data, social links, sources
- [x] Lists — saved profiles in folders, bulk actions
- [x] Bulk — CSV upload with drag-and-drop, job progress
- [x] API Keys — key table, generate/revoke, usage stats
- [x] Billing — current plan, pricing table, credit top-up, invoices
- [x] Settings — account, team, 2FA, notifications

### Admin Pages (Frontend Only)
- [x] Admin Dashboard — platform stats, revenue chart, DAU
- [x] User Management — user table, search, suspend/adjust
- [x] Job Monitor — BullMQ queue visualization
- [x] Data Sources — source health table, uptime badges

### Public Pages
- [x] Landing page — hero, features, pricing, CTA
- [x] Opt-Out portal — data removal request form

---

## Phase 2 — Backend Foundation (Next Session)

- [ ] Set up Prisma schema + PostgreSQL (Neon)
- [ ] Implement NextAuth.js (Google, GitHub, credentials)
- [ ] Create API route stubs for all endpoints
- [ ] Implement Zustand stores with real data fetching
- [ ] Wire up forms with React Hook Form + Zod validation

## Phase 3 — Core Engine (Future)

- [ ] BullMQ + Redis queue setup
- [ ] Scraping workers (WHOIS, SERP, social, directories)
- [ ] Email pattern generator + SMTP verification
- [ ] Phone carrier lookup (Twilio)
- [ ] Claude AI integration (identity resolution, summaries)

## Phase 4 — Billing & Credits (Future)

- [ ] Stripe + Razorpay integration
- [ ] Credit ledger system
- [ ] Subscription management
- [ ] Invoice generation (GST-compliant)

## Phase 5 — API & Export (Future)

- [ ] Public REST API with API key auth
- [ ] Rate limiting (Redis token bucket)
- [ ] CSV/JSON/PDF export
- [ ] CRM integrations (HubSpot, Salesforce)

## Phase 6 — Chrome Extension (Future)

- [ ] Extension scaffold
- [ ] LinkedIn sidebar detection
- [ ] Context menu search
- [ ] Credit display in popup

## Phase 7 — Admin & Compliance (Future)

- [ ] Opt-out request processing
- [ ] Audit log viewer
- [ ] Feature flag system
- [ ] DPDP/GDPR compliance flows

---

## Notes

- Frontend-first approach: all pages built with mock/static data initially
- Backend will be wired in Phase 2+
- Using Next.js 16 App Router with React 19
- All params/searchParams are Promises (Next.js 16 breaking change)
