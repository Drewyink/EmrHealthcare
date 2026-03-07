# MedCore EMR System

A full Epic-style Electronic Medical Records system built with React + Vite.

## Features

### Modules
- **Dashboard** — Patient census overview, alerts, quick stats
- **Scheduling** — Epic-style 5-step appointment booking wizard, 24 providers, 22 departments
- **Ambulatory** — Outpatient visit tracking, 3-step check-in workflow with vitals, room board
- **Inpatient** — Census table, bed board (Med/Surg / ICU / PCU / Obs), admit patient
- **Pharmacy** — Medication orders, MAR (Medication Administration Record), verification queue
- **Laboratory** — Full lab catalog, results with H/L flags, critical values, pending orders
- **Radiology** — Worklist, results/reports, imaging orders (XR/CT/MRI/US/NM/IR)
- **Clinical Notes** — SOAP/H&P/Discharge Summary composer with templates, sign & lock
- **Discharge Planning** — 4-step wizard: disposition, instructions, med reconciliation, finalize
- **Billing** — Dynamic charges from all clinical modules, CPT codes, A/R aging, claims

### Demo Credentials
| Role | Username | Password |
|------|----------|----------|
| Physician | physician | password |
| Nurse | nurse | password |
| Pharmacist | pharmacist | password |
| Billing | billing | password |

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repo at vercel.com
3. Deploy — zero config needed

### Netlify
1. Run `npm run build`
2. Drag the `dist/` folder to netlify.com/drop

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Update vite.config.js: set base: '/your-repo-name/'
npm run build
npx gh-pages -d dist
```

## Tech Stack
- React 18
- Vite 5
- IBM Plex Sans / IBM Plex Mono (Google Fonts)
- Pure CSS-in-JS (no external UI library)

## Architecture
All state is managed in the root `App` component:
- `globalAppts` — shared between Scheduling and Ambulatory
- `patientFlow` — shared between Pharmacy, Lab, Radiology, Notes, Discharge, and Billing

Every clinical action (lab order, pharmacy order, imaging, discharge) writes to `patientFlow[patientId]` and Billing reads charges from it automatically.
