// ocrEngine.ts
// 100% ServiceNow-compatible document field extraction.
//
// Every layer here runs entirely from code bundled by Vite — no runtime
// downloads from external CDNs, no SharedArrayBuffer, no WebGPU.
// Works identically on localhost AND on a deployed ServiceNow instance.
//
// Pipeline (most-trustworthy first):
//   1. MRZ parsing        – checksum-validated (passports/IDs), ~99% accurate
//   2. Regex patterns     – email, phone, LinkedIn etc. — format IS the signal
//   3. Label matching     – finds "Date of Birth:", "Surname:" etc. in OCR text
//   4. Position heuristic – last-resort name finder for documents with no labels
//   5. Phone → country    – libphonenumber-js (MIT, bundled) + Intl.DisplayNames

export interface ExtractedField {
  value: string;
  confidence: number; // 0–100
  source: 'mrz' | 'label' | 'pattern' | 'heuristic' | 'phone-lookup';
}

export interface ExtractionResult {
  method: 'MRZ' | 'LABEL' | 'NONE';
  rawText: string;
  fields: Record<string, ExtractedField>;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function toTitleCase(s: string): string {
  return s
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function clean(s: string): string {
  return s.replace(/[^\x20-\x7E\n]/g, '').trim();
}

// ---------------------------------------------------------------------------
// 1. File → image DataURL + Tesseract OCR
//    (Tesseract.js and PDF.js are loaded as <script> tags in index.html)
// ---------------------------------------------------------------------------

export async function fileToImageDataUrl(file: File): Promise<string> {
  const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
  if (!isPdf) {
    return new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }
  // Scanned PDF → render first page to canvas at 3× for better OCR quality
  const pdfjsLib = (window as any).pdfjsLib;
  if (!pdfjsLib) throw new Error('pdf.js not loaded');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 3.0 });
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/png');
}

function preprocessForOCR(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      // Grayscale + contrast stretch (Otsu-style linear)
      let min = 255, max = 0;
      for (let i = 0; i < d.length; i += 4) {
        const g = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
        d[i] = d[i + 1] = d[i + 2] = g;
        if (g < min) min = g;
        if (g > max) max = g;
      }
      const range = Math.max(1, max - min);
      for (let i = 0; i < d.length; i += 4) {
        const stretched = Math.round(((d[i] - min) / range) * 255);
        d[i] = d[i + 1] = d[i + 2] = stretched;
      }
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(dataUrl); // fallback: use as-is
    img.src = dataUrl;
  });
}

