# Bridge360 — Refugee & Immigrant Case Management Platform

Bridge360 is a full-stack humanitarian case management platform designed to streamline, automate, and accelerate the refugee resettlement and immigration verification workflow. Built as a scoped enterprise application on the **ServiceNow platform** with a modern **React 18 + TypeScript + Vite** frontend, Bridge360 securely connects case officers and refugee applicants in an empathetic, intelligent ecosystem.

---

## 🌟 The Vision

Refugee intake is traditionally complex, stressful, and fragmented across manual paperwork and legacy forms. Bridge360 transforms this process into a welcoming, guided experience for applicants and an automated, AI-driven workflow for case workers:
*   **For Refugees**: A multilingual, responsive self-service portal with instant OCR document intake, proactive mascot guidance, and real-time status tracking.
*   **For Case Officers**: An integrated workspace with automated triage, Document Intelligence extraction, supervised AI decision drafting, and partner agency referral tracking.

---

## 🛠️ Technology Stack

Bridge360 combines ServiceNow platform capabilities with modern client-side performance:

1.  **Enterprise Core (ServiceNow Platform):**
    *   **Dynamic Data Foundation**: `u_bridge360_country`, `u_bridge360_country_document`, and `u_bridge360_country_document_field` provide a completely data-driven configuration model with zero hardcoded document schemas.
    *   **Case Schema**: Custom tables for families (`u_bridge360_family`), household members (`u_bridge360_member`), documents (`u_bridge360_document`), tickets, and referrals.
    *   **Scripted REST APIs**: Custom endpoints under `/api/global/v1` (`Document Intelligence Extract`, `Register Application`, `AI Verification Context`).
    *   **ServiceNow Document Intelligence**: Native platform OCR processing (`sn_docintel.DocIntel` and `sys_di_task`).
    *   **ServiceNow Agent Studio (`sn_aia`)**: Backend AI agent verification, case summarization, and supervised decision support.

2.  **Frontend Single Page Application (React 18 + TypeScript + Vite):**
    *   **Fast, Accessible UI**: Pure CSS (`index.css`) with responsive CSS grid/flexbox, glassmorphic accents, and accessible color tokens.
    *   **Searchable Comboboxes**: Real-time searchable country and document selectors (`SearchableSelect.tsx`) with instant keyboard navigation, flag emojis, and ISO badges.
    *   **State Management**: React Context API (`Bridge360Context`, `AssistantContext`) managing live notifications, cases, and documents.
    *   **RTL & Multilingual Support**: Dynamic bi-directional layout support for right-to-left languages (Arabic, Farsi).

---

## 📂 Project Architecture

```
bridge360/
├── src/
│   ├── client/                      # Frontend Application (React 18 + TS)
│   │   ├── assets/                  # High-res static images and vectors
│   │   ├── components/              # Modular UI components
│   │   │   ├── common/              # SearchableSelect, Modal, Card, Button, Input
│   │   │   ├── registration/        # 7-Step Registration Wizard (RegistrationEngine)
│   │   │   ├── assistant/           # Vector Mascot SVGs & Proactive Guides
│   │   │   └── verification/        # Officer Verification & Evidence Panels
│   │   ├── services/                # ServiceNow API Clients, OCR Engine, Evidence Foundation
│   │   ├── store/                   # React Contexts (Bridge360Context, AssistantContext)
│   │   └── views/                   # Views (Customer Portal, Admin Workspace, Family 360)
│   │
│   ├── fluent/                      # ServiceNow Fluent SDK Source Files
│   │   ├── rest-apis/               # Bridge360REST.now.ts
│   │   ├── script-includes/         # Bridge360API, Bridge360AIVerification
│   │   └── tables/                  # Schema definitions (Tables & Fields)
│   │
├── HANDOFF.md                       # Complete Project Handoff & Implementation Status
├── PROJECT_DEVELOPMENT.md           # Detailed Architectural Decisions & Changelog
├── bridge360_documentation.md       # Comprehensive System Documentation
├── package.json                     # Dependencies & Scripts
└── vite.config.ts                   # Vite Bundler Configuration
```

