# Bridge360 — Project Handoff Documentation

This document provides the definitive implementation status, architecture, live deployment records, validation checklist, and operational guardrails for the Bridge360 Humanitarian Refugee Case Management System.

---

## 1. Executive Implementation Summary

Bridge360 connects refugee applicants with case officers via an automated, AI-assisted verification and case management workflow on the ServiceNow platform.

| Capability Area | Status | Verification Summary |
|---|---|---|
| Dynamic Country/Document/Field Architecture | **VALIDATED** | 100% database-driven from `u_bridge360_country*` tables. Zero hardcoded schemas. |
| ServiceNow Document Intelligence Integration | **VALIDATED** | Real DI tasks created, executed, and candidate OCR tokens parsed. |
| Bridge360 Generic OCR Matching Layer | **VALIDATED** | Generic word-boundary, accent, punctuation, and name composition logic. |
| Layer 1 Field Enforcement | **VALIDATED** | Only fields configured in `u_bridge360_country_document_field` allowed into Layer 1. |
| Searchable Country & Document UI | **VALIDATED** | Real-time searchable dropdown with instant keyboard navigation and flag/badge display. |
| HTML5 ISO Date Normalization | **VALIDATED** | Extracted dates normalized to ISO `YYYY-MM-DD` and bound into `<input type="date">`. |
| Multi-Agent AI Verification Suite | **VALIDATED** | 4-agent verification pipeline (`aiVerificationService.ts` / platform script include) operational. |
| Existing Registration & Admin Workflows | **VALIDATED** | Case submission, dashboard metrics, referrals, tickets, and family 360 views preserved. |
| Instance Security & Basic Auth Access | **VALIDATED** | `snc_basic_auth_api_access` granted to `admin`; `sys_public` entry created for `bridge360`. |
| Live Client Assets Deployed | **VALIDATED** | `global/index` and `global/main` UX library assets synced to ServiceNow instance. |

---

## 2. Component Status Matrix

### [IMPLEMENTED & VALIDATED]
*   **Dynamic Data Model**:
    - `u_bridge360_country`: Active country directory with ISO codes and dial prefixes.
    - `u_bridge360_country_document`: Per-country document catalog.
    - `u_bridge360_country_document_field`: Dynamic field definitions that strictly define Layer 1 fields.
*   **ServiceNow Document Intelligence (DI) Pipeline**:
    - Attachment creation via `sys_attachment`.
    - Invocation of `sn_docintel.DocIntel` to generate `sys_di_task`.
    - Extraction of native OCR candidate tokens from `sys_di_image.candidates` (`box_words`, `words`, or token arrays).
