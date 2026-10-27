# FarmSetu — Smart Farming & Carbon Programme Support Platform
> **Working MVP Prototype for Student Innovation Competition**  
> *Better Farming Decisions. Sustainable Practices. Connected Opportunities.*

FarmSetu is a full-stack, responsive web application connecting Indian smallholder farmers with structured farm profiles, baseline soil assessments, precision equipment coordination, and high-integrity carbon-farming programmes. Corporate carbon buyers can register their structured procurement requirements, while FarmSetu operations administrators supervise, verify, and coordinate all on-the-ground activities.

---

## 1. Key System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                       FarmSetu Client                          │
│        React 19 + TypeScript + Vite + Tailwind CSS v4          │
│   (Bilingual: English / हिंदी • Mobile-Responsive • Lucide)   │
└───────────────────────────────┬────────────────────────────────┘
                                │ REST API / JWT
┌───────────────────────────────▼────────────────────────────────┐
│                       FarmSetu Backend                         │
│             Node.js v22 + Express REST API Server              │
│       Role-Based Route Guards (Farmer / Company / Admin)       │
└───────────────────────────────┬────────────────────────────────┘
                                │ Relational Storage & Transactions
┌───────────────────────────────▼────────────────────────────────┐
│                   Persistent SQLite Database                   │
│   (server/data/farmsetu.db via Node.js built-in node:sqlite)   │
│   • users                     • farmer_profiles                │
│   • company_profiles          • soil_assessment_requests       │
│   • equipment_requests        • buyer_inquiries                │
│   • carbon_programme_projects • project_stage_history         │
│   • contact_submissions       • foreign keys & constraints     │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Quick Setup & Run Instructions

The platform is designed to run locally with zero native compilation issues on modern Node.js (v20+ / v22+).

### Prerequisites
- Node.js v20+ or v22+ (tested on Node v22.18.0)
- npm v10+

### One-Command Full Stack Execution (Production Mode)
```bash
# 1. Install dependencies
npm --prefix server install
npm --prefix client install

# 2. Build frontend client bundle
npm --prefix client run build

# 3. Start unified server (serves both API and Frontend on port 5000)
npm start
# -> Access application at: http://localhost:5000
```

### Development Mode (Concurrent Vite HMR + Express)
```bash
# Terminal 1: Run Express API Server (Port 5000)
npm run dev:server

# Terminal 2: Run Vite Dev Server with HMR (Port 5173, proxies /api -> 5000)
npm run dev:client
# -> Access dev UI at: http://localhost:5173
```

### Running Automated Acceptance Test Suite
```bash
node test_e2e.js
# Executes 36 end-to-end integration and security assertions across all 6 workflows.
```

---

## 3. Environment Configuration

Create a `.env` file in `server/` or configure process environment variables:

| Variable | Default Value | Description |
|---|---|---|
| `PORT` | `5000` | HTTP port on which the Express application listens |
| `JWT_SECRET` | `farmsetu-super-secret-key-2026-innovation` | Secret key used for signing session tokens (override in production) |
| `NODE_ENV` | `production` | Set to `production` or `development` |

*Security Notice: Never commit private production JWT secrets or administrative database passwords to version control.*

---

## 4. Evaluator & Demo Access (Credentials)

For rapid judging without manual typing, the **Login page (`/login`)** features a **"Judge & Evaluator Fast Demo Logins"** box with one-click access for all three stakeholder roles:

| Role | Pre-Seeded Account | Password | Description / Context |
|---|---|---|---|
| **Central Operations Admin** | `admin@farmsetu.in` | `Admin@FarmSetu2026!` | Full administrative supervision, approval, equipment dispatch, and carbon milestone management |
| **Demo Farmer 1** | `rameshwar.farmer@demo.farmsetu.in` | `Farmer@123` | **Rameshwar Patel** (Ramgarh, Jharkhand - 4.5 acres paddy/wheat, DSR practice adoption) |
| **Demo Farmer 2** | `sunita.devi@demo.farmsetu.in` | `Farmer@123` | **Sunita Devi** (Hazaribagh, Jharkhand - 2.8 acres organic millet/pulses) |
| **Demo Buyer 1** | `procurement@ecoroots.example.com` | `Company@123` | **EcoRoots AgriVentures** (Seeking 5,000 tCO2e smallholder soil carbon credits) |
| **Demo Buyer 2** | `esg@greenhorizon.example.com` | `Company@123` | **GreenHorizon Climate Impact Fund** (Residue management & biochar credits) |

*Live Submissions vs Demo Records:* The platform distinguishes sample data with an amber **"Sample Demo Record"** pill, whereas genuine user registrations receive an emerald **"Live Verified Submission"** badge.

---

## 5. End-to-End Workflow Demonstration Guide

### Workflow 1: Farmer Onboarding & Admin Sync
1. Open `http://localhost:5000` and click **"Get Started as a Farmer"** (`/register/farmer`).
2. Register a new farmer (e.g., name, Indian state/district from dropdown, village, land area in acres/hectares/bigha, current crop).
3. Land on **Farmer Dashboard** (`/farmer`). View profile completion meter and farm summary.
4. Log in as **Central Operations Admin** (`/login` -> Demo Admin).
5. Open **Farmers Directory** (`/admin/farmers`). The newly registered farmer appears immediately with a **"Live Verified Submission"** badge.
6. Click **"Inspect"** -> change status to `"Verified Profile"`. Log back into farmer account to verify instant status synchronization.

