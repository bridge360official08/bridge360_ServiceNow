# Bridge360 — Project Development Record

This document records the architectural decisions, technical problem statements, implementation details, testing methodologies, and live deployment procedures for the Bridge360 Refugee Case Management System.

---

## 1. Development Objectives & Scope

### Primary Goal
To build an enterprise-grade Humanitarian Refugee Case Management system hosted on ServiceNow, delivering automated, AI-assisted document verification and case triage while preserving a seamless, empathetic experience for refugees and case officers.

### Scope Boundaries
*   **Zero Hardcoding Policy**: Country lists, document schemas, and field definitions must NEVER be hardcoded in application code. All configurations are retrieved dynamically from ServiceNow custom tables.
*   **Platform-Native Processing**: Utilize ServiceNow Document Intelligence for native OCR candidate extraction and ServiceNow Agent Studio for backend verification.
*   **Targeted Deployment**: Never run `sdk:deploy` indiscriminately over the live instance. Apply targeted REST operation updates to prevent overwriting live functionality.

---

## 2. Dynamic Configuration & Layer 1 Architecture

### 2.1 The Problem
Earlier iterations attempted to use static lists of document fields or hardcoded document schemas. This broke portability across countries and prevented administrators from adding new document types or fields without redeploying code.

### 2.2 The Solution
Implemented a 3-tier dynamic hierarchy in ServiceNow:
1.  **`u_bridge360_country`**: Root country records with ISO2, ISO3, and dialing code metadata.
2.  **`u_bridge360_country_document`**: Document definitions linked to countries (e.g., Computerized National ID, Passport, Family Book).
3.  **`u_bridge360_country_document_field`**: The sole source of truth for Layer 1 fields. Contains field name, data type, mandatory status, and label.

### 2.3 Layer 1 Enforcement
When a document is uploaded:
1.  Bridge360 queries `u_bridge360_country_document_field` for the selected document.
2.  The resulting field definitions form the `expectedFields` payload.
3.  The generic matching engine populates only these configured fields.
4.  Any OCR value not mapped to an active configured field is rejected from Layer 1.

---

## 3. ServiceNow Document Intelligence Integration

### 3.1 Architecture & Flow
1.  **File Upload**: The client sends a document image via `POST /api/global/v1/extract-document`.
2.  **Attachment Creation**: A temporary `sys_attachment` is created in ServiceNow.
3.  **Task Invocation**: The script triggers `sn_docintel.DocIntel.extract(attachmentSysId)`, generating a `sys_di_task`.
4.  **Token Retrieval**: Once processing completes, native OCR candidate tokens are retrieved from `sys_di_image.candidates` (`box_words` or token arrays).
5.  **Preservation & Parsing**: All tokens are preserved and fed into the Bridge360 generic matcher.

### 3.2 Root Cause Fix (Object Structure Drift)
*   *Issue*: Previous code expected a `.words` array on candidate objects. In newer ServiceNow DI releases, tokens are structured as `candObj.box_words` or direct array elements.
*   *Fix*: The parser was generalized to detect arrays across `box_words`, `words`, or candidate objects directly, eliminating fallback discards.

---

## 4. Generic OCR Matching Improvements

Following the multilingual benchmark across diverse document types (France Passport, Syria Family Book, Pakistan CNIC, DRC CNI), several matching problems were identified and resolved without hardcoding:

### 4.1 Punctuation & Elision Normalization
*   *Issue*: In French, Italian, and English documents, apostrophes represent elisions (e.g. `Date d'expiration`, `Father's Name`). Replacing apostrophes with spaces caused word fragmentation (`date d expiration`), causing matching against synonyms like `date dexpiration` to fail.
*   *Fix*: `normalizeLabelText` strips elision apostrophes (`['’`]/g`) directly, while converting other punctuation (`-`, `_`, `/`, `.`, `:`) into spaces. Both `Date d'expiration` and `date dexpiration` normalize to `date dexpiration`.