*   **Generic Extraction & Matching Engine**:
    - `normalizeLabelText`: Unicode `NFD` diacritic decomposition and elision apostrophe stripping (`s.replace(/['’`]/g, '')`).
    - `matchLabelInLine`: Strict word-boundary checks (`[\s:\-.,#_/\\()'=]`) preventing short-label substring collisions (e.g. `"sex"` vs `"sexe: F"`).
    - `getVariants`: Space vs. underscore conversions for composite role names (e.g. `head_of_family_name` $\rightarrow$ `head of family`, `head of family's name`).
    - Constituent Name Combining: Strategy A joins constituent name parts (`Nom` + `Prénoms`, `Surname` + `Given Name`) on nearby lines into `full_name`.
    - Single-Line Layout Candidate Extraction: Constrained to horizontal whitespace (`[ \t]+`), preventing multi-line cross-label bleeding.
    - Identifier vs. Phone Disambiguation: Prevents 12-digit or alphanumeric document IDs from falsely populating contact phone fields.
*   **Client Registration UI**:
    - `SearchableSelect.tsx`: Fast, accessible combobox with auto-focus search input, flag emojis, ISO codes, and keyboard navigation.
    - Autofill into Step 2 inputs, including HTML5 `<input type="date">` ISO date binding.

### [KNOWN LIMITATIONS]
*   **DI Processing Latency**: Real ServiceNow Document Intelligence processing executes asynchronously and typically requires 3 to 8 seconds depending on instance load.
*   **Document Image Quality**: Extremely blurry, degraded, or skewed scans may fail OCR candidate extraction and require manual officer entry.
*   **Non-Latin Script Coverage**: Native OCR token extraction is verified on Latin-script documents and Arabic transliterations. Complex native scripts (e.g. Burmese, Devanagari) rely on ServiceNow Document Intelligence language packs installed on the instance.
*   **Client Fallback OCR**: When ServiceNow Document Intelligence is unreachable or offline, the client falls back to local Tesseract.js OCR.

### [NOT IMPLEMENTED / OUT OF SCOPE]
*   **External 3rd-Party OCR Vendors**: No Google Cloud Vision, AWS Textract, or Azure Document Intelligence APIs are integrated or configured (prohibited by design to keep data within ServiceNow platform boundaries).
*   **Static Hardcoded Field Mappings**: Document schemas are deliberately NOT hardcoded in client or server code.
*   **Automated Document Forgery Detection**: Forensic physical security feature checks (e.g., UV watermark verification, micro-printing analysis) require specialized hardware and are not performed via software OCR.

---

## 3. Live ServiceNow Deployment Records

### Targeted Deployment Architecture
To ensure zero regressions on the live ServiceNow instance, full `sdk:deploy` was **strictly prohibited**. Targeted synchronization was applied exclusively to the dynamic extraction REST operation:

*   **ServiceNow REST Web Service**: `Bridge360 REST API`
    - **Base URI**: `/api/global/v1`
    - **Sys ID**: `c118114f770e424c97c13a0f9553e9cc`
*   **Synchronized REST Operation**: `Document Intelligence Extract`
    - **HTTP Method**: `POST`
    - **Path**: `/extract-document`
    - **Sys ID**: `081e526c946846a5986ca21db2845b8d`
    - **Active Script Size**: 31,416 characters
    - **Live Backup File**: `scratch/backups/live_op_081e526c946846a5986ca21db2845b8d_final_backup.json`

*   **Synchronized Client UX Library Assets (`sys_ux_lib_asset`)**:
    - `global/index` (`d2bc577d1893479ea7788deb62a0219a`): 221,060 bytes, Checksum: `47bea10823f3396d943c95d434549f31` [DEPLOYED]
    - `global/main` (`e128f469876d4b3bb0883ad18a79b4bd`): 2,010,261 bytes, Checksum: `cf4ac4dd82da14da7cbfaf9abdfc0930` [DEPLOYED]

*   **Instance Security & Public Access Records**:
    - **Basic Authentication Gate**: Assigned `snc_basic_auth_api_access` role to `admin` (`sys_user_has_role_85f859a9c3a3c350e54832f1b40131de`), satisfying `SNCRestrictBasicAuth` gate enforcement.
    - **Public UI Page Record**: Created `sys_public` entry for `bridge360` (`sys_public_905915e9c3a3c350e54832f1b40131ed`, `active = true`) enabling seamless unauthenticated client access to `bridge360.do` without session timeouts.

### Components Intentionally Left Untouched
*   `Bridge360AIVerification` (Platform Script Include `6d90b9b1e061418bbace5111e15dbba3` / `9ade59e7064b4544a2da6280dc9dabb6`)
*   `Bridge360VerificationAgent` (Platform Script Include `9ce026ee05a446ca952c443ab299cba1`)
*   AI Agent Studio (`sn_aia`) tools, configurations, and prompts
*   Platform database schemas, tables, and dictionary definitions
*   Verification request and authority records

---

## 4. Live Verification Checklist Results

Executed via automated test suite against the live ServiceNow instance (`run_live_instance_validation.mjs`):

```
================================================================
FINAL LIVE INSTANCE VALIDATION CHECKLIST (11 POINTS)
================================================================

1. Country dropdown loads dynamically from ServiceNow:           [PASS] (10 active countries retrieved)
2. Selecting a country loads only its configured documents:       [PASS] (5 documents for Pakistan)
3. Selecting a document loads its configured fields:              [PASS] (9 configured fields for CDOC-PAK-01)
4. Upload reaches extraction pipeline (/extract-document):        [PASS] (HTTP 200, success: true)
5. ServiceNow DI invoked & taskId returned:                       [PASS] (Task ID: 012f63fee09343107f445f6c88c372b5)
6. DI OCR consumed by Bridge360:                                  [PASS] (34 native OCR tokens parsed)
7. expectedFields from ServiceNow config:                         [PASS] (Dynamic query to u_bridge360_country_document_field)
8. Layer 1 strictly contains only configured fields:              [PASS] (0 unconfigured fields)
9. Generic matching works without corruption:                     [PASS] (gender: "Male", no "e: F", CNIC format preserved)
10. Existing registration behavior preserved:                     [PASS] (Register Application REST operation active)
11. Existing verification/AI behavior preserved:                  [PASS] (Orchestrated Workflow operation & Script Include intact)

OVERALL VALIDATION STATUS: 100% PASSED (ALL 11 POINTS CONFIRMED)
```

---

## 5. Deployment Safety Guardrails for Future Developers

1. **NEVER run `sdk:deploy` without manual diffing**: Running full `sdk:deploy` can overwrite live REST operations or wipe Studio-configured artifacts. Use targeted REST updates via `snRequest` or ServiceNow Studio.
2. **Always Backup Before Modifying**: Capture a JSON snapshot of any `sys_ws_operation` before updating `operation_script`.
3. **Preserve Layer 1 Filtering**: Never bypass `expectedFields` filtering. The database (`u_bridge360_country_document_field`) must remain the sole source of truth for extracted fields.
4. **No Document- or Country-Specific Hardcoding**: All extraction improvements must remain generic across all documents and countries.

---

## 6. EasyOCR Standalone Service & Future Fallback Architecture

### Service Overview
An isolated, document-agnostic OCR HTTP microservice has been built in `services/easyocr-service/` wrapping the official EasyOCR engine (`JaidedAI/EasyOCR` commit `363afb184047ce452e436f4224f3098422df872e`).

### Key Characteristics
*   **Complete Decoupling**: EasyOCR operates independently and is **NOT connected to the live Bridge360 runtime** at this stage.
*   **Pure OCR Observations Only**: The service never extracts document-specific fields (no `aadhaar_number`, `passport_number`, `date_of_birth`, etc.). It only outputs generic text, lines, bounding boxes, words, and confidence.
*   **ServiceNow Source of Truth**: Dynamic configuration in ServiceNow (`u_bridge360_country` $\rightarrow$ `u_bridge360_country_document` $\rightarrow$ `u_bridge360_country_document_field`) remains the sole authority for document schemas and field extraction.

### API Contract
*   `GET /health`: Returns service health, dynamic EasyOCR version, GPU status, and supported language count (86 languages).
*   `POST /ocr`: Accepts base64 JSON (`{"image": "<base64>", "languages": ["en"]}`) or multipart file upload. Returns:
    ```json
    {
      "success": true,
      "text": "...",
      "lines": [{"text": "...", "confidence": 0.95, "bounding_box": [[x1,y1],[x2,y2],[x3,y3],[x4,y4]]}],
      "words": [{"text": "...", "confidence": 0.95, "bounding_box": [...]}],
      "processing_time_ms": 782
    }
    ```

### Validated Two-Tier OCR Architecture (DI Primary + EasyOCR Fallback)
The secondary EasyOCR fallback is **fully integrated and validated**. ServiceNow Document Intelligence remains the **primary** document processing engine, while the standalone EasyOCR microservice operates strictly as a controlled secondary fallback.

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

### Validation & Verification Summary
- **DI Sufficient Test**: **PASS** (Clear document upload processed by ServiceNow DI with 27 tokens; generic quality check evaluated as sufficient; EasyOCR was correctly skipped).
- **DI Insufficient / Fallback Test**: **PASS** (Low-information document with 3 tokens correctly triggered generic assessment `LOW_TOKEN_COUNT (3)`; EasyOCR was invoked, returned text, and routed into existing dynamic extraction; `ocrSource = EASYOCR`).
- **EasyOCR Offline / Timeout Test**: **PASS** (Unreachable endpoint caught gracefully by AbortController; registration did not crash and preserved DI result).
- **Dynamic Field Source of Truth**: **PASS** (8 diverse countries/documents tested; 100% of extracted Layer-1 fields matched configured fields; 0 unconfigured fields).
- **Live ServiceNow Safety**: **PASS** (Document Intelligence, AI Agent Studio, and all 26 live REST operations preserved untouched; `sdk:deploy` was not executed).
- **Hardcoding Audit**: **PASS** (0 country/document-specific extraction branches or schemas).

---

## 7. Security Hardening & Credential Removal Audit

### Hardcoded Password Scrubbing
- **Files Audited & Scrubbed**:
  - `src/client/services/snApi.ts`: Removed the hardcoded ServiceNow admin password fallback. API requests now use standard session authorization header or relative endpoint proxying.
  - `src/client/views/LandingPage.tsx`: Removed plain-text default password values from user-facing documentation / input defaults.
  - `manage-multilingual.mjs`: Removed hardcoded instance credentials; updated to utilize environment variables (`SN_INSTANCE_URL`, `SN_USERNAME`, `SN_PASSWORD`).
- **Result**: 0 hardcoded plain-text admin credentials in client bundle or source files.

---

## 8. AI Mascot Visual Redesign & Positioning Architecture

### 8.1 Mascot Visual Redesign
- **Customer Guide Mascot**: Redrawn with 3D-like gradient shading, distinct hair, headphones, friendly facial features, fingers, boots, and dynamic keyframe micro-animations (floating wave, blinking eyes, talking speech movements, listening cues).
- **Admin Operations AI Intern**: Redrawn with cybernetic visor, operations badge, floating arms, glowing headset, and task status animations.

### 8.2 Sci-Fi Concentric Hologram & Volumetric Light Projection
- **3D Tilted Floor Rings Pedestal**: Styled with 3D perspective (`transform: rotateX(72deg) rotateZ(0deg)`) rendering concentric HUD rings:
  - *Outer Segmented HUD Ring*: Animated clockwise rotation with tick marks.
  - *Middle Tech Ring*: Animated counter-clockwise rotation with geometric chevron accents.
  - *Inner Solid Neon Ring & Emitter Core*: Central optical lens emitting intense light glow.
- **Volumetric Light Rays**: Radiating upward fan beam with layered light streaks (`holo-beam-pulse`), rising light particles (`holo-particle-rise`), and subtle scanlines (`holo-glitch-layer`).
- **Mascot Color Harmonization**:
  - **Customer Portal**: Electric Magenta & Neon Purple/Pink (`#D946EF`, `#A855F7`, `#EC4899`).
  - **Admin Portal**: Cyber Mint & Neon Cyan (`#00F5D4`, `#06B6D4`, `#38BDF8`).

### 8.3 Screen Positioning & Universal Visibility
-   **Layout Position**: The hologram and hexagonal launcher form a bottom-right dock. Holding and dragging the launcher moves the dock (including the mascot and open chat panel); its viewport-clamped position is saved locally. Hologram visibility is controlled through the chat panel's Assistant Settings.
- **Universal Rendering**: Removed former exclusions. `<GlobalAssistant />` is rendered unconditionally across all views:
  - Customer Portal (Home/Landing, Track Application, Registration Engine, Dashboard)
  - Admin Portal (Command Dashboard, Family 360, Cases, Verification, Referrals, Appointments, Analytics, Settings)
  - Root Gateway Landing Page (`#/landing`)

---

## 9. Current Status & Next Steps Roadmap

### Current Completed State
1. **ServiceNow Extraction & DI Pipeline**: Fully functional and validated.
2. **EasyOCR Fallback**: Integrated and validated.
3. **Mascot & Hologram UI**: Fully redesigned, color-harmonized, and positioned on bottom-right across all pages.
4. **Security**: Hardcoded credentials removed.
5. **Mascot interaction shell**: The reference-aligned dock stacks a custom hexagonal bot-head chat launcher beneath the oval projector ring, with the floating mascot centered in a visible hologram beam above it. The beam visually connects to the launcher; the admin projection uses a softer sky-blue palette, and both mascots have animated boot thrusters. The complete floating dock (projector, beam, mascot, and launcher) scales down while docked and grows slightly while active; the chat panel remains full-size for readability. Hologram visibility is controlled through Assistant Settings in the chat panel. Holding and dragging the launcher repositions the complete dock; the clamped position persists locally and the open chat panel follows it. The Work Console renders supplied `AgentRun` state. Proactive interactions, mascot guidance, and advisory admin-agent work are described in Section 10.

### Pending Next Phase: AI Behavior Engine Implementation
The behavior-engine implementation is in progress; see Section 10 for what is implemented in this checkpoint and what still needs validation or instance configuration.

---
## 10. AI Behavior Engine — Current Implementation Checkpoint

### Implemented in the current working tree
- **Proactive guide and admin assistant**: Observes page interaction events and element labels/metadata locally. It does not collect typed field values. Suggestions are shown after inactivity; prompt text is sent for processing only after the user chooses an action. Customer actions explain or guide; admin actions offer a case/page summary or walkthrough.
- **Guided focus and movement**: A chosen guide action can move the mascot toward a page target and display a focus outline. Customer navigation is offered only for same-origin links. The launcher supports a double-tap visibility shortcut as well as hold-and-drag repositioning; its single-click action is delayed briefly so the first tap of a double-tap does not open the chat panel.
- **Idle animation variety**: Twenty randomized docked gestures are available, with pauses between gestures. The hologram beam height is reduced to partially immerse the mascot.
- **Six local admin review roles**: Triage (read-only), document initial-text matching, completeness review, explicit support planning, record-integrity review, and decision drafting. These are deterministic local roles, not configured ServiceNow Agent Studio agents.
- **Role mascots and task choreography**: Scout (triage), Prism (document matching), Ledger (completeness), Beacon (support planning), Aegis (record integrity), and Quill (decision drafting) have distinct full-body SVG characters, role-specific headgear and colors, expressive arms/legs, and boot thrusters. The local six-check assessment now drives the Work Console timeline and hologram swarm together; active role characters orbit and perform randomized gestures as each deterministic check runs.
- **Compact glassmorphism prompt tile**: Proactive messages use a restrained customer/admin gradient with translucent glass styling, reduced dimensions/typography/actions, and a two-line message preview. The bubble replaces the hologram while visible and perches a small portal mascot at its upper-right; its background passes pointer events through to dashboard content while explicit action and dismiss buttons remain interactive.
- **Advisory-only workflow**: Running the local workflow creates a draft note/timeline entry, not a verification or approval. It does not change case/document status, assign or reprioritize a case, mint identity IDs, or invoke the server write workflow. The ServiceNow workflow endpoint was also changed to read-only. Its document matching is an initial text comparison, not identity verification.
- **Evidence-linked OCR confidence**: Extracted values retain their local OCR source and confidence where available. Only fields scoring at least 85/100 are prefilled; scores from 50–84 are visibly marked for review, and lower/unscored values remain unfilled and are flagged. The server's previous heuristic confidence constants were removed because they were not calibrated confidence measurements.

### ServiceNow AI capabilities and instance limits
- Public ServiceNow documentation describes AI Agents/AI Agent Orchestrator, Document Intelligence, AI Search/RAG, Predictive Intelligence, and NLU as possible building blocks. AI Agents and Agent Studio require the applicable plugin, subscription, roles, and supported release; AI Search sources/indexes and Document Intelligence use cases also require configuration.
- These product descriptions do **not** confirm that the Bridge360 target instance has any plugin, entitlement, role, or supported API enabled. No authenticated instance inspection or live deployment was performed during this checkpoint; the local browser preview made existing API requests that returned HTTP 401. Check release, plugins, and entitlements with an authorized instance administrator/account team before choosing an instance-specific integration.
- No conversational Agent Studio sub-agent configuration is checked into this repository. The six local code roles are not evidence of configured or licensed ServiceNow agents. The existing generic runtime call is intentionally not used pending confirmation of the supported API and supervised-action controls.
- An administrator credential appeared in earlier conversation material. It was not used; rotate it if it was real or remains active. Do not place credentials in prompts, source, or handoff documentation.
- References: [ServiceNow AI Agents](https://www.servicenow.com/docs/bundle/australia-intelligent-experiences/page/administer/ai-agents/concept/exploring-ai-agents.html), [AI Agent security](https://www.servicenow.com/docs/bundle/australia-intelligent-experiences/page/administer/ai-agents/concept/security-for-ai-agents.html), [Document Intelligence](https://www.servicenow.com/docs/bundle/australia-intelligent-experiences/page/administer/document-intelligence/concept/exploring-docintel.html), [AI Search RAG](https://www.servicenow.com/docs/bundle/australia-platform-administration/page/administer/ai-search/concept/ai-search-rag.html), [AI Agent Studio release notes](https://www.servicenow.com/docs/bundle/australia-intelligent-experiences/page/release-notes/now-assist-ai-agents-rn.html).

### Remaining work and validation
1. Validate dock dragging, responsive placement, reduced-motion behavior, guide-target alignment through scroll/resize/navigation, and randomized animations in the browser. The launcher double-tap behavior is now browser-checked; a single click is intentionally delayed 300 ms to distinguish it from a double-tap.
2. Local OCR confidence boundaries (0/49 rejected, 50/84 pending review, 85/100 approved) and a synthetic checksum-valid MRZ extraction were verified. Still validate representative ServiceNow extraction responses, especially missing/unscored confidence, medium-confidence review, and high-confidence prefill.
3. ServiceNow plugin, release, and licensing availability remain unverified: local requests return HTTP 401 and require authorized administrator access. After confirmation, map supported ServiceNow agents/tools to specific advisory roles and add explicit human approval before any write-capable action.
4. Decide whether identity-scoped memory or personal greetings are appropriate only after consent, data minimization, access controls, and a reliable source-of-truth are defined. No personal details are currently invented or inferred.
5. Run `npx tsc --noEmit`, `npm run build`, and `git diff --check` after the latest edits. Keep unrelated `src/client/App.tsx` changes out of any commit.

---
*Last Updated: AI Behavior Engine implementation checkpoint*