### Workflow 2 & 3: Soil Assessment & Agronomy Review
1. In Farmer Portal, navigate to **Crop Analytics** (`/farmer/crop-analytics`).
2. Click **"Request Soil Health Review"**, select soil texture (e.g. Sandy Loam), enter notes, and submit.
3. System generates a unique tracking ID (`SAR-2026-XXXX`).
4. In Admin Portal -> **Soil Assessments** (`/admin/assessments`), open the request.
5. Update status to `"Reviewed"`, assign expert agronomist (e.g. `Dr. R. K. Singh - ICAR-CRURRS`), and write certified agronomic recommendations.
6. The farmer's Crop Analytics view immediately displays the assigned agronomist and verified recommendations with zero ambiguity.

### Workflow 4: Machinery & Equipment Support
1. In Farmer Portal, navigate to **Equipment Support** (`/farmer/equipment`).
2. Click **"Request Equipment Support"**, choose machinery (e.g. `Happy Seeder / Zero-till Seed Drill`), target dates, and submit.
3. Requisition logs as `EQR-2026-XXXX` with status `"Requested"`.
4. In Admin Portal -> **Equipment Requests** (`/admin/equipment`), change status to `"Partner Search"`, add note: `"Coordinating with Custom Hiring Center (CHC) machinery bank"`.
5. Farmer instantly sees the updated badge and the shared CHC dispatch update.

### Workflow 5: Corporate Buyer Requirement Matching
1. Navigate to **Company Registration** (`/register/company`) or log in as Demo Buyer (`procurement@ecoroots.example.com`).
2. In Buyer Portal, click **"Submit Buyer Requirement"** (`/company/submit`).
3. Enter credit type (`Soil Organic Carbon`), target volume (`5,000 tCO2e`), and preferred region (`Eastern India`).
4. System logs unique inquiry ID (`INQ-2026-XXXX`).
5. In Admin Portal -> **Buyer Inquiries** (`/admin/inquiries`), map a tentative smallholder cluster: `"Cluster JH-01 (Ramgarh Smallholders - 45 Farmers)"` and advance status to `"Potential Match Under Review"`.
6. Buyer portal updates with the tentative cluster match and operations desk feedback.

### Workflow 6: Carbon Programme 9-Stage Auditable Tracking
1. In Admin Portal -> **Carbon Programmes** (`/admin/programmes`), open an active project.
2. Advance through the 9 stages:
   `Registration` &rarr; `Farm Info Submitted` &rarr; `Preliminary Assessment` &rarr; `Eligibility Review` &rarr; `Partner Coordination` &rarr; `Practice Adoption & Training` &rarr; `Monitoring` &rarr; `Verification Pending` &rarr; `Credits Issued`.
3. When advancing to `"Credits Issued"`, enter confirmed verified credit volume (e.g., `6.3 tCO2e`).
4. Farmer navigates to **Carbon Programmes** (`/farmer/carbon-programme`) and observes the active stepper progress and confirmed credit issuance.

---

## 6. Complete Functional vs Illustrative Feature Matrix

| Module / Feature | Implementation Status | Technical Reality |
|---|---|---|
| **Farmer Registration & Profiles** | **Fully Functional** | Actual relational database persistence, Indian location selectors, multi-unit calculations |
| **Corporate Buyer Inquiries** | **Fully Functional** | Persisted with unique tracking IDs, volume criteria, and tentative cluster mapping |
| **Admin Operations Control Desk** | **Fully Functional** | Full CRUD, searchable tables, status mutations, telemetry counters |
| **Bilingual Localization (EN / हिंदी)** | **Fully Functional** | Full interface dictionary switching without logging out, stored in `localStorage` |
| **Safe Demo Data Reset** | **Fully Functional** | Re-seeds sample demo records without deleting live user submissions |
| **Role-Based Authorization & Security** | **Fully Functional** | JWT tokens, bcryptjs hashing, server-side 403 route guards |
| **Soil Assessment Requests** | **Fully Functional** | Real submission queue, expert assignment, and custom recommendations |
| **Equipment Requisition Workflow** | **Fully Functional** | Live status pipeline: `Requested` &rarr; `Reviewing` &rarr; `Partner Search` &rarr; `Arranged` / `Unavailable` |
| **Agro-Climatic Guidance Reference** | **Clearly Illustrative** | Labeled *"Illustrative Example — Not a Validated Recommendation"*; avoids false automated AI claims |
| **Carbon Methodology Principles** | **Transparent & Honest** | Strictly avoids fake credit sales or speculative prices; enforces multi-season permanence & third-party MRV |
| **Direct Carbon Credit Trading** | *Planned Future Feature* | Integrations with Verra / Gold Standard registries and automated payment settlement |
| **Live Telematics Machinery Fleet** | *Planned Future Feature* | IoT tractor GPS tracking and live telematics booking |

---

## 7. Technology Stack Summary

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React icons, React Router v7.
- **Backend:** Node.js v22 Express server, CORS, jsonwebtoken, bcryptjs.
- **Database:** SQLite via Node.js built-in `node:sqlite` (zero C++ compile errors on Windows, ACID compliant, file persistent at `server/data/farmsetu.db`).
- **QA Testing:** Node.js automated end-to-end acceptance suite (`test_e2e.js`) with 36 validation checks.
