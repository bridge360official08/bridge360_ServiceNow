# Bridge360 - Refugee Case Management System
## Comprehensive Application & Development Documentation

Bridge360 is an enterprise-grade Humanitarian Refugee Case Management system engineered as a scoped application on the ServiceNow platform. It is designed to bridge the gap between NGOs, partner agencies, and refugees by providing unified, AI-driven case verification, seamless tracking, and intuitive family self-service portals.

---

## 1. High-Level Architecture & Tech Stack

### Frontend (Client-Side)
*   **Framework**: React 18 with TypeScript.
*   **Build Tool**: Vite.
*   **Routing**: Custom hash-based routing with robust localStorage fallback (enabling deep-linking and state preservation on refresh).
*   **Styling**: Pure CSS (`index.css`) utilizing modern UI patterns like glassmorphism, responsive CSS grid/flexbox, and semantic variables.
*   **Icons**: Lucide React.
*   **Searchable Components**: Accessible, real-time searchable combobox (`SearchableSelect.tsx`) supporting rapid country and document selection with flag emojis, ISO codes, and keyboard navigation.
*   **State Management**: React Context API (`Bridge360Context.tsx`) which manages global states for Families, Documents, Tickets, Referrals, Appointments, and real-time Notifications.

### Backend (Platform)
*   **Platform**: ServiceNow (Washington DC/Xanadu compatible).
*   **Data Structure**: Driven directly by ServiceNow Custom Tables (`sys_id` records for families, documents, evidence, countries, and fields).
*   **REST Web Services**: ServiceNow Scripted REST APIs (`Bridge360 REST API` at `/api/global/v1`).
*   **OCR & Extraction**: Native ServiceNow Document Intelligence (`sys_di_task` / `sys_di_image`) integrated with the Bridge360 generic matching engine.
*   **Authentication**: 
    *   **Admin Staff**: ServiceNow authenticated portal with role-based access.
    *   **Refugee Customers**: Passwordless OTP flow linked to verified Application IDs and Email/Phone records.

---

## 2. Core Modules & Workflows

### 2.1 Landing Page (`LandingPage.tsx`)
The entry point for all users, offering two primary navigation paths:
*   **Family Portal**: Directs to the customer-facing registration and dashboard interface.
*   **Admin Operations**: Secured by an Admin Login Modal. Only authorized staff can access the internal operational workspace.

### 2.2 Customer Portal (`CustomerDashboardView.tsx` & `RegistrationEngine.tsx`)
A secure, simplified interface tailored for refugees:
*   **Step 1 — Document Intake & Live OCR**: Real-time searchable country selector $\rightarrow$ dynamic document selector $\rightarrow$ file upload $\rightarrow$ native ServiceNow Document Intelligence execution $\rightarrow$ generic Layer 1 field extraction.
*   **Step 2 — Pre-Filled Family Head Profile**: Automatically binds extracted personal details (Name, Date of Birth in ISO `YYYY-MM-DD`, Gender, ID/Passport numbers, Address) into editable form inputs for verification.
*   **Step 3 — Family Household Information**: Captures household size, marital status, and sets country of origin with automated nationality inheritance.
*   **Step 4 — Family Members**: Captures details of dependent members with optional last names and dynamic relationship selectors.
*   **Step 5 — Supporting Documents**: Allows uploading supplemental certificates (birth, marriage, medical).
*   **Step 6 — Emergency Contact**: Mandatory emergency contact details for refugee safety.
*   **Step 7 — Review & Legal Declaration**: Final review and declaration submission creating a case record in ServiceNow.

### 2.3 Admin Portal (Staff Operations)
A feature-rich workspace for humanitarian case workers:
*   **DashboardView**: Metrics, recent applications, SLA tracking, and quick triage actions.
*   **Family 360 View**: Comprehensive profile of a selected family, showing timelines, attached documents, and relationships.
*   **VerificationView**: The core document processing suite featuring document previews (zoom, rotate, fullscreen), supervised approval/rejection actions, and document re-requests.
*   **ReferralsView**: Inter-agency assignment module to assign refugees to Partner Agencies for specific services (Health, Housing, Legal).
*   **AdminTicketsView**: Management of support tickets raised by customers.
*   **PartnerAgenciesView**: Directory of linked NGOs and service providers.

---

## 3. Dynamic Configuration Architecture (Data Foundation)

The system enforces a strict data-driven model where no document schemas, country lists, or field definitions are hardcoded in code:

```
u_bridge360_country
       ↓ (1 : N)
u_bridge360_country_document
       ↓ (1 : N)
u_bridge360_country_document_field (Sole Source of Truth for Layer 1)
```

1. **`u_bridge360_country`**: Stores active countries with names, ISO2/ISO3 codes, dialing codes, and active flags.
2. **`u_bridge360_country_document`**: Stores the documents valid for each country (e.g. Passport, CNIC, Family Book, CNI).
3. **`u_bridge360_country_document_field`**: The authoritative definition of Layer 1 fields for each document. Contains `u_field_name`, `u_label`, `u_field_type`, `u_mandatory`, and `u_active`.
4. **Zero Hardcoded Schemas**: When a user selects a country and document, Bridge360 queries ServiceNow in real-time. Only fields configured for that document in ServiceNow are passed as `expectedFields` and accepted into Layer 1.

---

## 4. ServiceNow Document Intelligence & Generic Extraction Pipeline

### 4.1 Architecture Flow

