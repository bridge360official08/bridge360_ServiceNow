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
├── services/                        # Standalone Microservices
│   └── easyocr-service/             # Standalone Python EasyOCR HTTP Microservice
│       ├── EasyOCR/                 # Official EasyOCR engine clone
│       ├── app.py                   # FastAPI application (/health, /ocr)
│       ├── config.py                # Environment configuration
│       ├── test_service.py          # Automated test suite (7 tests)
│       ├── Dockerfile               # Container definition
│       ├── docker-compose.yml       # Docker compose specification
│       └── README.md                # Standalone service documentation
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

### 1. Document Intake & Two-Tier OCR Architecture
ServiceNow Document Intelligence serves as the **primary document processing engine**. The standalone EasyOCR microservice (`services/easyocr-service/`) operates strictly as a controlled **secondary fallback** when Document Intelligence output is insufficient or unavailable.

```
                    User Uploads Document
                              │
                              ▼
        ┌───────────────────────────────────────────┐
        │  ServiceNow Document Intelligence (DI)   │  ◄── PRIMARY ENGINE
        │        (sn_docintel.DocIntelAPI)          │
        └─────────────────────┬─────────────────────┘
                              │
                              ▼
        ┌───────────────────────────────────────────┐
        │       Generic DI Quality Assessment       │
        │  - Execution status (diOcrUsed)           │
        │  - Token threshold (diTokenCount >= 4)    │
        │  - Substantive text length (>= 20 chars)  │
        │  - Field match resolution                 │
        └─────────────────────┬─────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               │                             │
        [DI Sufficient]               [DI Insufficient]
               │                             │
               ▼                             ▼
       Keep DI OCR Text            ┌───────────────────┐
               │                   │  EasyOCR Service  │  ◄── SECONDARY FALLBACK
               │                   │  POST /ocr        │      (Standalone & Generic)
               │                   └─────────┬─────────┘
               │                             │
               │                   ┌─────────┴─────────┐
               │                   │                   │
               │               [Success]            [Offline / Error]
               │                   │                   │
               │                   ▼                   ▼
               │            EasyOCR Text &       Preserve DI Result
               │            Lines & Words        & Continue Safely
               │                   │                   │
               └──────────────┬────┴───────────────────┘
                              │
                              ▼
        ┌───────────────────────────────────────────┐
        │      Dynamic Document-Field Extraction    │
        │    u_bridge360_country_document_field     │  ◄── SOLE SOURCE OF TRUTH
        │         (Layer 1 Configured Fields)       │
        └─────────────────────┬─────────────────────┘
                              │
                              ▼
        ┌───────────────────────────────────────────┐
        │       Human Review / AI Verification      │
        └───────────────────────────────────────────┘
```

**Key Architectural Guarantees:**
- **DI Remains Primary**: EasyOCR is never called when DI produces sufficient OCR output.
- **Controlled Single Path**: Browser client evaluates DI quality and triggers secondary fallback via local proxy.
- **Document-Agnostic**: EasyOCR receives image data, generic options (`preprocess`, `mag_ratio`), and dynamic country languages where available. No hardcoded country/document schemas exist in EasyOCR.
- **Fail-Safe Operation**: If EasyOCR times out (8000ms threshold) or is offline, Bridge360 degrades gracefully to preserve the original DI result without breaking registration.
- **Layer 1 Single Source of Truth**: All OCR output (DI or EasyOCR) flows through the same dynamic field extraction matching against `u_bridge360_country_document_field`.


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

## 🔍 Standalone EasyOCR Microservice (Services Directory)

A standalone, document-agnostic HTTP microservice wrapping official EasyOCR is located in `services/easyocr-service/`:
*   **Purpose**: Standalone OCR service prepared as a future secondary fallback when ServiceNow Document Intelligence produces low-confidence tokens.
*   **Strict Boundary**: Operates independently and is **NOT connected to the live Bridge360 runtime** yet.
*   **Zero Document Schemas**: Outputs pure raw OCR observations (`text`, `lines`, `words`, `bounding_box`, `confidence`). Contains no identity schemas or document-specific fields.
*   **Run Locally**:
    ```bash
    cd services/easyocr-service
    python app.py
    ```
*   **Run Tests**:
    ```bash
    cd services/easyocr-service
    python test_service.py
    ```
For full details, see [services/easyocr-service/README.md](file:///d:/bridge360/services/easyocr-service/README.md).

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