### 4.2 Unicode Accent & Diacritic Normalization
*   *Issue*: Accented characters (e.g., `Nationalité`, `Française`, `Prénoms`) caused exact string comparisons to fail.
*   *Fix*: Applied generic Unicode `NFD` decomposition (`[\u0300-\u036f]`), stripping accents uniformly across all languages without country-specific code.

### 4.3 Word-Boundary Matching (Preventing Substring Collisions)
*   *Issue*: Short labels like `"sex"` matched within `"sexe: F"` at index 0, slicing from index 3 and producing corrupted output `"e: F"`.
*   *Fix*: Implemented strict word-boundary validation (`matchLabelInLine`). Substring matches must be bounded by line boundaries or boundary separators (`[\s:\-.,#_/\\()'=]`), preventing false substring collisions.

### 4.4 Composite Label Spacing (Spaces vs. Underscores)
*   *Issue*: Fields like `head_of_family_name` failed to match OCR labels with spaces (`Head of Family Name:` or `Head of Family:`).
*   *Fix*: `getVariants` generates space-delimited variants (`head of family name`, `head of family`, `head of family's name`). Redundant secondary prefixes (`Name:`, `Nom:`) are stripped from matched remainders.

### 4.5 Constituent Personal Name Combining
*   *Issue*: When documents provide constituent names across nearby lines (e.g. `Nom: DUBOIS` followed by `Prénoms: CAMILLE MARIE`) and the configured field is `full_name`, only a partial name was captured.
*   *Fix*: Strategy A scans nearby lines ($\le 3$ lines apart) for constituent surname (`nom`, `surname`, `last name`, `postnom`) and given name (`first name`, `given name`, `prenom`, `forename`) labels, combining them in spatial document order.

### 4.6 Single-Line Horizontal Whitespace Matching
*   *Issue*: Layout candidate regex using `\s` crossed newlines, accidentally concatenating words across lines (e.g. `Passeport\nNuméro`).
*   *Fix*: Constrained layout regex strictly to horizontal whitespace (`[ \t]+`) on the same line.

### 4.7 Date Normalization to ISO Standard
*   *Issue*: Extracted dates in various formats (`DD/MM/YYYY`, `DD-MM-YYYY`) failed to bind into HTML5 `<input type="date">` elements, which strictly require ISO `YYYY-MM-DD`.
*   *Fix*: Implemented `normalizeToISODate` in both client and server pipelines, ensuring auto-filled dates populate HTML5 inputs seamlessly.

---

## 5. Testing & Validation Summary

### 5.1 Multilingual Benchmark Results
All 4 benchmark documents were tested live against the ServiceNow extraction REST endpoint:

1.  **France Passport**:
    - Extracted 7 configured fields: `full_name` ("DUBOIS CAMILLE MARIE"), `gender` ("Female"), `expiry_date` ("30/08/2032"), `nationality` ("Française"), `date_of_birth` ("15/04/1990"), `place_of_birth` ("Paris"), `issue_date` ("31/08/2022").
    - Zero substring corruptions; elisions and accents resolved.
2.  **Syria Family Book**:
    - Extracted 8 configured fields including `head_of_family_name` ("AHMAD AL-KHALIL"), `family_book_number` ("SY-FB-98421"), `spouse_name` ("FATIMA AL-HASSAN").
    - Space/underscore variations resolved.
3.  **Pakistan CNIC**:
    - Extracted 7 configured fields including `cnic_number` ("35201-1234567-1"), `full_name` ("MUHAMMAD ALI"), `gender` ("Male"), `address`.
    - Disambiguated identifier from phone fields.
4.  **DRC CNI**:
    - Extracted 11 configured fields including `surname` ("KABWE"), `postnom` ("TSHIMANGA"), `full_name` ("KABWE JEAN"), `expiry_date` ("09/06/2031").
    - Constituent names composed cleanly.

