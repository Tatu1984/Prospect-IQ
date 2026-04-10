# ProspectIQ — Developer Documentation

> Universal Contact Intelligence & People Discovery Platform

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Route Map](#route-map)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Credit System](#credit-system)
8. [Authentication](#authentication)
9. [Naming Conventions](#naming-conventions)
10. [Environment Variables](#environment-variables)

---

## Architecture Overview

ProspectIQ is a multi-tier SaaS platform:

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT TIER                         │
│  Next.js 16 App Router (RSC) + Tailwind + shadcn/ui    │
│  Zustand (state) · React Hook Form + Zod (forms)       │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / WebSocket
┌────────────────────────▼────────────────────────────────┐
│                      API TIER                           │
│  Next.js API Routes (internal)                          │
│  /api/public/v1/* (external REST — API key auth)        │
│  NextAuth.js (OAuth + JWT)                              │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   SERVICE TIER                          │
│  search.service · enrich.service · credit.service       │
│  billing.service · ai.service · export.service          │
│  BullMQ job queue (Redis-backed)                        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                    DATA TIER                            │
│  PostgreSQL 16 (Neon) + Prisma ORM                      │
│  Redis 7 (Upstash) — cache, rate limits, queues         │
│  pgvector — embedding similarity search                 │
└─────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│               SCRAPING / ML TIER                        │
│  BullMQ workers: LinkedIn, WHOIS, SERP, Social, PDF     │
│  Python FastAPI: email predictor, NER, confidence scorer │
│  Claude AI: identity resolution, summaries              │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer       | Technology                    | Version |
| ----------- | ----------------------------- | ------- |
| Framework   | Next.js (App Router)          | 16.x    |
| Language    | TypeScript                    | 5.x     |
| UI          | Tailwind CSS + shadcn/ui      | 4.x     |
| Animations  | Framer Motion                 | 11.x    |
| State       | Zustand                       | 4.x     |
| Forms       | React Hook Form + Zod         | Latest  |
| Charts      | Recharts                      | 2.x     |
| Icons       | Lucide React                  | Latest  |
| ORM         | Prisma                        | 5.x     |
| Auth        | NextAuth.js                   | 5.x     |
| Queue       | BullMQ (Redis)                | 5.x     |
| AI/LLM      | Claude Sonnet (Anthropic API) | Latest  |
| Payments    | Stripe + Razorpay             | Latest  |
| Database    | PostgreSQL 16 (Neon)          | 16.x    |
| Cache       | Redis 7 (Upstash)             | 7.x     |

---

## Project Structure

```
prospectiq/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                    # Auth route group (no sidebar)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/               # Authenticated route group (sidebar)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── profile/[id]/page.tsx
│   │   │   ├── lists/page.tsx
│   │   │   ├── bulk/page.tsx
│   │   │   ├── api-keys/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (admin)/                   # Admin route group
│   │   │   ├── admin/dashboard/page.tsx
│   │   │   ├── admin/users/page.tsx
│   │   │   ├── admin/jobs/page.tsx
│   │   │   ├── admin/sources/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                       # API routes
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── search/route.ts
│   │   │   ├── enrich/route.ts
│   │   │   ├── verify/email/route.ts
│   │   │   ├── verify/phone/route.ts
│   │   │   ├── profiles/[id]/route.ts
│   │   │   ├── bulk/route.ts
│   │   │   ├── lists/route.ts
│   │   │   ├── billing/route.ts
│   │   │   ├── webhooks/stripe/route.ts
│   │   │   ├── webhooks/razorpay/route.ts
│   │   │   └── public/v1/             # External REST API
│   │   │       ├── search/route.ts
│   │   │       ├── enrich/route.ts
│   │   │       └── verify/route.ts
│   │   ├── opt-out/page.tsx           # Public opt-out portal
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css
│   │
│   ├── components/                    # UI components
│   │   ├── ui/                        # shadcn/ui primitives
│   │   ├── features/                  # Feature-specific components
│   │   │   ├── search/
│   │   │   ├── profile/
│   │   │   ├── billing/
│   │   │   ├── bulk/
│   │   │   └── dashboard/
│   │   └── layout/                    # Shell components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   │
│   ├── lib/                           # Shared utilities
│   │   ├── utils.ts                   # cn() helper, formatters
│   │   └── constants.ts              # Routes, credit costs
│   │
│   ├── types/                         # Shared TypeScript types
│   │   ├── person.ts
│   │   ├── search.ts
│   │   ├── credit.ts
│   │   ├── user.ts
│   │   └── common.ts
│   │
│   └── stores/                        # Zustand stores
│       ├── auth-store.ts
│       ├── search-store.ts
│       └── credit-store.ts
│
├── docs/                              # Documentation
│   └── DEVELOPER.md
├── TODO.md                            # Session progress tracker
├── public/
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Route Map

### Public Routes

| Path         | Page              | Description                          |
| ------------ | ----------------- | ------------------------------------ |
| `/`          | Landing           | Marketing page with pricing + CTA    |
| `/login`     | Login             | Email/password + OAuth login         |
| `/register`  | Register          | User registration with purpose       |
| `/opt-out`   | Opt-Out Portal    | Public data removal request form     |

### Authenticated Routes (Dashboard)

| Path                | Page          | Description                              |
| ------------------- | ------------- | ---------------------------------------- |
| `/dashboard`        | Dashboard     | Usage stats, credits, recent searches    |
| `/search`           | Search        | Unified search + filters + results       |
| `/profile/[id]`     | Profile       | Person profile detail view               |
| `/lists`            | Saved Lists   | Bookmarked profiles organized in folders |
| `/bulk`             | Bulk Upload   | CSV upload for batch enrichment          |
| `/api-keys`         | API Keys      | Generate/manage external API keys        |
| `/billing`          | Billing       | Plans, credit top-up, invoices           |
| `/settings`         | Settings      | Account, team, 2FA, notifications        |

### Admin Routes

| Path               | Page            | Description                         |
| ------------------ | --------------- | ----------------------------------- |
| `/admin/dashboard` | Admin Dashboard | Platform stats, revenue, DAU        |
| `/admin/users`     | User Mgmt       | View/suspend/adjust users           |
| `/admin/jobs`      | Job Monitor     | BullMQ scraping queue status        |
| `/admin/sources`   | Data Sources    | Source health and uptime monitoring  |

---

## API Reference

### Internal API (Session JWT Auth)

| Method | Endpoint                      | Description                     |
| ------ | ----------------------------- | ------------------------------- |
| POST   | `/api/search`                 | Execute search query            |
| POST   | `/api/enrich`                 | Enrich a known identity         |
| POST   | `/api/verify/email`           | Verify email address(es)        |
| POST   | `/api/verify/phone`           | Verify phone number(s)          |
| GET    | `/api/profiles/[id]`          | Get cached person profile       |
| POST   | `/api/bulk`                   | Submit bulk CSV job             |
| GET    | `/api/lists`                  | Get user's saved lists          |
| POST   | `/api/lists`                  | Create/update saved list        |
| GET    | `/api/billing`                | Get subscription + invoices     |
| POST   | `/api/billing`                | Create checkout session         |
| POST   | `/api/webhooks/stripe`        | Stripe webhook handler          |
| POST   | `/api/webhooks/razorpay`      | Razorpay webhook handler        |

### Public REST API (Bearer API Key Auth)

All prefixed with `/api/public/v1/`

| Method | Endpoint           | Description                              | Credits |
| ------ | ------------------ | ---------------------------------------- | ------- |
| GET    | `/search`          | Universal search (name/email/phone/user) | 2       |
| POST   | `/enrich`          | Full profile enrichment                  | 5       |
| POST   | `/verify/email`    | Verify email deliverability              | 1 each  |
| POST   | `/verify/phone`    | Verify phone + carrier lookup            | 1 each  |
| POST   | `/bulk`            | Submit CSV for async bulk enrichment     | 1/row   |
| GET    | `/bulk/:jobId`     | Poll bulk job status + download          | 0       |
| GET    | `/profile/:id`     | Get cached profile by ID                 | 1       |
| GET    | `/credits`         | Check API key credit balance             | 0       |
| POST   | `/opt-out`         | Submit data removal request              | 0       |

### Request/Response Conventions

- All requests/responses use `Content-Type: application/json`
- Errors follow standard shape: `{ error: string, code: string, details?: any }`
- Pagination: `?page=1&limit=20` → response includes `{ data: [], meta: { page, limit, total, totalPages } }`
- Dates: ISO 8601 format (`2026-04-10T12:00:00Z`)
- IDs: CUID2 strings

---

## Database Schema

### Core Models

| Model            | Key Fields                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| `Person`         | id, fullName, aliases[], photoUrl, location, bio, aiSummary, qualityScore  |
| `PersonEmail`    | id, personId, email, isVerified, confidence, source, lastCheckedAt         |
| `PersonPhone`    | id, personId, phone, carrier, lineType, isWhatsApp, confidence, source     |
| `SocialProfile`  | id, personId, platform, username, profileUrl, followerCount, isVerified    |
| `ProfessionalData` | id, personId, jobTitle, company, industry, seniority, startDate         |
| `EducationData`  | id, personId, institution, degree, fieldOfStudy, graduationYear            |
| `DataSource`     | id, personId, sourceUrl, sourceType, extractedAt, raw                      |

### Auth & Billing Models

| Model              | Key Fields                                                              |
| ------------------ | ----------------------------------------------------------------------- |
| `User`             | id, email, name, role, purpose, teamId, creditsBalance, twoFactorEnabled |
| `Team`             | id, name, ownerId, plan, creditsPool                                    |
| `Subscription`     | id, userId, plan, status, currentPeriodEnd, stripeSubId                 |
| `CreditTransaction`| id, userId, delta, balance, type, searchId, createdAt                   |
| `Invoice`          | id, userId, amount, currency, gstAmount, status, pdfUrl                 |
| `ApiKey`           | id, userId, key (hashed), name, permissions[], rateLimit                |
| `AuditLog`         | id, userId, action, targetPersonId, creditsUsed, metadata               |
| `SearchRecord`     | id, userId, query, queryType, creditsUsed, resultCount                  |

---

## Credit System

| Action                    | Cost     |
| ------------------------- | -------- |
| Basic Name Search         | 2 credits |
| Full Profile Reveal       | 5 credits |
| Email Verification        | 1 credit  |
| Phone Verification        | 1 credit  |
| Bulk Row (per person)     | 3 credits |
| AI Summary Generation     | 1 credit  |
| Dark Web Check            | 2 credits |
| Digital Footprint Report  | 8 credits |
| Company Intelligence      | 5 credits |
| Chrome Extension Reveal   | 4 credits |

### Plans

| Plan         | Credits/mo | INR/mo   | USD/mo |
| ------------ | ---------- | -------- | ------ |
| Free         | 50         | ₹0       | $0     |
| Starter      | 500        | ₹1,499   | $18    |
| Professional | 2,000      | ₹4,999   | $59    |
| Business     | 10,000     | ₹14,999  | $179   |
| Enterprise   | Custom     | Custom   | Custom |
| Credit Top-Up| 100        | ₹499     | $5.99  |

---

## Authentication

- **Method**: NextAuth.js 5 with JWT strategy
- **Providers**: Email/Password, Google OAuth, LinkedIn OAuth, GitHub OAuth
- **Tokens**: Access token (15 min) + Refresh token (7 days) with rotation
- **API Keys**: For external REST API — hashed with SHA-256, stored in `ApiKey` table
- **2FA**: TOTP via authenticator apps (Google Authenticator, Authy)
- **Roles**: `USER`, `MANAGER`, `ADMIN`, `SUPER_ADMIN`

---

## Naming Conventions

| Element          | Convention            | Example                        |
| ---------------- | --------------------- | ------------------------------ |
| Files (pages)    | `kebab-case`          | `api-keys/page.tsx`            |
| Files (components) | `kebab-case`        | `search-bar.tsx`               |
| Components       | `PascalCase`          | `SearchBar`, `ProfileCard`     |
| Functions        | `camelCase`           | `getSearchResults()`           |
| Types/Interfaces | `PascalCase`          | `PersonProfile`, `SearchQuery` |
| Constants        | `UPPER_SNAKE_CASE`    | `CREDIT_COSTS`, `API_ROUTES`   |
| CSS classes      | Tailwind utilities    | `className="flex items-center"`|
| API routes       | `kebab-case`          | `/api/verify/email`            |
| DB models        | `PascalCase`          | `PersonEmail`, `AuditLog`      |
| DB fields        | `camelCase`           | `fullName`, `isVerified`       |
| Env variables    | `UPPER_SNAKE_CASE`    | `DATABASE_URL`, `JWT_SECRET`   |
| Zustand stores   | `camelCase` + `Store` | `authStore`, `searchStore`     |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...@neon.tech/prospectiq

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<random-32-char>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# AI
ANTHROPIC_API_KEY=

# Redis
REDIS_URL=

# Scraping
BRIGHTDATA_PROXY_URL=
GOOGLE_CSE_API_KEY=
GOOGLE_CSE_CX=
SERP_API_KEY=
HUNTER_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=

# Email
RESEND_API_KEY=

# Storage
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