---

## 🚀 Key System Workflows

### 1. Document Intake & Generic Extraction Pipeline
The document intake flow is strictly configuration-driven and enforces Layer 1 data integrity:

```
User selects Country & Document Type (SearchableSelect)
          ↓
Dynamic fields queried from u_bridge360_country_document_field (expectedFields)
          ↓
Document image uploaded to POST /api/global/v1/extract-document
          ↓
ServiceNow Document Intelligence creates & executes sys_di_task
          ↓
Native DI OCR candidate tokens parsed from sys_di_image.candidates
          ↓
Bridge360 Generic Matching Layer:
  - Unicode NFD diacritic decomposition (accents stripped generically)
  - Elision apostrophe stripping (e.g. "Date d'expiration" matches "date dexpiration")
  - Strict word-boundary checks (prevents substring collisions like "sex" in "sexe: F")
  - Space vs. underscore role normalization ("head_of_family_name" → "head of family")
  - Constituent name combination (Nom + Prénoms → full_name)
  - Horizontal single-line whitespace regex ([ \t]+)
          ↓
Layer 1 Filter: ONLY configured fields accepted into output
          ↓
Auto-filled into Step 2 form with ISO YYYY-MM-DD date normalization
```

### 2. Multi-Agent AI Verification Suite
In the case worker workspace (`VerificationView`), case officers can trigger the 4-agent verification pipeline:
1.  **Triage Agent**: Analyzes household size, origin country, and demographics to assign priority tiers (Normal, High, Critical).
2.  **Document Analyst Agent**: Authenticates document structure and consistency between declared identity claims and extracted values.
3.  **Risk Assessment Agent**: Scans for systemic flags, duplicate registrations, and anomalies.
4.  **Decision Drafter Agent**: Synthesizes findings into draft recommendations (Approve / Flag for Manual Review) with evidence citations.

---

## ⚙️ Installation & Local Development

### Prerequisites
- Node.js (v18+)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_GEMINI_API_KEY=AIzaSyYourValidGoogleGeminiAPIKey
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

---

## ⚠️ Important Deployment Safety & Live Synchronization

> ⚠️ **CRITICAL DEPLOYMENT GUARDRAIL: DO NOT RUN `sdk:deploy`**
>
> Running a full `npm run sdk:deploy` compiles and deploys whole-package metadata, which can overwrite live REST operations or wipe Studio-configured artifacts on the target instance.
>
> **Targeted Synchronization**:
> * All live changes to the extraction pipeline are synchronized directly to the target REST operation `sys_ws_operation/081e526c946846a5986ca21db2845b8d` (`Document Intelligence Extract`) via targeted scripts.
> * Always retain a verified JSON backup before modifying live operations (`scratch/backups/`).

---

## 🧪 Live Validation Status

Verified live against the active ServiceNow instance across 11 key criteria:

- [x] **Dynamic Country Loading**: Active countries queried live from `u_bridge360_country`.
- [x] **Dynamic Document Loading**: Documents filtered strictly by selected country ID.
- [x] **Dynamic Layer 1 Fields**: Fields loaded dynamically from `u_bridge360_country_document_field`.
- [x] **Document Intelligence Invocation**: Live `sys_di_task` created and executed.
- [x] **DI OCR Consumption**: Native DI OCR candidate tokens parsed by Bridge360.
- [x] **Generic OCR Matching**: Zero substring collisions, accents and elisions resolved.
- [x] **Layer 1 Field Enforcement**: Zero unconfigured fields enter Layer 1 output.
- [x] **Preserved Registration Flow**: `Register Application` REST endpoint active.
- [x] **Preserved AI Suite**: Verification Agent and AI Script Includes intact.

For full validation logs and benchmark reports, see [HANDOFF.md](file:///d:/bridge360/HANDOFF.md) and [PROJECT_DEVELOPMENT.md](file:///d:/bridge360/PROJECT_DEVELOPMENT.md).