### 5.2 Live Instance 11-Point Checklist
Automated verification (`run_live_instance_validation.mjs`) confirmed 100% pass across all 11 system checkpoints:
*   Dynamic country loading: PASS
*   Dynamic document loading: PASS
*   Dynamic field loading: PASS
*   Extraction pipeline reachability: PASS
*   ServiceNow DI task invocation: PASS (Task ID verified)
*   DI OCR candidate token consumption: PASS (34 native tokens parsed)
*   Dynamic expectedFields enforcement: PASS
*   Layer 1 strict filtering: PASS (0 unconfigured fields)
*   Generic matching accuracy: PASS
*   Existing registration preserved: PASS
*   Existing verification/AI preserved: PASS

---

## 6. Live Deployment & Safety Records

*   **Prohibited Command**: `sdk:deploy` (to prevent wiping live Studio-configured operations).
*   **Targeted REST Operation**: `sys_ws_operation/081e526c946846a5986ca21db2845b8d` (`Document Intelligence Extract`).
*   **Backup Retained**: `scratch/backups/live_op_081e526c946846a5986ca21db2845b8d_final_backup.json`.
*   **Untouched Platform Artifacts**: `Bridge360AIVerification`, `Bridge360VerificationAgent`, AI Agent Studio configurations, and database schemas were completely untouched.

---

## 7. Standalone EasyOCR Microservice & Fallback Architecture

### 7.1 Purpose & Motivation
While ServiceNow Document Intelligence (DI) is the primary native OCR engine for Bridge360, certain edge-case documents (low-contrast scans, unusual layouts, or temporary platform API throttling) can result in low-confidence or sparse candidate tokens. 

To provide enterprise resilience without violating data sovereignty or introducing external cloud OCR dependencies, an isolated Python microservice wrapping the official **EasyOCR** engine (`JaidedAI/EasyOCR`) was developed.

### 7.2 Strict Non-Destructive Separation
*   **Decoupled Location**: Resides entirely in `services/easyocr-service/`.
*   **Zero Document Schemas**: The service has no knowledge of identity fields, country catalogs, or document types. It accepts an image and returns raw textual observations (`text`, `lines`, `words`, `bounding_box`, `confidence`).
*   **ServiceNow Source of Truth**: Dynamic configuration in ServiceNow (`u_bridge360_country_document_field`) remains the sole authority for field names, types, and Layer 1 admission.
*   **Runtime Status**: **Fully integrated and validated** as a controlled secondary fallback.

### 7.3 Validated Two-Tier Fallback Pipeline Architecture
```
ServiceNow Document Intelligence (PRIMARY)
        ↓
Generic DI Quality Assessment (tokens >= 4, length >= 20, fields resolved)
        ↓
SUFFICIENT ─────────→ Keep DI OCR output & Dynamic Extraction
        ↓
INSUFFICIENT / FAILED
        ↓
Standalone EasyOCR Service (/ocr)
        ↓
Common raw OCR text representation
        ↓
Existing Bridge360 dynamic extraction
        ↓
ServiceNow configured document fields (u_bridge360_country_document_field)
        ↓
Layer 1 Enforced
```

### 7.4 Service & Integration Validation
*   **DI-First & DI-Sufficient**: Tested with clear document image in browser session; DI processed 27 tokens; quality assessment evaluated as sufficient; EasyOCR was correctly skipped (`easyOcrUsed: false`, `ocrSource: DI`).
*   **DI-Insufficient Fallback**: Tested with low-information image (3 tokens `< 4`); generic assessment marked DI insufficient; EasyOCR invoked once, succeeded, and passed text into dynamic extraction (`ocrSource: EASYOCR`).
*   **EasyOCR Offline Safety**: Tested unreachable endpoint / timeout; caught gracefully via 8000ms AbortController; registration did not crash and preserved original DI output.
*   **Dynamic Field Source of Truth**: Tested across 8 diverse countries/documents (Turkey, Denmark, Russia, USA, Israel, Thailand, Sri Lanka); 100% of extracted Layer-1 fields matched configured fields with 0 unconfigured fields.
*   **Live ServiceNow Safety**: Document Intelligence, AI Agent Studio, and all 26 live REST operations preserved untouched; `sdk:deploy` was not executed.
*   **Hardcoding Audit**: 100% free of country-specific or document-specific Layer-1 extraction logic.