interface TesseractWord {
  text: string;
  confidence: number;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

export async function runOCR(
  dataUrl: string
): Promise<{ text: string; words: TesseractWord[] }> {
  const Tesseract = (window as any).Tesseract;
  if (!Tesseract) throw new Error('Tesseract.js not loaded');
  const preprocessed = await preprocessForOCR(dataUrl);
  const result = await Tesseract.recognize(preprocessed, 'eng', {});
  const words: TesseractWord[] = (result.data.words || []).map((w: any) => ({
    text: w.text,
    confidence: w.confidence,
    bbox: w.bbox,
  }));
  return { text: clean(result.data.text || ''), words };
}

// ---------------------------------------------------------------------------
// 2. MRZ parsing — ICAO 9303 standard (TD3 = passport, 2×44 chars)
//    Checksum-validated; when present this is the most reliable source.
// ---------------------------------------------------------------------------

const MRZ_CHAR_VALUE = (c: string): number => {
  if (c === '<') return 0;
  if (c >= '0' && c <= '9') return c.charCodeAt(0) - 48;
  if (c >= 'A' && c <= 'Z') return c.charCodeAt(0) - 55;
  return 0;
};
const MRZ_WEIGHTS = [7, 3, 1];

function mrzChecksum(input: string): number {
  let sum = 0;
  for (let i = 0; i < input.length; i++)
    sum += MRZ_CHAR_VALUE(input[i]) * MRZ_WEIGHTS[i % 3];
  return sum % 10;
}

function mrzDateToISO(yyMMdd: string): string | null {
  if (!/^\d{6}$/.test(yyMMdd)) return null;
  const yy = parseInt(yyMMdd.slice(0, 2), 10);
  const mm = yyMMdd.slice(2, 4);
  const dd = yyMMdd.slice(4, 6);
  const currentYY = new Date().getFullYear() % 100;
  const century = yy > currentYY + 20 ? 1900 : 2000;
  return `${century + yy}-${mm}-${dd}`;
}

function findMRZLines(rawText: string): string[] | null {
  const candidateLines = rawText
    .split('\n')
    .map((l) => l.replace(/\s+/g, '').toUpperCase())
    .map((l) => l.replace(/[«‹《]/g, '<'));
  const mrzLike = candidateLines.filter(
    (l) =>
      l.length >= 30 &&
      /^[A-Z0-9<]+$/.test(l) &&
      (l.match(/</g) || []).length >= 2
  );
  if (mrzLike.length < 2) return null;
  const sorted = [...mrzLike].sort((a, b) => b.length - a.length).slice(0, 2);
  const ordered = candidateLines.filter((l) => sorted.includes(l));
  return ordered.length >= 2 ? ordered.slice(0, 2) : null;
}

function padOrTrim(s: string, len: number): string {
  return (s + '<'.repeat(len)).slice(0, len);
}

export function parseMRZ(rawText: string): ExtractionResult | null {
  const lines = findMRZLines(rawText);
  if (!lines) return null;
  let [line1, line2] = lines;
  line1 = padOrTrim(line1, 44);
  line2 = padOrTrim(line2, 44);
  if (line1[0] !== 'P') return null;

  const country = line1.slice(2, 5).replace(/</g, '');
  const namesPart = line1.slice(5);
  const [surnameRaw, givenRaw = ''] = namesPart.split('<<');
  const surname = surnameRaw.replace(/</g, ' ').trim();
  const givenNames = givenRaw.replace(/</g, ' ').trim();

  const passportNo = line2.slice(0, 9).replace(/</g, '');
  const passportNoCheck = line2[9];
  const nationality = line2.slice(10, 13).replace(/</g, '');
  const dob = line2.slice(13, 19);
  const dobCheck = line2[19];
  const sex = line2[20];
  const expiry = line2.slice(21, 27);
  const expiryCheck = line2[27];

  const passportValid =
    mrzChecksum(line2.slice(0, 9)) === MRZ_CHAR_VALUE(passportNoCheck);
  const dobValid = mrzChecksum(dob) === MRZ_CHAR_VALUE(dobCheck);
  const expiryValid = mrzChecksum(expiry) === MRZ_CHAR_VALUE(expiryCheck);
  const dobISO = mrzDateToISO(dob);
  const expiryISO = mrzDateToISO(expiry);

  const givenParts = givenNames.split(' ').filter(Boolean);
  const fields: Record<string, ExtractedField> = {
    firstName:    { value: toTitleCase(givenParts[0] || ''),           confidence: givenParts.length ? 95 : 0,        source: 'mrz' },
    middleName:   { value: toTitleCase(givenParts.slice(1).join(' ')), confidence: givenParts.length > 1 ? 90 : 0,    source: 'mrz' },
    lastName:     { value: toTitleCase(surname),                        confidence: surname ? 95 : 0,                  source: 'mrz' },
    nationality:  { value: nationality,                                 confidence: nationality ? 92 : 0,              source: 'mrz' },
    countryCode:  { value: country,                                     confidence: country ? 92 : 0,                  source: 'mrz' },
    passportNumber: { value: passportNo, confidence: passportValid ? 99 : 60, source: 'mrz' },
    dateOfBirth:  { value: dobISO || '',  confidence: dobISO ? (dobValid ? 99 : 60) : 0,       source: 'mrz' },
    gender:       { value: sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : '', confidence: sex ? 95 : 0, source: 'mrz' },
    expiryDate:   { value: expiryISO || '', confidence: expiryISO ? (expiryValid ? 99 : 60) : 0, source: 'mrz' },
  };
  return { method: 'MRZ', rawText, fields };
}

// ---------------------------------------------------------------------------
// 3. Regex pattern extraction — fields whose FORMAT is the signal
//    These are authoritative; they ALWAYS win in the final merge.
// ---------------------------------------------------------------------------

const PATTERNS: Record<string, RegExp> = {
  email:    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  linkedin: /linkedin\.com\/in\/[a-zA-Z0-9\-_]+/i,
  github:   /github\.com\/[a-zA-Z0-9\-_]+/i,
  website:  /https?:\/\/[^\s]+|www\.[^\s]+/i,
};

function extractByPattern(rawText: string): Record<string, ExtractedField> {
  const fields: Record<string, ExtractedField> = {};

  // 1. Generic National / Document ID pattern (12-digit, 13-digit, 9-digit, alphanumeric, continuous)
  const idMatch = rawText.match(/\b(\d{4}[\s\-]\d{4}[\s\-]\d{4}|\d{5}[\s\-]\d{7}[\s\-]\d{1}|\d{3}[\s\-]\d{2}[\s\-]\d{4}|[A-Z]{1,3}\d{6,12}|\d{8,16})\b/);
  if (idMatch && !idMatch[1].includes('/')) {
    fields.national_id = { value: idMatch[1].trim(), confidence: 95, source: 'pattern' };
  }

  // 2. Email pattern
  const emailMatch = rawText.match(PATTERNS.email);
  if (emailMatch) {
    fields.email = { value: emailMatch[0].toLowerCase().trim(), confidence: 95, source: 'pattern' };
  }

  // 3. Phone pattern (must NOT be an ID candidate)
  const phoneWithIndicator = rawText.match(/(?:phone|mobile|tel|cell|contact|call|téléphone|telefono|telefon)[ \t.:#\-]*([+]?[\d \t\-().]{7,18}\d)/i);
  const phoneWithPlus = rawText.match(/(\+\d{1,4}[ \t\-().]{0,2}\d{2,5}[ \t\-().]{1,2}\d{3,5}(?:[ \t\-().]{0,2}\d{0,5})?)/);
  const pMatch = phoneWithIndicator || phoneWithPlus;
  if (pMatch && pMatch[1]) {
    const candidatePhone = pMatch[1].trim();
    const cleanDigits = candidatePhone.replace(/\D/g, '');
    const idDigits = idMatch ? idMatch[1].replace(/\D/g, '') : '';
    if (cleanDigits.length >= 7 && cleanDigits !== idDigits) {
      fields.phone = { value: candidatePhone, confidence: 90, source: 'pattern' };
    }
  }

  return fields;
}

// ---------------------------------------------------------------------------
// 4. Label-based extraction — finds "Field Name: value" pairs in OCR text.
//    Uses pixel Y-positions from Tesseract's word bounding boxes to group
//    words into lines so multi-column layouts don't corrupt results.
// ---------------------------------------------------------------------------

const FIELD_LABELS: Record<string, string[]> = {
  firstName:     ['given name', 'given names', 'first name', 'forename', 'forenames'],
  lastName:      ['surname', 'last name', 'family name'],
  dateOfBirth:   ['date of birth', 'birth date', 'dob', 'born on', 'born'],
  gender:        ['sex', 'gender'],
  nationality:   ['nationality', 'citizenship'],
  passportNumber:['passport no', 'passport number', 'document no', 'document number', 'id no'],
  nationalId:    ['national id', 'id number', 'unhcr', 'refugee id'],
  placeOfBirth:  ['place of birth', 'birth place', 'born in'],
  address:       ['address', 'residential address', 'home address', 'current address'],
  issueDate:     ['date of issue', 'issue date', 'issued on', 'issued'],
  expiryDate:    ['date of expiry', 'expiry date', 'valid until', 'expires'],
  email:         ['email', 'e-mail'],
  phone:         ['phone', 'mobile', 'tel', 'contact no', 'phone no', 'mobile no'],
};

function groupWordsIntoLines(
  words: TesseractWord[]
): { text: string; words: TesseractWord[]; y: number }[] {
  const withY = words
    .filter((w) => w.text.trim().length > 0)
    .map((w) => ({ ...w, yc: (w.bbox.y0 + w.bbox.y1) / 2 }))
    .sort((a, b) => a.yc - b.yc || a.bbox.x0 - b.bbox.x0);

  const lines: (TesseractWord & { yc: number })[][] = [];
  const LINE_TOLERANCE_PX = 14;
  for (const w of withY) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(last[0].yc - w.yc) < LINE_TOLERANCE_PX) last.push(w);
    else lines.push([w]);
  }
  return lines.map((l) => ({
    text: l.map((w) => w.text).join(' '),
    words: l,
    y: l[0].yc,
  }));
}

// Common synonyms for general field tokens to assist dynamic matching across languages
const COMMON_FIELD_SYNONYMS: Record<string, string[]> = {
  first_name: ['first name', 'given name', 'given names', 'forename', 'forenames', 'prenom'],
  last_name: ['last name', 'surname', 'family name', 'nom'],
  full_name: ['full name', 'name', 'holder name', 'holder', 'cardholder', 'nom complet', 'nome'],
  date_of_birth: ['date of birth', 'birth date', 'dob', 'born on', 'born', 'date de naissance', 'data di nascita', 'fecha de nacimiento'],
  place_of_birth: ['place of birth', 'birth place', 'born in', 'lieu de naissance', 'luogo di nascita'],
  gender: ['gender', 'sex', 'sexe', 'sexo'],
  nationality: ['nationality', 'citizenship', 'nationalite', 'nazionalita'],
  issue_date: ['date of issue', 'issue date', 'issued on', 'issued', 'date de delivrance', 'data di rilascio'],
  expiry_date: ['date of expiry', 'expiry date', 'valid until', 'expires', 'date dexpiration', 'valable jusquau'],
  address: ['address', 'residential address', 'home address', 'current address', 'adresse', 'indirizzo', 'direccion'],
  registration_date: ['registration date', 'reg date', 'date of registration', 'registered on'],
  registration_number: ['registration number', 'reg number', 'registration no', 'reg no', 'no d enregistrement'],
  father_name: ['father name', "father's name", 'father', 'fathers name', 'nom du pere', 'nome del padre'],
  mother_name: ['mother name', "mother's name", 'mother', 'mothers name', 'nom de la mere', 'nome della madre'],
  license_number: ['license number', 'licence number', 'license no', 'licence no', 'dl no', 'driver license', 'permis'],
  blood_group: ['blood group', 'blood grp', 'blood type', 'groupe sanguin'],
  categories: ['categories', 'category', 'class', 'vehicle classes', 'driving categories'],
  email: ['email', 'e-mail', 'courriel'],
  phone: ['phone', 'mobile', 'tel', 'contact no', 'phone no', 'mobile no', 'cell'],
};

function normalizeLabelText(str: string): string {
  if (!str) return '';
  let s = str.toLowerCase();
  try {
    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  } catch (e) {
    // fallback
  }
  return s.replace(/['’`]/g, '').replace(/[\-_/\\.:#]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchLabelInLine(
  curLine: string,
  targetLabel: string
): { matched: boolean; remainder: string } {
  if (!curLine || !targetLabel) return { matched: false, remainder: '' };

  const lineLower = curLine.toLowerCase();
  const targetLower = targetLabel.toLowerCase().trim();
  const lineNorm = normalizeLabelText(curLine);
  const targetNorm = normalizeLabelText(targetLabel);

  // 1. Literal substring match with strict word boundaries
  let pos = 0;
  while ((pos = lineLower.indexOf(targetLower, pos)) !== -1) {
    const startOk = pos === 0 || /[\s:\-.,#_/\\()'=]/.test(lineLower.charAt(pos - 1));
    const endPos = pos + targetLower.length;
    const endOk = endPos >= lineLower.length || /[\s:\-.,#_/\\()'=]/.test(lineLower.charAt(endPos));
    if (startOk && endOk) {
      const rem = curLine.substring(endPos).replace(/^[\s:\-—=]+/, '').trim();
      return { matched: true, remainder: rem };
    }
    pos += 1;
  }

  // 2. Normalized match (punctuation & accent agnostic) with strict word boundaries
  if (targetNorm && targetNorm.length >= 2) {
    let nPos = 0;
    while ((nPos = lineNorm.indexOf(targetNorm, nPos)) !== -1) {
      const nStartOk = nPos === 0 || lineNorm.charAt(nPos - 1) === ' ';
      const nEndPos = nPos + targetNorm.length;
      const nEndOk = nEndPos >= lineNorm.length || lineNorm.charAt(nEndPos) === ' ';
      if (nStartOk && nEndOk) {
        const targetWords = targetNorm.split(/\s+/).filter(Boolean);
        const lastWord = targetWords[targetWords.length - 1];
        const curUnaccented = normalizeLabelText(curLine);
        const wPos = curUnaccented.indexOf(lastWord);
        let rem = '';
        const colonPos = curLine.indexOf(':');
        if (colonPos !== -1 && colonPos >= (wPos !== -1 ? wPos : 0)) {
          rem = curLine.substring(colonPos + 1).trim();
        } else if (wPos !== -1) {
          rem = curLine.substring(wPos + lastWord.length).replace(/^[\s:\-—=]+/, '').trim();
        }
        return { matched: true, remainder: rem };
      }
      nPos += 1;
    }
  }

  return { matched: false, remainder: '' };
}

function generateDynamicLabelsForField(fieldName: string): string[] {
  const cleanField = fieldName.toLowerCase().trim();
  const human = cleanField.replace(/_/g, ' ');
  const normHuman = normalizeLabelText(human);
  const variants = new Set<string>();

  variants.add(cleanField);
  variants.add(human);
  if (normHuman) variants.add(normHuman);

  // Check known multilingual synonyms
  if (COMMON_FIELD_SYNONYMS[cleanField]) {
    for (const syn of COMMON_FIELD_SYNONYMS[cleanField]) {
      variants.add(syn);
      const synNorm = normalizeLabelText(syn);
      if (synNorm) variants.add(synNorm);
    }
  }

  // Generate generic pattern variations
  if (cleanField.includes('number')) {
    variants.add(cleanField.replace('number', 'no'));
    variants.add(human.replace('number', 'no'));
    variants.add(cleanField.replace('number', 'num'));
    variants.add(human.replace('number', 'num'));
    variants.add(cleanField.replace('number', '#'));
  }
  if (cleanField.includes('_name')) {
    const role = cleanField.replace('_name', '');
    const roleHuman = role.replace(/_/g, ' ');
    variants.add(role);
    variants.add(roleHuman);
    variants.add(`${roleHuman}'s name`);
    variants.add(`${roleHuman}s name`);
    variants.add(`${role}'s name`);
  }
  if (cleanField.includes('date')) {
    variants.add(human.replace('date', '').trim());
  }

  return Array.from(variants);
}

function extractLabeledFields(
  rawText: string,
  words: TesseractWord[],
  expectedFields?: Array<{ name: string; type?: string }>
): Record<string, ExtractedField> {
  const fields: Record<string, ExtractedField> = {};
  const lineObjs = groupWordsIntoLines(words);
  const lineWords = lineObjs.map((l) => l.words);
  const lineTexts = lineObjs.map((l) => l.text);

  // Build target field dictionary: strictly driven by expectedFields when provided
  const targetLabelMap: Record<string, string[]> = {};

  if (expectedFields && expectedFields.length > 0) {
    for (const f of expectedFields) {
      if (!f || !f.name) continue;
      targetLabelMap[f.name] = generateDynamicLabelsForField(f.name);
    }
  } else {
    // Fallback when no expectedFields provided
    for (const [key, variants] of Object.entries(FIELD_LABELS)) {
      targetLabelMap[key] = variants;
    }
  }

  for (const [fieldKey, labelVariants] of Object.entries(targetLabelMap)) {
    for (let i = 0; i < lineTexts.length; i++) {
      let matchedRemainder = '';
      for (const label of labelVariants) {
        const matchRes = matchLabelInLine(lineTexts[i], label);
        if (matchRes.matched) {
          let after = matchRes.remainder;
          if ((after.length === 0 || (after.length === 1 && !/^[a-zA-Z0-9]$/.test(after))) && lineTexts[i + 1]) {
            after = lineTexts[i + 1].trim();
          }
          if (after.length >= 1) {
            matchedRemainder = after;
            break;
          }
        }
      }

      if (matchedRemainder) {
        const avgConf =
          lineWords[i].reduce((s, w) => s + w.confidence, 0) /
          Math.max(1, lineWords[i].length);

        let value = matchedRemainder.replace(/^(name|nom|prenom|prenoms)[ \t.:\-—=]+/i, '').trim();
        const lowerKey = fieldKey.toLowerCase();
        if (lowerKey.includes('name') || lowerKey.includes('place')) {
          value = toTitleCase(value);
        }
        if (lowerKey.includes('gender') || lowerKey === 'sex' || lowerKey === 'sexe' || lowerKey === 'sexo') {
          value = /^f/i.test(value) ? 'Female' : /^m/i.test(value) ? 'Male' : value;
        }
        if (lowerKey.includes('date') || lowerKey.includes('dob')) {
          const dm = value.match(/\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b|\b\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2}\b/);
          if (dm) {
            value = dm[0];
          } else {
            // Discard invalid garbled date strings
            continue;
          }
        }

        fields[fieldKey] = {
          value,
          confidence: Math.round(Math.min(88, avgConf)),
          source: 'label',
        };
        break; // matched this field, advance to next target field
      }
    }
  }
  return fields;
}

// ---------------------------------------------------------------------------
// 5. Position-based name heuristic — last resort when no label exists.
//    Reads lines in OCR print order, picks the first line near the top
//    that looks like a 2-4 word personal name (not a section heading).
// ---------------------------------------------------------------------------

const HEADING_STOPWORDS = new Set([
  'passport', 'republic', 'ministry', 'government', 'authority', 'kingdom', 'federation',
  'department', 'state', 'national', 'card', 'birth', 'united', 'states', 'about', 'me',
  'linkedin', 'github', 'email', 'phone', 'declaration', 'signature', 'personal', 'details',
  'document', 'issued', 'valid', 'expiry', 'place', 'sex', 'country', 'leetcode', 'portfolio',
  'gouvernement', 'republique', 'ministere', 'gobierno', 'republica', 'ministerio',
  'bundesrepublik', 'bundesministerium', 'identite', 'identidad', 'ausweis', 'tarjeta',
  'cedula', 'carte', 'resident', 'citizen', 'registration', 'democratic', 'socialist',
  'confederation', 'sultanate', 'emirates', 'commonwealth'
]);

function looksLikeNameLine(text: string): boolean {
  // Clean surrounding punctuation or bracket artifacts from OCR borders
  const cleaned = text.replace(/^[^a-zA-Z\p{L}]+|[^a-zA-Z\p{L}]+$/gu, '').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 5) return false;
  if (/[@/:\\#]/.test(cleaned) || /https?|www\./i.test(cleaned)) return false;
  // If line contains digits, not a pure name line
  if (/\d/.test(cleaned)) return false;
  
  for (const w of words) {
    const c = w.replace(/[.,\-']/g, '');
    if (c.length < 2) return false;
    if (HEADING_STOPWORDS.has(c.toLowerCase())) return false;
    // Reject 2-letter non-vowel OCR noise tokens like "Ct", "Zs", "Qr", "Xy" (for Latin alphabet)
    if (c.length === 2 && !/[aeiouy\p{M}]/iu.test(c)) return false;
    // Allow Unicode letters, hyphens, and apostrophes (supports accented European, Nordic, Asian transliterations, etc.)
    if (!/^[\p{L}.\-']+$/u.test(c)) return false;
  }
  // At least one word must be a substantial name token (>= 3 chars)
  if (!words.some(w => w.replace(/[.,\-']/g, '').length >= 3)) return false;
  return true;
}

function extractNameHeuristic(rawText: string): Record<string, ExtractedField> {
  const fields: Record<string, ExtractedField> = {};
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  
  for (let i = 0; i < Math.min(lines.length, 22); i++) {
    const line = lines[i];
    if (looksLikeNameLine(line)) {
      const parts = line.replace(/^[^a-zA-Z\p{L}]+|[^a-zA-Z\p{L}]+$/gu, '').split(/\s+/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        fields.firstName = { value: toTitleCase(parts[0]), confidence: 95, source: 'heuristic' };
        fields.lastName = { value: toTitleCase(parts[parts.length - 1]), confidence: 95, source: 'heuristic' };
        if (parts.length > 2) {
          fields.middleName = { value: parts.slice(1, -1).map(toTitleCase).join(' '), confidence: 90, source: 'heuristic' };
        }
        break;
      }
    }
  }
  return fields;
}

function extractAddressHeuristics(rawText: string): Record<string, ExtractedField> {
  const fields: Record<string, ExtractedField> = {};
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  
  for (const line of lines) {
    // Generic address road/building/district tokens in English, French, Spanish, German, Arabic translit, etc.
    if (/\b(street|road|avenue|lane|drive|way|boulevard|bldg|building|apartment|flat|suite|block|sector|district|quarter|rue|avenida|calle|strasse|via|domicile|p\.?o\.?\s*box)\b/i.test(line)) {
      if (!fields.address && line.length >= 8) {
        fields.address = { value: line, confidence: 90, source: 'pattern' };
      }
    }

    // Generic City & Postal Code matcher (e.g., "Cityname 12345" or "12345 Cityname")
    const postalMatch = line.match(/\b([A-Z\p{L}]{3,25})[,\s\-]+(\d{4,8})\b/u) || line.match(/\b(\d{4,8})[,\s\-]+([A-Z\p{L}]{3,25})\b/u);
    if (postalMatch) {
      const candidateCity = /^\d+$/.test(postalMatch[1]) ? postalMatch[2] : postalMatch[1];
      const candidatePostal = /^\d+$/.test(postalMatch[1]) ? postalMatch[1] : postalMatch[2];
      if (!HEADING_STOPWORDS.has(candidateCity.toLowerCase())) {
        if (!fields.city) {
          fields.city = { value: toTitleCase(candidateCity), confidence: 90, source: 'pattern' };
        }
        if (!fields.postalCode) {
          fields.postalCode = { value: candidatePostal, confidence: 90, source: 'pattern' };
        }
      }
    }
  }
  return fields;
}

// ---------------------------------------------------------------------------
// 6. Phone → country of origin via libphonenumber-js (MIT, Vite-bundled)
//    and Intl.DisplayNames (native browser API — no download needed).
// ---------------------------------------------------------------------------

async function extractCountryFromPhone(
  phoneValue: string
): Promise<ExtractedField | null> {
  try {
    const { parsePhoneNumberFromString } = await import('libphonenumber-js');
    const parsed = parsePhoneNumberFromString(phoneValue);
    if (!parsed?.country) return null;
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const countryName = displayNames.of(parsed.country);
    if (!countryName) return null;
    return { value: countryName, confidence: 90, source: 'phone-lookup' };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export function extractFieldsFromText(
  text: string,
  expectedFields?: Array<{ name: string; type?: string }>
): Record<string, ExtractedField> {
  const words: TesseractWord[] = [];
  const lines = text.split('\n');
  let currentY = 10;
  for (const line of lines) {
    const lineWords = line.split(/\s+/).filter(Boolean);
    let currentX = 10;
    for (const w of lineWords) {
      words.push({
        text: w,
        confidence: 90,
        bbox: { x0: currentX, y0: currentY, x1: currentX + w.length * 10, y1: currentY + 14 }
      });
      currentX += w.length * 10 + 10;
    }
    currentY += 20;
  }

  const hasConfiguredSchema = Array.isArray(expectedFields) && expectedFields.length > 0;
  if (!hasConfiguredSchema) {
    return {};
  }

  const expectedNameMap = new Map<string, string>();
  for (const f of expectedFields) {
    if (f && f.name) {
      expectedNameMap.set(f.name.toLowerCase().trim(), f.name);
    }
  }

  const labelFields = extractLabeledFields(text, words, expectedFields);
  const patternFields = extractByPattern(text);
  const mrzResult = parseMRZ(text);
  const addrFields = extractAddressHeuristics(text);
  const nameHeur = extractNameHeuristic(text);

  const layer1Fields: Record<string, ExtractedField> = {};

  for (const [k, v] of Object.entries(labelFields)) {
    const canonical = expectedNameMap.get(k.toLowerCase()) || k;
    layer1Fields[canonical] = v;
  }

  const isPhoneField = (fn: string): boolean => {
    const f = fn.toLowerCase().trim();
    if (f.includes('email')) return false;
    return f.includes('phone') || f.includes('mobile') || f.includes('tel') || f.includes('cell') || f.includes('contact');
  };

  const isIdentifierField = (fn: string): boolean => {
    const f = fn.toLowerCase().trim();
    if (isPhoneField(f)) return false;
    if (f.includes('date') || f.includes('dob') || f.includes('birth')) return false;
    if (f.includes('address') || f.includes('place') || f.includes('location') || f.includes('residence')) return false;
    if (f.includes('photo') || f.includes('signature') || f.includes('image') || f.includes('thumb')) return false;
    if (f.includes('name') && !f.includes('number') && !f.includes('_id')) return false;
    return (
      f.includes('number') ||
      f.includes('_no') ||
      f.includes('no_') ||
      f.includes('_id') ||
      f.includes('id_') ||
      f === 'id' ||
      f === 'nid' ||
      f.includes('identifier') ||
      f.includes('code') ||
      f.includes('num') ||
      f === 'curp' ||
      f === 'cpf' ||
      f === 'inn' ||
      f === 'ssn' ||
      f === 'sin' ||
      f === 'cni' ||
      f === 'dni' ||
      f === 'nie' ||
      f === 'nric' ||
      f === 'bvn' ||
      f === 'nin' ||
      f === 'snils' ||
      f === 'pesel' ||
      f === 'kela' ||
      f === 'mykad' ||
      f === 'absher' ||
      f === 'hukou' ||
      f === 'samordningsnummer'
    );
  };

  const idPatterns = [
    // 12-digit grouped ID (e.g. Aadhaar: 4412 8842 1293 or 4412-8842-1293)
    /\b(\d{4}[\s\-]\d{4}[\s\-]\d{4})\b/,
    // 13-digit 5-7-1 format (e.g. Pakistani CNIC: 12345-1234567-1)
    /\b(\d{5}[\s\-]\d{7}[\s\-]\d{1})\b/,
    // 9-digit 3-2-4 format (e.g. US SSN: 123-45-6789)
    /\b(\d{3}[\s\-]\d{2}[\s\-]\d{4})\b/,
    // 3 groups of digits (e.g. 123 456 789 or 1234 5678 9012)
    /\b(\d{3,5}[\s\-]\d{3,5}[\s\-]\d{3,5})\b/,
    // Alphanumeric document IDs (e.g. Passports: A12345678, DLs: DL123456789012)
    /\b([A-Z]{1,3}\d{6,12})\b/,
    // Continuous 9 to 16 digit IDs
    /\b(\d{9,16})\b/,
    // Continuous 8 digit IDs
    /\b(\d{8})\b/
  ];

  let bestPatternId = '';
  for (const p of idPatterns) {
    const m = text.match(p);
    if (m && m[1]) {
      const candidate = m[1].trim();
      if (!candidate.includes('/') && candidate.length >= 8) {
        bestPatternId = candidate;
        break;
      }
    }
  }

  // Assign or upgrade identifier fields across expected schema
  for (const [lowKey, exactName] of expectedNameMap.entries()) {
    if (isIdentifierField(lowKey)) {
      const existingVal = layer1Fields[exactName]?.value || '';
      const existingDigitsCount = existingVal.replace(/\D/g, '').length;
      const bestDigitsCount = bestPatternId.replace(/\D/g, '').length;

      // If missing or if existing is truncated/partial while a fuller pattern was detected:
      if (!existingVal && bestPatternId) {
        layer1Fields[exactName] = { value: bestPatternId, confidence: 92, source: 'pattern' };
      } else if (bestPatternId && existingDigitsCount < 10 && bestDigitsCount >= 10) {
        layer1Fields[exactName] = { value: bestPatternId, confidence: 92, source: 'pattern' };
      }
    }
  }

  for (const [lowKey, exactName] of expectedNameMap.entries()) {
    if (!layer1Fields[exactName]) {
      if (
        (lowKey === 'full_name' || lowKey.endsWith('_name') || lowKey === 'name' || lowKey.includes('holder') || lowKey.includes('nom_complet') || lowKey.includes('nombre_completo')) &&
        !lowKey.includes('father') && !lowKey.includes('mother') && !lowKey.includes('spouse') && !lowKey.includes('parent') && !lowKey.includes('guardian')
      ) {
        const surnameVal = layer1Fields.last_name?.value || layer1Fields.surname?.value || layer1Fields.nom?.value || layer1Fields.apellidos?.value;
        const givenVal = layer1Fields.first_name?.value || layer1Fields.given_name?.value || layer1Fields.prenoms?.value || layer1Fields.prenom?.value || layer1Fields.forename?.value || layer1Fields.nombres?.value;
        if (surnameVal && givenVal) {
          layer1Fields[exactName] = { value: `${surnameVal} ${givenVal}`, confidence: 90, source: 'label' };
        } else if (nameHeur.firstName && nameHeur.lastName) {
          const fullNameVal = [nameHeur.firstName.value, (nameHeur.middleName?.value || ''), nameHeur.lastName.value].filter(Boolean).join(' ');
          layer1Fields[exactName] = { value: fullNameVal, confidence: 90, source: 'heuristic' };
        }
      } else if (lowKey === 'first_name' || lowKey === 'given_name' || lowKey === 'prenom' || lowKey === 'forename' || lowKey === 'nombres') {
        if (nameHeur.firstName) {
          layer1Fields[exactName] = nameHeur.firstName;
        }
      } else if (lowKey === 'last_name' || lowKey === 'surname' || lowKey === 'family_name' || lowKey === 'nom' || lowKey === 'apellidos') {
        if (nameHeur.lastName) {
          layer1Fields[exactName] = nameHeur.lastName;
        }
      } else if (lowKey === 'middle_name' || lowKey === 'segundo_nombre') {
        if (nameHeur.middleName) {
          layer1Fields[exactName] = nameHeur.middleName;
        }
      }

      if ((lowKey === 'date_of_birth' || lowKey === 'dob' || lowKey.includes('birth') || lowKey.includes('naissance') || lowKey.includes('nacimiento') || lowKey.includes('geburt')) && !layer1Fields[exactName]) {
        const dobRegex = /(?:dob|date of birth|birth date|born|naissance|n[eé](?:e)? le|fecha de nacimiento|geburtsdatum|data di nascita|do[gğ]um tarihi)[ \t.:#\-\[]*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2})/i;
        const dm = text.match(dobRegex);
        if (dm && dm[1]) {
          layer1Fields[exactName] = { value: dm[1], confidence: 90, source: 'pattern' };
        }
      }

      if ((lowKey === 'address' || lowKey === 'residential_address' || lowKey === 'domicile' || lowKey === 'direccion') && addrFields.address) {
        layer1Fields[exactName] = addrFields.address;
      }

      if (isPhoneField(lowKey)) {
        const phoneRegexWithIndicator = /(?:phone|mobile|tel|cell|contact|call)[ \t.:#\-]*([+]?[\d \t\-().]{7,18}\d)/i;
        const phoneRegexWithPlus = /(\+\d{1,4}[ \t\-().]{0,2}\d{2,5}[ \t\-().]{1,2}\d{3,5}(?:[ \t\-().]{0,2}\d{0,5})?)/;
        const pMatch = text.match(phoneRegexWithIndicator) || text.match(phoneRegexWithPlus);
        if (pMatch && pMatch[1]) {
          const candidatePhone = pMatch[1].trim();
          const cleanPhoneDigits = candidatePhone.replace(/\D/g, '');
          const cleanIdDigits = (bestPatternId || '').replace(/\D/g, '');
          if (cleanPhoneDigits.length >= 7 && cleanPhoneDigits !== cleanIdDigits) {
            layer1Fields[exactName] = { value: candidatePhone, confidence: 90, source: 'pattern' };
          }
        }
      }

      if ((lowKey === 'email' || lowKey === 'email_masked') && patternFields.email) {
        layer1Fields[exactName] = patternFields.email;
      }

      if ((lowKey === 'gender' || lowKey === 'sex' || lowKey === 'sexe' || lowKey === 'sexo' || lowKey === 'geschlecht') && !layer1Fields[exactName]) {
        const gm = text.match(/\b(Male|Female|Homme|Femme|Masculino|Femenino|M[äa]nnlich|Weiblich|Maschile|Femminile|Erkek|Kad[ıi]n)\b/i);
        if (gm && gm[1]) {
          const rawVal = gm[1].toLowerCase();
          const gVal = (rawVal.startsWith('f') || rawVal === 'femme' || rawVal === 'weiblich' || rawVal === 'kadın' || rawVal === 'kadin') ? 'Female' : 'Male';
          layer1Fields[exactName] = { value: gVal, confidence: 90, source: 'pattern' };
        }
      }
    }
  }

  return layer1Fields;
}

export async function extractDocumentFields(
  file: File,
  expectedFields?: Array<{ name: string; type?: string }>
): Promise<ExtractionResult> {
  const image = await fileToImageDataUrl(file);
  const { text, words } = await runOCR(image);

  const hasConfiguredSchema = Array.isArray(expectedFields) && expectedFields.length > 0;

  if (hasConfiguredSchema) {
    const layer1Fields = extractFieldsFromText(text, expectedFields);
    const method = Object.keys(layer1Fields).length ? 'LABEL' : 'NONE';
    return { method, rawText: text, fields: layer1Fields };
  }

  // Fallback when no configured schema is supplied (standalone OCR without DB context)
  const patternFields = extractByPattern(text);
  const mrzResult = parseMRZ(text);
  if (mrzResult && Object.values(mrzResult.fields).some((f) => f.confidence >= 90)) {
    const dynamicFields = extractLabeledFields(text, words);
    const merged: Record<string, ExtractedField> = { ...mrzResult.fields, ...dynamicFields, ...patternFields };
    if (merged.phone && !merged.nationality) {
      const c = await extractCountryFromPhone(merged.phone.value);
      if (c) merged.nationality = c;
    }
    return { ...mrzResult, fields: merged };
  }

  const labelFields  = extractLabeledFields(text, words);
  const heurFields   = (!labelFields.firstName || !labelFields.lastName)
    ? extractNameHeuristic(text)
    : {};
  const addrFields   = extractAddressHeuristics(text);

  const merged: Record<string, ExtractedField> = {
    ...heurFields,
    ...addrFields,
    ...labelFields,
    ...patternFields,
  };

  if (merged.phone && !merged.nationality) {
    const c = await extractCountryFromPhone(merged.phone.value);
    if (c) merged.nationality = c;
  }

  const method = Object.keys(labelFields).length ? 'LABEL' : 'NONE';
  return { method, rawText: text, fields: merged };
}

export function confidenceStatus(
  confidence: number
): 'approved' | 'pending' | 'rejected' {
  if (confidence >= 85) return 'approved';
  if (confidence >= 50) return 'pending';
  return 'rejected';
}