```
User Uploads Document Image
          ↓
Bridge360 POST /api/global/v1/extract-document
          ↓
ServiceNow Attachment Created (sys_attachment)
          ↓
ServiceNow Document Intelligence Invoked (sn_docintel.DocIntel)
          ↓
sys_di_task Created & Executed
          ↓
Native DI OCR Candidate Tokens Extracted (sys_di_image.candidates)
          ↓
Bridge360 Generic Matching Layer (Normalized Tokens & Word Boundaries)
          ↓
Layer 1 Configured Field Filter (Strict u_bridge360_country_document_field Match)
          ↓
Extracted Fields Returned & Autofilled into Application
```

### 4.2 Generic OCR Matching Layer Features
*   **Unicode Diacritic Normalization**: Implemented via generic `NFD` decomposition (`[\u0300-\u036f]`), stripping accents (e.g. `Nationalité` $\rightarrow$ `nationalite`, `Française` $\rightarrow$ `Francaise`) without language- or country-specific branches.
*   **Punctuation & Elision Handling**: Strips elision and contraction apostrophes (`'`, `’`, `` ` ``) so terms like `Date d'expiration` and `date dexpiration` match identically.
*   **Composite Label Space/Underscore Normalization**: Configured fields with underscores (e.g. `head_of_family_name`) generate normalized space variants (`head of family name`, `head of family`, `head of family's name`). Redundant secondary labels (`Name:`, `Nom:`) are cleanly removed.
*   **Strict Word-Boundary Matching**: Validates start and end word boundaries (`[\s:\-.,#_/\\()'=]`) to prevent substring collisions (e.g. `"sex"` cannot falsely match inside `"sexe: F"`).
*   **Constituent Personal Name Composition**: When `full_name` is configured and OCR contains constituent name labels (`Nom` + `Prénoms`, `Surname` + `Given Name`) on nearby lines ($\le 3$ lines apart), they are combined in spatial document order.
*   **Single-Line Layout Matching**: Candidate name layout regex is restricted to horizontal whitespace (`[ \t]+`) on the same line, preventing multi-line cross-label bleed.
*   **Identifier vs. Phone Disambiguation**: Identifiers (CNIC, Aadhaar, Passport) and phone numbers are disambiguated by format, preventing identity numbers from being assigned to phone fields.
*   **HTML5 ISO Date Normalization**: Extracted dates in various formats (`DD/MM/YYYY`, `DD-MM-YYYY`, `YYYY/MM/DD`) are converted to ISO `YYYY-MM-DD` for native `<input type="date">` binding.

---

## 5. Live Deployment Safety & Synchronization

### 5.1 Prohibition of `sdk:deploy`
The repository contains custom REST operations and Script Includes that must not be blindly overwritten:
*   Running `sdk:deploy` would attempt a full project metadata compile which can overwrite live REST operations or wipe operations configured in ServiceNow Studio.
*   **Deployment Rule**: Use **targeted REST operation deployment only** via explicit API updates to `sys_ws_operation/081e526c946846a5986ca21db2845b8d`.
*   A verified JSON backup of the live REST operation is saved in `scratch/backups/`.

### 5.2 Untouched Components (Safety Guardrails)
The following components were intentionally untouched:
*   `Bridge360AIVerification` and `Bridge360VerificationAgent` Script Includes.
*   ServiceNow Document Intelligence platform configuration and integration definitions.
*   AI Agent Studio (`sn_aia`) prompts, tools, and endpoints.
*   Verification decision rules, authorities, and evidence schemas.
*   Database table definitions and column structures.

---

## 6. Live Validation Status

Verified live against the active ServiceNow instance via automated checklist (`run_live_instance_validation.mjs`):

| # | Checkpoint | Status | Details |
|---|---|---|---|
| 1 | Dynamic Country Loading | **PASSED** | Retrieved active countries dynamically from `u_bridge360_country` |
| 2 | Dynamic Document Loading | **PASSED** | Country documents filtered strictly by selected country ID |
| 3 | Dynamic Field Configuration | **PASSED** | Layer 1 fields loaded directly from `u_bridge360_country_document_field` |
| 4 | Extraction Pipeline Reachability | **PASSED** | Endpoint `/api/global/v1/extract-document` responds with HTTP 200 |
| 5 | ServiceNow DI Invocation | **PASSED** | `sys_di_task` created and executed; task ID returned |
| 6 | DI OCR Consumption | **PASSED** | Native DI OCR tokens successfully parsed by Bridge360 |
| 7 | Dynamic Expected Fields | **PASSED** | Only configured database fields passed to Layer 1 |
| 8 | Layer 1 Strict Filtering | **PASSED** | Zero unconfigured fields enter Layer 1 output |
| 9 | Generic OCR Matching | **PASSED** | No substring collisions (`e: F`), accents and elisions resolved |
| 10 | Registration Behavior Preserved | **PASSED** | `Register Application` operation active and verified |
| 11 | Verification & AI Suite Preserved | **PASSED** | Orchestrated workflow & AI Script Includes intact |

---

## 7. Known Limitations

1. **Document Intelligence Processing Latency**: Real Document Intelligence tasks run asynchronously on ServiceNow infrastructure and can take 3–8 seconds depending on server load.
2. **Low-Contrast / Handwritten Documents**: OCR quality depends on clear document scans; low-resolution or heavily handwritten documents may require manual review by case officers.
3. **Non-Latin Scripts**: Full Document Intelligence token parsing is tested on Latin and Arabic-transliterated documents. Complex non-Latin scripts (e.g. Burmese, Devanagari) depend on ServiceNow Document Intelligence language pack availability.
4. **Client-Side Fallback**: If the ServiceNow DI API is unreachable or offline, the client falls back to local Tesseract.js OCR with identical generic matching rules.

---
*Generated for Bridge360 Development & Handoff (Hackathon 2026)*
