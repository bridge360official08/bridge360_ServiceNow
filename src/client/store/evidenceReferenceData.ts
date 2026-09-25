/**
 * Curated Reference Dataset for Country Evidence Intelligence & Verification Authorities
 * 
 * Comprehensive global catalog covering all 42 reference countries and 180+ reference documents.
 * Automatically synchronized with local audit results and countryData specifications.
 */

import {
  CountryRecord,
  CountryDocumentRecord,
  CountryDocumentFieldRecord,
  EvidenceRuleRecord,
  VerificationAuthorityRecord,
  VerificationRequestRecord
} from '../types/bridge360';

export const INITIAL_COUNTRIES: CountryRecord[] = [
  {
    "id": "CTRY-AFG",
    "countryName": "Afghanistan",
    "iso2": "AF",
    "iso3": "AFG",
    "nationality": "Afghan",
    "officialLanguages": "Dari, Pashto",
    "scriptsUsed": "Arabic (Perso-Arabic)",
    "namingConvention": "patronymic",
    "active": true,
    "notes": "Afghanistan national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-BGD",
    "countryName": "Bangladesh",
    "iso2": "BD",
    "iso3": "BGD",
    "nationality": "Bangladeshi",
    "officialLanguages": "Bengali",
    "scriptsUsed": "Bengali",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Bangladesh national identity and civil registry reference profile."
  },
  {
    "id": "15dde3f5b85f03107f44816ad71b5e32",
    "countryName": "Brazil",
    "iso2": "BR",
    "iso3": "BRA",
    "nationality": "Brazilian",
    "officialLanguages": "Portuguese",
    "scriptsUsed": "Latin",
    "namingConvention": "compound",
    "active": true,
    "notes": "Brazil national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-CAN",
    "countryName": "Canada",
    "iso2": "CA",
    "iso3": "CAN",
    "nationality": "Canadian",
    "officialLanguages": "English, French",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Canada national identity and civil registry reference profile."
  },
  {
    "id": "8e6abf75f05303107f44288719b66b45",
    "countryName": "China",
    "iso2": "CN",
    "iso3": "CHN",
    "nationality": "Chinese",
    "officialLanguages": "Mandarin",
    "scriptsUsed": "Simplified Chinese",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "China national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-COD",
    "countryName": "Democratic Republic of the Congo",
    "iso2": "CD",
    "iso3": "COD",
    "nationality": "Congolese (DRC)",
    "officialLanguages": "French, Lingala, Swahili",
    "scriptsUsed": "Latin",
    "namingConvention": "compound",
    "active": true,
    "notes": "Democratic Republic of the Congo national identity and civil registry reference profile."
  },
  {
    "id": "9edd27f5b85f03107f44816ad71b5e38",
    "countryName": "Denmark",
    "iso2": "DK",
    "iso3": "DNK",
    "nationality": "Danish",
    "officialLanguages": "Danish",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Denmark national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-ERI",
    "countryName": "Eritrea",
    "iso2": "ER",
    "iso3": "ERI",
    "nationality": "Eritrean",
    "officialLanguages": "Tigrinya, Arabic, English",
    "scriptsUsed": "Ge'ez, Arabic",
    "namingConvention": "patronymic",
    "active": true,
    "notes": "Eritrea national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-ETH",
    "countryName": "Ethiopia",
    "iso2": "ET",
    "iso3": "ETH",
    "nationality": "Ethiopian",
    "officialLanguages": "Amharic",
    "scriptsUsed": "Ge'ez",
    "namingConvention": "patronymic",
    "active": true,
    "notes": "Ethiopia national identity and civil registry reference profile."
  },
  {
    "id": "b6dd27f5b85f03107f44816ad71b5e3f",
    "countryName": "Finland",
    "iso2": "FI",
    "iso3": "FIN",
    "nationality": "Finnish",
    "officialLanguages": "Finnish, Swedish",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Finland national identity and civil registry reference profile."
  },
  {
    "id": "bcdda3f5b85f03107f44816ad71b5eae",
    "countryName": "France",
    "iso2": "FR",
    "iso3": "FRA",
    "nationality": "French",
    "officialLanguages": "French",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "France national identity and civil registry reference profile."
  },
  {
    "id": "c5dda3f5b85f03107f44816ad71b5eb2",
    "countryName": "Germany",
    "iso2": "DE",
    "iso3": "DEU",
    "nationality": "German",
    "officialLanguages": "German",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Germany national identity and civil registry reference profile."
  },
  {
    "id": "226abfb5f05303107f44288719b66bdf",
    "countryName": "India",
    "iso2": "IN",
    "iso3": "IND",
    "nationality": "Indian",
    "officialLanguages": "Hindi, English",
    "scriptsUsed": "Devanagari, Latin",
    "namingConvention": "compound",
    "active": true,
    "notes": "India national identity and civil registry reference profile."
  },
  {
    "id": "c5ed67f5b85f03107f44816ad71b5e6a",
    "countryName": "Indonesia",
    "iso2": "ID",
    "iso3": "IDN",
    "nationality": "Indonesian",
    "officialLanguages": "Indonesian",
    "scriptsUsed": "Latin",
    "namingConvention": "single_name",
    "active": true,
    "notes": "Indonesia national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-IRQ",
    "countryName": "Iraq",
    "iso2": "IQ",
    "iso3": "IRQ",
    "nationality": "Iraqi",
    "officialLanguages": "Arabic, Kurdish",
    "scriptsUsed": "Arabic",
    "namingConvention": "tripartite",
    "active": true,
    "notes": "Iraq national identity and civil registry reference profile."
  },
  {
    "id": "94eda3b5b85f03107f44816ad71b5ee1",
    "countryName": "Israel",
    "iso2": "IL",
    "iso3": "ISR",
    "nationality": "Israeli",
    "officialLanguages": "Hebrew",
    "scriptsUsed": "Hebrew",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Israel national identity and civil registry reference profile."
  },
  {
    "id": "7ddde3f5b85f03107f44816ad71b5e99",
    "countryName": "Italy",
    "iso2": "IT",
    "iso3": "ITA",
    "nationality": "Italian",
    "officialLanguages": "Italian",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Italy national identity and civil registry reference profile."
  },
  {
    "id": "d9dde3f5b85f03107f44816ad71b5e35",
    "countryName": "Japan",
    "iso2": "JP",
    "iso3": "JPN",
    "nationality": "Japanese",
    "officialLanguages": "Japanese",
    "scriptsUsed": "Kanji, Kana",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Japan national identity and civil registry reference profile."
  },
  {
    "id": "d9ed67f5b85f03107f44816ad71b5e6d",
    "countryName": "Malaysia",
    "iso2": "MY",
    "iso3": "MYS",
    "nationality": "Malaysian",
    "officialLanguages": "Malay",
    "scriptsUsed": "Latin",
    "namingConvention": "patronymic",
    "active": true,
    "notes": "Malaysia national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-MMR",
    "countryName": "Myanmar",
    "iso2": "MM",
    "iso3": "MMR",
    "nationality": "Burmese / Myanmar",
    "officialLanguages": "Burmese",
    "scriptsUsed": "Burmese",
    "namingConvention": "single_name",
    "active": true,
    "notes": "Myanmar national identity and civil registry reference profile."
  },
  {
    "id": "82dde3f5b85f03107f44816ad71b5e9d",
    "countryName": "Netherlands",
    "iso2": "NL",
    "iso3": "NLD",
    "nationality": "Dutch",
    "officialLanguages": "Dutch",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Netherlands national identity and civil registry reference profile."
  },
  {
    "id": "a2dd27f5b85f03107f44816ad71b5e3c",
    "countryName": "Norway",
    "iso2": "NO",
    "iso3": "NOR",
    "nationality": "Norwegian",
    "officialLanguages": "Norwegian",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Norway national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-PAK",
    "countryName": "Pakistan",
    "iso2": "PK",
    "iso3": "PAK",
    "nationality": "Pakistani",
    "officialLanguages": "Urdu, English",
    "scriptsUsed": "Urdu (Nastaliq), Latin",
    "namingConvention": "patronymic",
    "active": true,
    "notes": "Pakistan national identity and civil registry reference profile."
  },
  {
    "id": "8bdd27f5b85f03107f44816ad71b5e42",
    "countryName": "Poland",
    "iso2": "PL",
    "iso3": "POL",
    "nationality": "Polish",
    "officialLanguages": "Polish",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Poland national identity and civil registry reference profile."
  },
  {
    "id": "dfdd67f5b85f03107f44816ad71b5e63",
    "countryName": "Russia",
    "iso2": "RU",
    "iso3": "RUS",
    "nationality": "Russian",
    "officialLanguages": "Russian",
    "scriptsUsed": "Cyrillic",
    "namingConvention": "tripartite",
    "active": true,
    "notes": "Russia national identity and civil registry reference profile."
  },
  {
    "id": "c0ede3f5b85f03107f44816ad71b5e86",
    "countryName": "Saudi Arabia",
    "iso2": "SA",
    "iso3": "SAU",
    "nationality": "Saudi",
    "officialLanguages": "Arabic",
    "scriptsUsed": "Arabic",
    "namingConvention": "tripartite",
    "active": true,
    "notes": "Saudi Arabia national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-SOM",
    "countryName": "Somalia",
    "iso2": "SO",
    "iso3": "SOM",
    "nationality": "Somali",
    "officialLanguages": "Somali, Arabic",
    "scriptsUsed": "Latin, Arabic",
    "namingConvention": "patronymic",
    "active": true,
    "notes": "Somalia national identity and civil registry reference profile."
  },
  {
    "id": "a1dde3f5b85f03107f44816ad71b5e7e",
    "countryName": "South Korea",
    "iso2": "KR",
    "iso3": "KOR",
    "nationality": "South Korean",
    "officialLanguages": "Korean",
    "scriptsUsed": "Hangul",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "South Korea national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-SSD",
    "countryName": "South Sudan",
    "iso2": "SS",
    "iso3": "SSD",
    "nationality": "South Sudanese",
    "officialLanguages": "English",
    "scriptsUsed": "Latin",
    "namingConvention": "patronymic",
    "active": true,
    "notes": "South Sudan national identity and civil registry reference profile."
  },
  {
    "id": "e4dda3f5b85f03107f44816ad71b5eab",
    "countryName": "Spain",
    "iso2": "ES",
    "iso3": "ESP",
    "nationality": "Spanish",
    "officialLanguages": "Spanish",
    "scriptsUsed": "Latin",
    "namingConvention": "compound",
    "active": true,
    "notes": "Spain national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-LKA",
    "countryName": "Sri Lanka",
    "iso2": "LK",
    "iso3": "LKA",
    "nationality": "Sri Lankan",
    "officialLanguages": "Sinhala, Tamil, English",
    "scriptsUsed": "Sinhala, Tamil, Latin",
    "namingConvention": "compound",
    "active": true,
    "notes": "Sri Lanka national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-SDN",
    "countryName": "Sudan",
    "iso2": "SD",
    "iso3": "SDN",
    "nationality": "Sudanese",
    "officialLanguages": "Arabic, English",
    "scriptsUsed": "Arabic, Latin",
    "namingConvention": "patronymic",
    "active": true,
    "notes": "Sudan national identity and civil registry reference profile."
  },
  {
    "id": "86dde3f5b85f03107f44816ad71b5ea0",
    "countryName": "Sweden",
    "iso2": "SE",
    "iso3": "SWE",
    "nationality": "Swedish",
    "officialLanguages": "Swedish",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Sweden national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-SYR",
    "countryName": "Syrian Arab Republic",
    "iso2": "SY",
    "iso3": "SYR",
    "nationality": "Syrian",
    "officialLanguages": "Arabic",
    "scriptsUsed": "Arabic",
    "namingConvention": "tripartite",
    "active": true,
    "notes": "Syrian Arab Republic national identity and civil registry reference profile."
  },
  {
    "id": "926abf75f05303107f44288719b66b4a",
    "countryName": "Taiwan",
    "iso2": "TW",
    "iso3": "TWN",
    "nationality": "Taiwanese",
    "officialLanguages": "Mandarin",
    "scriptsUsed": "Traditional Chinese",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Taiwan national identity and civil registry reference profile."
  },
  {
    "id": "1cede7b5b85f03107f44816ad71b5e91",
    "countryName": "Thailand",
    "iso2": "TH",
    "iso3": "THA",
    "nationality": "Thai",
    "officialLanguages": "Thai",
    "scriptsUsed": "Thai",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Thailand national identity and civil registry reference profile."
  },
  {
    "id": "abdde3f5b85f03107f44816ad71b5e81",
    "countryName": "Turkey",
    "iso2": "TR",
    "iso3": "TUR",
    "nationality": "Turkish",
    "officialLanguages": "Turkish",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "Turkey national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-UKR",
    "countryName": "Ukraine",
    "iso2": "UA",
    "iso3": "UKR",
    "nationality": "Ukrainian",
    "officialLanguages": "Ukrainian",
    "scriptsUsed": "Cyrillic",
    "namingConvention": "tripartite",
    "active": true,
    "notes": "Ukraine national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-GBR",
    "countryName": "United Kingdom",
    "iso2": "GB",
    "iso3": "GBR",
    "nationality": "British",
    "officialLanguages": "English",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "United Kingdom national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-USA",
    "countryName": "United States",
    "iso2": "US",
    "iso3": "USA",
    "nationality": "American",
    "officialLanguages": "English",
    "scriptsUsed": "Latin",
    "namingConvention": "family_surname",
    "active": true,
    "notes": "United States national identity and civil registry reference profile."
  },
  {
    "id": "e0ed67f5b85f03107f44816ad71b5e67",
    "countryName": "Vietnam",
    "iso2": "VN",
    "iso3": "VNM",
    "nationality": "Vietnamese",
    "officialLanguages": "Vietnamese",
    "scriptsUsed": "Latin",
    "namingConvention": "tripartite",
    "active": true,
    "notes": "Vietnam national identity and civil registry reference profile."
  },
  {
    "id": "CTRY-YEM",
    "countryName": "Yemen",
    "iso2": "YE",
    "iso3": "YEM",
    "nationality": "Yemeni",
    "officialLanguages": "Arabic",
    "scriptsUsed": "Arabic",
    "namingConvention": "tripartite",
    "active": true,
    "notes": "Yemen national identity and civil registry reference profile."
  }
];

export const INITIAL_COUNTRY_DOCUMENTS: CountryDocumentRecord[] = [
  {
    "id": "01ba349a901703107f446fc9fda902ab",
    "countryId": "abdde3f5b85f03107f44816ad71b5e81",
    "countryName": "Turkey",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "03aaf09a901703107f446fc9fda9029c",
    "countryId": "9edd27f5b85f03107f44816ad71b5e38",
    "countryName": "Denmark",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "05ba349a901703107f446fc9fda902a1",
    "countryId": "dfdd67f5b85f03107f44816ad71b5e63",
    "countryName": "Russia",
    "documentName": "Propiska (Address Registration)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "079a709a901703107f446fc9fda9021d",
    "countryId": "CTRY-USA",
    "countryName": "United States",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "07ba749a901703107f446fc9fda9029c",
    "countryId": "94eda3b5b85f03107f44816ad71b5ee1",
    "countryName": "Israel",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "09ba349a901703107f446fc9fda902a4",
    "countryId": "abdde3f5b85f03107f44816ad71b5e81",
    "countryName": "Turkey",
    "documentName": "Kimlik (National ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "0bba749a901703107f446fc9fda9029f",
    "countryId": "1cede7b5b85f03107f44816ad71b5e91",
    "countryName": "Thailand",
    "documentName": "National ID Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "0cda789a901703107f446fc9fda9027b",
    "countryId": "CTRY-LKA",
    "countryName": "Sri Lanka",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "0dba349a901703107f446fc9fda902a7",
    "countryId": "abdde3f5b85f03107f44816ad71b5e81",
    "countryName": "Turkey",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "0f9a709a901703107f446fc9fda90200",
    "countryId": "CTRY-USA",
    "countryName": "United States",
    "documentName": "SSN Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "0faaf09a901703107f446fc9fda90263",
    "countryId": "86dde3f5b85f03107f44816ad71b5ea0",
    "countryName": "Sweden",
    "documentName": "Samordningsnummer",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "0faaf09a901703107f446fc9fda90298",
    "countryId": "9edd27f5b85f03107f44816ad71b5e38",
    "countryName": "Denmark",
    "documentName": "National ID Card (Sygesikringsbevis)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "13ba749a901703107f446fc9fda902db",
    "countryId": "1cede7b5b85f03107f44816ad71b5e91",
    "countryName": "Thailand",
    "documentName": "House Registration Book",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "14ba349a901703107f446fc9fda90252",
    "countryId": "8bdd27f5b85f03107f44816ad71b5e42",
    "countryName": "Poland",
    "documentName": "Dowç©¥d Osobisty",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "15ba349a901703107f446fc9fda902ae",
    "countryId": "abdde3f5b85f03107f44816ad71b5e81",
    "countryName": "Turkey",
    "documentName": "Residence Permit",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "179a709a901703107f446fc9fda90224",
    "countryId": "e4dda3f5b85f03107f44816ad71b5eab",
    "countryName": "Spain",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "17aaf09a901703107f446fc9fda9029f",
    "countryId": "9edd27f5b85f03107f44816ad71b5e38",
    "countryName": "Denmark",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "18ba349a901703107f446fc9fda90255",
    "countryId": "8bdd27f5b85f03107f44816ad71b5e42",
    "countryName": "Poland",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "19ba349a901703107f446fc9fda902b1",
    "countryId": "abdde3f5b85f03107f44816ad71b5e81",
    "countryName": "Turkey",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "1b9a709a901703107f446fc9fda90227",
    "countryId": "e4dda3f5b85f03107f44816ad71b5eab",
    "countryName": "Spain",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "1bba749a901703107f446fc9fda902d4",
    "countryId": "1cede7b5b85f03107f44816ad71b5e91",
    "countryName": "Thailand",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "1cba349a901703107f446fc9fda90258",
    "countryId": "8bdd27f5b85f03107f44816ad71b5e42",
    "countryName": "Poland",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "1fba749a901703107f446fc9fda902d7",
    "countryId": "1cede7b5b85f03107f44816ad71b5e91",
    "countryName": "Thailand",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "20ba349a901703107f446fc9fda9025c",
    "countryId": "8bdd27f5b85f03107f44816ad71b5e42",
    "countryName": "Poland",
    "documentName": "PESEL Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "27ba749a901703107f446fc9fda902de",
    "countryId": "1cede7b5b85f03107f44816ad71b5e91",
    "countryName": "Thailand",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "2bca789a901703107f446fc9fda9021f",
    "countryId": "CTRY-PAK",
    "countryName": "Pakistan",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "2fca789a901703107f446fc9fda90218",
    "countryId": "CTRY-BGD",
    "countryName": "Bangladesh",
    "documentName": "TIN Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "30ba349a901703107f446fc9fda9029e",
    "countryId": "dfdd67f5b85f03107f44816ad71b5e63",
    "countryName": "Russia",
    "documentName": "SNILS (Social Security)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "31ca7896901703107f446fc9fda902e9",
    "countryId": "8e6abf75f05303107f44288719b66b45",
    "countryName": "China",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "32aaf09a901703107f446fc9fda9025a",
    "countryId": "86dde3f5b85f03107f44816ad71b5ea0",
    "countryName": "Sweden",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "32ba749a901703107f446fc9fda90299",
    "countryId": "94eda3b5b85f03107f44816ad71b5ee1",
    "countryName": "Israel",
    "documentName": "Teudat Oleh (Immigrant ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "36aaf09a901703107f446fc9fda9025d",
    "countryId": "86dde3f5b85f03107f44816ad71b5ea0",
    "countryName": "Sweden",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "37bab49a901703107f446fc9fda90213",
    "countryId": "e0ed67f5b85f03107f44816ad71b5e67",
    "countryName": "Vietnam",
    "documentName": "Citizen Identity Card (CCCD)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "37ca789a901703107f446fc9fda90226",
    "countryId": "CTRY-LKA",
    "countryName": "Sri Lanka",
    "documentName": "National ID Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "3a9a309a901703107f446fc9fda902f9",
    "countryId": "CTRY-USA",
    "countryName": "United States",
    "documentName": "Driver's License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "3aaaf09a901703107f446fc9fda90260",
    "countryId": "86dde3f5b85f03107f44816ad71b5ea0",
    "countryName": "Sweden",
    "documentName": "Personbevis (Population Extract)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "3aca389a901703107f446fc9fda902b9",
    "countryId": "CTRY-UKR",
    "countryName": "Ukraine",
    "documentName": "INN (Tax ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "3b9a709a901703107f446fc9fda90263",
    "countryId": "bcdda3f5b85f03107f44816ad71b5eae",
    "countryName": "France",
    "documentName": "Titre de Séjour",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "3bbab49a901703107f446fc9fda90216",
    "countryId": "e0ed67f5b85f03107f44816ad71b5e67",
    "countryName": "Vietnam",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "3eba749a901703107f446fc9fda90295",
    "countryId": "94eda3b5b85f03107f44816ad71b5ee1",
    "countryName": "Israel",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "3eca389a901703107f446fc9fda902d5",
    "countryId": "CTRY-UKR",
    "countryName": "Ukraine",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "3fbab49a901703107f446fc9fda90219",
    "countryId": "e0ed67f5b85f03107f44816ad71b5e67",
    "countryName": "Vietnam",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "42ba749a901703107f446fc9fda9021c",
    "countryId": "c0ede3f5b85f03107f44816ad71b5e86",
    "countryName": "Saudi Arabia",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "46ba749a901703107f446fc9fda9021f",
    "countryId": "94eda3b5b85f03107f44816ad71b5ee1",
    "countryName": "Israel",
    "documentName": "Teudat Zehut (ID Card)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "51aab09a901703107f446fc9fda90252",
    "countryId": "d9dde3f5b85f03107f44816ad71b5e35",
    "countryName": "Japan",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "5eaab09a901703107f446fc9fda902d9",
    "countryId": "82dde3f5b85f03107f44816ad71b5e9d",
    "countryName": "Netherlands",
    "documentName": "Identity Card (ID-kaart)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "60cab49a901703107f446fc9fda90281",
    "countryId": "c5ed67f5b85f03107f44816ad71b5e6a",
    "countryName": "Indonesia",
    "documentName": "SIM (Driver's License)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "61aab09a901703107f446fc9fda90294",
    "countryId": "a1dde3f5b85f03107f44816ad71b5e7e",
    "countryName": "South Korea",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "629a309a901703107f446fc9fda9026d",
    "countryId": "CTRY-USA",
    "countryName": "United States",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "639a709a901703107f446fc9fda9025d",
    "countryId": "bcdda3f5b85f03107f44816ad71b5eae",
    "countryName": "France",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "63aaf09a901703107f446fc9fda902fa",
    "countryId": "a2dd27f5b85f03107f44816ad71b5e3c",
    "countryName": "Norway",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "65aab09a901703107f446fc9fda90297",
    "countryId": "a1dde3f5b85f03107f44816ad71b5e7e",
    "countryName": "South Korea",
    "documentName": "Health Insurance Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "67aaf09a901703107f446fc9fda902fd",
    "countryId": "a2dd27f5b85f03107f44816ad71b5e3c",
    "countryName": "Norway",
    "documentName": "BankID (Digital ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "6aba749a901703107f446fc9fda90222",
    "countryId": "94eda3b5b85f03107f44816ad71b5ee1",
    "countryName": "Israel",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "6eca389a901703107f446fc9fda902b2",
    "countryId": "CTRY-UKR",
    "countryName": "Ukraine",
    "documentName": "International Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "70aab09a901703107f446fc9fda9022c",
    "countryId": "15dde3f5b85f03107f44816ad71b5e32",
    "countryName": "Brazil",
    "documentName": "Carteira de Trabalho",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "74cab49a901703107f446fc9fda90284",
    "countryId": "c5ed67f5b85f03107f44816ad71b5e6a",
    "countryName": "Indonesia",
    "documentName": "KK (Family Card)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "779a709a901703107f446fc9fda90260",
    "countryId": "bcdda3f5b85f03107f44816ad71b5eae",
    "countryName": "France",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "78cab49a901703107f446fc9fda90287",
    "countryId": "c5ed67f5b85f03107f44816ad71b5e6a",
    "countryName": "Indonesia",
    "documentName": "NPWP (Tax ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "79aab09a901703107f446fc9fda9029a",
    "countryId": "a1dde3f5b85f03107f44816ad71b5e7e",
    "countryName": "South Korea",
    "documentName": "Family Relation Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "7baa349a901703107f446fc9fda90200",
    "countryId": "a2dd27f5b85f03107f44816ad71b5e3c",
    "countryName": "Norway",
    "documentName": "Fç©´dselsattest (Birth Certificate)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "7ccab49a901703107f446fc9fda9028a",
    "countryId": "d9ed67f5b85f03107f44816ad71b5e6d",
    "countryName": "Malaysia",
    "documentName": "MyKad",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "7dba749a901703107f446fc9fda90218",
    "countryId": "c0ede3f5b85f03107f44816ad71b5e86",
    "countryName": "Saudi Arabia",
    "documentName": "Absher Digital ID",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "7faa349a901703107f446fc9fda90203",
    "countryId": "b6dd27f5b85f03107f44816ad71b5e3f",
    "countryName": "Finland",
    "documentName": "National ID Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "80aa709a901703107f446fc9fda902bb",
    "countryId": "c5dda3f5b85f03107f44816ad71b5eb2",
    "countryName": "Germany",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "80ba349a901703107f446fc9fda90236",
    "countryId": "b6dd27f5b85f03107f44816ad71b5e3f",
    "countryName": "Finland",
    "documentName": "Population Register Extract",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "82aab09a901703107f446fc9fda902d0",
    "countryId": "7ddde3f5b85f03107f44816ad71b5e99",
    "countryName": "Italy",
    "documentName": "Codice Fiscale",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "83ca389a901703107f446fc9fda902e6",
    "countryId": "226abfb5f05303107f44288719b66bdf",
    "countryName": "India",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "84da789a901703107f446fc9fda90278",
    "countryId": "CTRY-LKA",
    "countryName": "Sri Lanka",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "85aab09a901703107f446fc9fda9024b",
    "countryId": "d9dde3f5b85f03107f44816ad71b5e35",
    "countryName": "Japan",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "86aab09a901703107f446fc9fda902d3",
    "countryId": "7ddde3f5b85f03107f44816ad71b5e99",
    "countryName": "Italy",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "86ca389a901703107f446fc9fda90238",
    "countryId": "8e6abf75f05303107f44288719b66b45",
    "countryName": "China",
    "documentName": "Social Security Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "87ca389a901703107f446fc9fda902dc",
    "countryId": "226abfb5f05303107f44288719b66bdf",
    "countryName": "India",
    "documentName": "PAN Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "88aa709a901703107f446fc9fda902b4",
    "countryId": "bcdda3f5b85f03107f44816ad71b5eae",
    "countryName": "France",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "88ba349a901703107f446fc9fda9022f",
    "countryId": "b6dd27f5b85f03107f44816ad71b5e3f",
    "countryName": "Finland",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "89aab09a901703107f446fc9fda9024e",
    "countryId": "d9dde3f5b85f03107f44816ad71b5e35",
    "countryName": "Japan",
    "documentName": "My Number Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8aaab09a901703107f446fc9fda902c9",
    "countryId": "7ddde3f5b85f03107f44816ad71b5e99",
    "countryName": "Italy",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8aca389a901703107f446fc9fda9023b",
    "countryId": "926abf75f05303107f44288719b66b4a",
    "countryName": "Taiwan",
    "documentName": "National ID Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8bca389a901703107f446fc9fda902df",
    "countryId": "226abfb5f05303107f44288719b66bdf",
    "countryName": "India",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8caa709a901703107f446fc9fda902b7",
    "countryId": "c5dda3f5b85f03107f44816ad71b5eb2",
    "countryName": "Germany",
    "documentName": "Personalausweis (National ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8cba349a901703107f446fc9fda90232",
    "countryId": "b6dd27f5b85f03107f44816ad71b5e3f",
    "countryName": "Finland",
    "documentName": "Kela Card (Social Security)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8eaab09a901703107f446fc9fda902cc",
    "countryId": "7ddde3f5b85f03107f44816ad71b5e99",
    "countryName": "Italy",
    "documentName": "Permesso di Soggiorno",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8eca389a901703107f446fc9fda9023e",
    "countryId": "926abf75f05303107f44288719b66b4a",
    "countryName": "Taiwan",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8f9a709a901703107f446fc9fda90220",
    "countryId": "e4dda3f5b85f03107f44816ad71b5eab",
    "countryName": "Spain",
    "documentName": "DNI (National ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "8fca389a901703107f446fc9fda902e2",
    "countryId": "226abfb5f05303107f44288719b66bdf",
    "countryName": "India",
    "documentName": "Voter ID (EPIC)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "90aa709a901703107f446fc9fda902f0",
    "countryId": "c5dda3f5b85f03107f44816ad71b5eb2",
    "countryName": "Germany",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "92aaf09a901703107f446fc9fda90234",
    "countryId": "82dde3f5b85f03107f44816ad71b5e9d",
    "countryName": "Netherlands",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "94aa709a901703107f446fc9fda902f3",
    "countryId": "c5dda3f5b85f03107f44816ad71b5eb2",
    "countryName": "Germany",
    "documentName": "Aufenthaltstitel (Residence Permit)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "97ca389a901703107f446fc9fda902e9",
    "countryId": "226abfb5f05303107f44288719b66bdf",
    "countryName": "India",
    "documentName": "Ration Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "97ca789a901703107f446fc9fda90215",
    "countryId": "CTRY-BGD",
    "countryName": "Bangladesh",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "9aaab09a901703107f446fc9fda902d6",
    "countryId": "82dde3f5b85f03107f44816ad71b5e9d",
    "countryName": "Netherlands",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "9b9a709a901703107f446fc9fda90243",
    "countryId": "e4dda3f5b85f03107f44816ad71b5eab",
    "countryName": "Spain",
    "documentName": "NIE (Foreigner ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "9bca389a901703107f446fc9fda902ec",
    "countryId": "CTRY-BGD",
    "countryName": "Bangladesh",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a0ba349a901703107f446fc9fda90278",
    "countryId": "8bdd27f5b85f03107f44816ad71b5e42",
    "countryName": "Poland",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a39a709a901703107f446fc9fda9024a",
    "countryId": "e4dda3f5b85f03107f44816ad71b5eab",
    "countryName": "Spain",
    "documentName": "Social Security Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a3ca789a901703107f446fc9fda9021c",
    "countryId": "CTRY-PAK",
    "countryName": "Pakistan",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a4aab09a901703107f446fc9fda90222",
    "countryId": "15dde3f5b85f03107f44816ad71b5e32",
    "countryName": "Brazil",
    "documentName": "CPF",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a4ba349a901703107f446fc9fda9027b",
    "countryId": "dfdd67f5b85f03107f44816ad71b5e63",
    "countryName": "Russia",
    "documentName": "Internal Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a6aaf09a901703107f446fc9fda90237",
    "countryId": "82dde3f5b85f03107f44816ad71b5e9d",
    "countryName": "Netherlands",
    "documentName": "Residence Permit",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a79a709a901703107f446fc9fda9024d",
    "countryId": "bcdda3f5b85f03107f44816ad71b5eae",
    "countryName": "France",
    "documentName": "Carte Nationale d'Identité·¼CNI)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a8aa709a901703107f446fc9fda902f6",
    "countryId": "c5dda3f5b85f03107f44816ad71b5eb2",
    "countryName": "Germany",
    "documentName": "Meldebescheinigung (Address Proof)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "a8aab09a901703107f446fc9fda90225",
    "countryId": "15dde3f5b85f03107f44816ad71b5e32",
    "countryName": "Brazil",
    "documentName": "CNH (Driver's License)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "aaaaf09a901703107f446fc9fda9023a",
    "countryId": "82dde3f5b85f03107f44816ad71b5e9d",
    "countryName": "Netherlands",
    "documentName": "BSN (Social Security)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "acaa709a901703107f446fc9fda902f9",
    "countryId": "15dde3f5b85f03107f44816ad71b5e32",
    "countryName": "Brazil",
    "documentName": "RG (Identity Card)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "aeaaf09a901703107f446fc9fda9023d",
    "countryId": "86dde3f5b85f03107f44816ad71b5ea0",
    "countryName": "Sweden",
    "documentName": "National ID Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "af9a709a901703107f446fc9fda90246",
    "countryId": "e4dda3f5b85f03107f44816ad71b5eab",
    "countryName": "Spain",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b1aab09a901703107f446fc9fda902c3",
    "countryId": "7ddde3f5b85f03107f44816ad71b5e99",
    "countryName": "Italy",
    "documentName": "Carta d'Identità¬°",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b1ca389a901703107f446fc9fda90235",
    "countryId": "8e6abf75f05303107f44288719b66b45",
    "countryName": "China",
    "documentName": "Hukou (Household Register)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b29a309a901703107f446fc9fda902fd",
    "countryId": "CTRY-USA",
    "countryName": "United States",
    "documentName": "State ID",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b2ca389a901703107f446fc9fda902d9",
    "countryId": "226abfb5f05303107f44288719b66bdf",
    "countryName": "India",
    "documentName": "Aadhaar Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b5aab09a901703107f446fc9fda902c6",
    "countryId": "7ddde3f5b85f03107f44816ad71b5e99",
    "countryName": "Italy",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b79a709a901703107f446fc9fda902b1",
    "countryId": "bcdda3f5b85f03107f44816ad71b5eae",
    "countryName": "France",
    "documentName": "Carte Vitale (Health)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b7aa349a901703107f446fc9fda9022c",
    "countryId": "b6dd27f5b85f03107f44816ad71b5e3f",
    "countryName": "Finland",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b8ba349a901703107f446fc9fda9027e",
    "countryId": "dfdd67f5b85f03107f44816ad71b5e63",
    "countryName": "Russia",
    "documentName": "International Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "b9ca7896901703107f446fc9fda902e5",
    "countryId": "8e6abf75f05303107f44288719b66b45",
    "countryName": "China",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "bbca789a901703107f446fc9fda90229",
    "countryId": "CTRY-LKA",
    "countryName": "Sri Lanka",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "bcaab09a901703107f446fc9fda90228",
    "countryId": "15dde3f5b85f03107f44816ad71b5e32",
    "countryName": "Brazil",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "bcba349a901703107f446fc9fda90281",
    "countryId": "dfdd67f5b85f03107f44816ad71b5e63",
    "countryName": "Russia",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "bfca789a901703107f446fc9fda90222",
    "countryId": "CTRY-PAK",
    "countryName": "Pakistan",
    "documentName": "B-Form (Birth Certificate)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-AFG-01",
    "countryId": "CTRY-AFG",
    "countryName": "Afghanistan",
    "documentName": "Electronic National Identity Card (e-Tazkira)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-AFG-02",
    "countryId": "CTRY-AFG",
    "countryName": "Afghanistan",
    "documentName": "Paper National Identity Card (Kaghazi Tazkira)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-AFG-03",
    "countryId": "CTRY-AFG",
    "countryName": "Afghanistan",
    "documentName": "Standard Machine Readable Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-AFG-04",
    "countryId": "CTRY-AFG",
    "countryName": "Afghanistan",
    "documentName": "Marriage Certificate (Nikah Nama)",
    "documentCategory": "family_relationship",
    "active": true
  },
  {
    "id": "CDOC-BGD-01",
    "countryId": "CTRY-BGD",
    "countryName": "Bangladesh",
    "documentName": "Smart National Identity Card (Smart NID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-BGD-02",
    "countryId": "CTRY-BGD",
    "countryName": "Bangladesh",
    "documentName": "Online Birth Registration Certificate (BRC)",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-PAK-01",
    "countryId": "CTRY-PAK",
    "countryName": "Pakistan",
    "documentName": "Computerized National Identity Card (CNIC / Smart NIC)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-PAK-02",
    "countryId": "CTRY-PAK",
    "countryName": "Pakistan",
    "documentName": "Family Registration Certificate (FRC)",
    "documentCategory": "family_relationship",
    "active": true
  },
  {
    "id": "CDOC-SOM-01",
    "countryId": "CTRY-SOM",
    "countryName": "Somalia",
    "documentName": "UNHCR Proof of Registration (Refugee Card / Document)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-SYR-01",
    "countryId": "CTRY-SYR",
    "countryName": "Syrian Arab Republic",
    "documentName": "Family Book (Daftar A'ila)",
    "documentCategory": "family_relationship",
    "active": true
  },
  {
    "id": "CDOC-SYR-02",
    "countryId": "CTRY-SYR",
    "countryName": "Syrian Arab Republic",
    "documentName": "National Identity Card (Bitāqat Shakhsiyya)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-SYR-03",
    "countryId": "CTRY-SYR",
    "countryName": "Syrian Arab Republic",
    "documentName": "Individual Civil Status Extract (Ikhraj Qayd)",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-YEM-01",
    "countryId": "CTRY-YEM",
    "countryName": "Yemen",
    "documentName": "National Identity Card (Bitāqat Shakhsiyya)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d0cab49a901703107f446fc9fda9025b",
    "countryId": "e0ed67f5b85f03107f44816ad71b5e67",
    "countryName": "Vietnam",
    "documentName": "Household Register",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d1aab09a901703107f446fc9fda9026e",
    "countryId": "d9dde3f5b85f03107f44816ad71b5e35",
    "countryName": "Japan",
    "documentName": "Residence Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d1ba349a901703107f446fc9fda902c1",
    "countryId": "c0ede3f5b85f03107f44816ad71b5e86",
    "countryName": "Saudi Arabia",
    "documentName": "National ID (Saudi)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d1cab49a901703107f446fc9fda902df",
    "countryId": "d9ed67f5b85f03107f44816ad71b5e6d",
    "countryName": "Malaysia",
    "documentName": "MyPR (Permanent Resident)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d4cab49a901703107f446fc9fda9025e",
    "countryId": "e0ed67f5b85f03107f44816ad71b5e67",
    "countryName": "Vietnam",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d5aab09a901703107f446fc9fda90271",
    "countryId": "d9dde3f5b85f03107f44816ad71b5e35",
    "countryName": "Japan",
    "documentName": "Health Insurance Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d6ca389a901703107f446fc9fda90267",
    "countryId": "926abf75f05303107f44288719b66b4a",
    "countryName": "Taiwan",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d7aaf09a901703107f446fc9fda902a2",
    "countryId": "9edd27f5b85f03107f44816ad71b5e38",
    "countryName": "Denmark",
    "documentName": "NemID (Digital ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d7aaf09a901703107f446fc9fda902d7",
    "countryId": "9edd27f5b85f03107f44816ad71b5e38",
    "countryName": "Denmark",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d8cab49a901703107f446fc9fda90261",
    "countryId": "c5ed67f5b85f03107f44816ad71b5e6a",
    "countryName": "Indonesia",
    "documentName": "KTP (National ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d9aab09a901703107f446fc9fda90274",
    "countryId": "a1dde3f5b85f03107f44816ad71b5e7e",
    "countryName": "South Korea",
    "documentName": "Resident Registration Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "d9cab49a901703107f446fc9fda902d8",
    "countryId": "d9ed67f5b85f03107f44816ad71b5e6d",
    "countryName": "Malaysia",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "daca389a901703107f446fc9fda9026a",
    "countryId": "926abf75f05303107f44288719b66b4a",
    "countryName": "Taiwan",
    "documentName": "Household Register",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "ddcab49a901703107f446fc9fda902db",
    "countryId": "d9ed67f5b85f03107f44816ad71b5e6d",
    "countryName": "Malaysia",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "deca389a901703107f446fc9fda9026d",
    "countryId": "926abf75f05303107f44288719b66b4a",
    "countryName": "Taiwan",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "e2ca389a901703107f446fc9fda90271",
    "countryId": "CTRY-UKR",
    "countryName": "Ukraine",
    "documentName": "Internal Passport (ID Card)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "e2ca389a901703107f446fc9fda902b6",
    "countryId": "CTRY-UKR",
    "countryName": "Ukraine",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "e5ba349a901703107f446fc9fda902c4",
    "countryId": "c0ede3f5b85f03107f44816ad71b5e86",
    "countryName": "Saudi Arabia",
    "documentName": "Iqama (Resident ID)",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "e5cab49a901703107f446fc9fda902e2",
    "countryId": "d9ed67f5b85f03107f44816ad71b5e6d",
    "countryName": "Malaysia",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "e5caf49a901703107f446fc9fda902de",
    "countryId": "8e6abf75f05303107f44288719b66b45",
    "countryName": "China",
    "documentName": "Resident Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "e9ba349a901703107f446fc9fda902c7",
    "countryId": "c0ede3f5b85f03107f44816ad71b5e86",
    "countryName": "Saudi Arabia",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "ebaaf09a901703107f446fc9fda902da",
    "countryId": "a2dd27f5b85f03107f44816ad71b5e3c",
    "countryName": "Norway",
    "documentName": "National ID Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "eccab49a901703107f446fc9fda90264",
    "countryId": "c5ed67f5b85f03107f44816ad71b5e6a",
    "countryName": "Indonesia",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "edaab09a901703107f446fc9fda90277",
    "countryId": "a1dde3f5b85f03107f44816ad71b5e7e",
    "countryName": "South Korea",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "efaaf09a901703107f446fc9fda902dd",
    "countryId": "a2dd27f5b85f03107f44816ad71b5e3c",
    "countryName": "Norway",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "f0aab09a901703107f446fc9fda90248",
    "countryId": "15dde3f5b85f03107f44816ad71b5e32",
    "countryName": "Brazil",
    "documentName": "Birth Certificate",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "fdba349a901703107f446fc9fda902ca",
    "countryId": "c0ede3f5b85f03107f44816ad71b5e86",
    "countryName": "Saudi Arabia",
    "documentName": "Driving License",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-CAN-01",
    "countryId": "CTRY-CAN",
    "countryName": "Canada",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-CAN-02",
    "countryId": "CTRY-CAN",
    "countryName": "Canada",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-CAN-03",
    "countryId": "CTRY-CAN",
    "countryName": "Canada",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-ERI-01",
    "countryId": "CTRY-ERI",
    "countryName": "Eritrea",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-ERI-02",
    "countryId": "CTRY-ERI",
    "countryName": "Eritrea",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-ERI-03",
    "countryId": "CTRY-ERI",
    "countryName": "Eritrea",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-ETH-01",
    "countryId": "CTRY-ETH",
    "countryName": "Ethiopia",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-ETH-02",
    "countryId": "CTRY-ETH",
    "countryName": "Ethiopia",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-ETH-03",
    "countryId": "CTRY-ETH",
    "countryName": "Ethiopia",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-IRQ-01",
    "countryId": "CTRY-IRQ",
    "countryName": "Iraq",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-IRQ-02",
    "countryId": "CTRY-IRQ",
    "countryName": "Iraq",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-IRQ-03",
    "countryId": "CTRY-IRQ",
    "countryName": "Iraq",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-SSD-01",
    "countryId": "CTRY-SSD",
    "countryName": "South Sudan",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-SSD-02",
    "countryId": "CTRY-SSD",
    "countryName": "South Sudan",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-SSD-03",
    "countryId": "CTRY-SSD",
    "countryName": "South Sudan",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-SDN-01",
    "countryId": "CTRY-SDN",
    "countryName": "Sudan",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-SDN-02",
    "countryId": "CTRY-SDN",
    "countryName": "Sudan",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-SDN-03",
    "countryId": "CTRY-SDN",
    "countryName": "Sudan",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-GBR-01",
    "countryId": "CTRY-GBR",
    "countryName": "United Kingdom",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-GBR-02",
    "countryId": "CTRY-GBR",
    "countryName": "United Kingdom",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-GBR-03",
    "countryId": "CTRY-GBR",
    "countryName": "United Kingdom",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-COD-01",
    "countryId": "CTRY-COD",
    "countryName": "Democratic Republic of the Congo",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-COD-02",
    "countryId": "CTRY-COD",
    "countryName": "Democratic Republic of the Congo",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-COD-03",
    "countryId": "CTRY-COD",
    "countryName": "Democratic Republic of the Congo",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  },
  {
    "id": "CDOC-MMR-01",
    "countryId": "CTRY-MMR",
    "countryName": "Myanmar",
    "documentName": "National Identity Card",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-MMR-02",
    "countryId": "CTRY-MMR",
    "countryName": "Myanmar",
    "documentName": "Passport",
    "documentCategory": "identity",
    "active": true
  },
  {
    "id": "CDOC-MMR-03",
    "countryId": "CTRY-MMR",
    "countryName": "Myanmar",
    "documentName": "Birth Certificate",
    "documentCategory": "civil_status",
    "active": true
  }
];

export const INITIAL_COUNTRY_DOCUMENT_FIELDS: CountryDocumentFieldRecord[] = [
  {
    "id": "CDF-00001",
    "countryDocumentId": "01ba349a901703107f446fc9fda902ab",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00002",
    "countryDocumentId": "01ba349a901703107f446fc9fda902ab",
    "fieldName": "tc_kimlik_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00003",
    "countryDocumentId": "01ba349a901703107f446fc9fda902ab",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00004",
    "countryDocumentId": "01ba349a901703107f446fc9fda902ab",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00005",
    "countryDocumentId": "01ba349a901703107f446fc9fda902ab",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00006",
    "countryDocumentId": "01ba349a901703107f446fc9fda902ab",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00007",
    "countryDocumentId": "01ba349a901703107f446fc9fda902ab",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00008",
    "countryDocumentId": "01ba349a901703107f446fc9fda902ab",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00009",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00010",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00011",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00012",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00013",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00014",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00015",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00016",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00017",
    "countryDocumentId": "03aaf09a901703107f446fc9fda9029c",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00018",
    "countryDocumentId": "05ba349a901703107f446fc9fda902a1",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Propiska (Address Registration)"
  },
  {
    "id": "CDF-00019",
    "countryDocumentId": "05ba349a901703107f446fc9fda902a1",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Propiska (Address Registration)"
  },
  {
    "id": "CDF-00020",
    "countryDocumentId": "05ba349a901703107f446fc9fda902a1",
    "fieldName": "registration_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Propiska (Address Registration)"
  },
  {
    "id": "CDF-00021",
    "countryDocumentId": "05ba349a901703107f446fc9fda902a1",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Propiska (Address Registration)"
  },
  {
    "id": "CDF-00022",
    "countryDocumentId": "079a709a901703107f446fc9fda9021d",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00023",
    "countryDocumentId": "079a709a901703107f446fc9fda9021d",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00024",
    "countryDocumentId": "079a709a901703107f446fc9fda9021d",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00025",
    "countryDocumentId": "079a709a901703107f446fc9fda9021d",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00026",
    "countryDocumentId": "079a709a901703107f446fc9fda9021d",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00027",
    "countryDocumentId": "079a709a901703107f446fc9fda9021d",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00028",
    "countryDocumentId": "079a709a901703107f446fc9fda9021d",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00029",
    "countryDocumentId": "07ba749a901703107f446fc9fda9029c",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00030",
    "countryDocumentId": "07ba749a901703107f446fc9fda9029c",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00031",
    "countryDocumentId": "07ba749a901703107f446fc9fda9029c",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00032",
    "countryDocumentId": "07ba749a901703107f446fc9fda9029c",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00033",
    "countryDocumentId": "07ba749a901703107f446fc9fda9029c",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00034",
    "countryDocumentId": "07ba749a901703107f446fc9fda9029c",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00035",
    "countryDocumentId": "07ba749a901703107f446fc9fda9029c",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00036",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00037",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "tc_kimlik_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00038",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00039",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00040",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00041",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00042",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00043",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00044",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00045",
    "countryDocumentId": "09ba349a901703107f446fc9fda902a4",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Kimlik (National ID)"
  },
  {
    "id": "CDF-00046",
    "countryDocumentId": "0bba749a901703107f446fc9fda9029f",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00047",
    "countryDocumentId": "0bba749a901703107f446fc9fda9029f",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00048",
    "countryDocumentId": "0bba749a901703107f446fc9fda9029f",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00049",
    "countryDocumentId": "0bba749a901703107f446fc9fda9029f",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00050",
    "countryDocumentId": "0bba749a901703107f446fc9fda9029f",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00051",
    "countryDocumentId": "0bba749a901703107f446fc9fda9029f",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00052",
    "countryDocumentId": "0bba749a901703107f446fc9fda9029f",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00053",
    "countryDocumentId": "0bba749a901703107f446fc9fda9029f",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00054",
    "countryDocumentId": "0cda789a901703107f446fc9fda9027b",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00055",
    "countryDocumentId": "0cda789a901703107f446fc9fda9027b",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00056",
    "countryDocumentId": "0cda789a901703107f446fc9fda9027b",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00057",
    "countryDocumentId": "0cda789a901703107f446fc9fda9027b",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00058",
    "countryDocumentId": "0cda789a901703107f446fc9fda9027b",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00059",
    "countryDocumentId": "0cda789a901703107f446fc9fda9027b",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00060",
    "countryDocumentId": "0cda789a901703107f446fc9fda9027b",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00061",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00062",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00063",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00064",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00065",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00066",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00067",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00068",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00069",
    "countryDocumentId": "0dba349a901703107f446fc9fda902a7",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00070",
    "countryDocumentId": "0f9a709a901703107f446fc9fda90200",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SSN Card"
  },
  {
    "id": "CDF-00071",
    "countryDocumentId": "0f9a709a901703107f446fc9fda90200",
    "fieldName": "ssn_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SSN Card"
  },
  {
    "id": "CDF-00072",
    "countryDocumentId": "0f9a709a901703107f446fc9fda90200",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for SSN Card"
  },
  {
    "id": "CDF-00073",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90263",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Samordningsnummer"
  },
  {
    "id": "CDF-00074",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90263",
    "fieldName": "coordination_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Samordningsnummer"
  },
  {
    "id": "CDF-00075",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90263",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Samordningsnummer"
  },
  {
    "id": "CDF-00076",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90263",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Samordningsnummer"
  },
  {
    "id": "CDF-00077",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90298",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card (Sygesikringsbevis)"
  },
  {
    "id": "CDF-00078",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90298",
    "fieldName": "cpr_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card (Sygesikringsbevis)"
  },
  {
    "id": "CDF-00079",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90298",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card (Sygesikringsbevis)"
  },
  {
    "id": "CDF-00080",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90298",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card (Sygesikringsbevis)"
  },
  {
    "id": "CDF-00081",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90298",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card (Sygesikringsbevis)"
  },
  {
    "id": "CDF-00082",
    "countryDocumentId": "0faaf09a901703107f446fc9fda90298",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card (Sygesikringsbevis)"
  },
  {
    "id": "CDF-00083",
    "countryDocumentId": "13ba749a901703107f446fc9fda902db",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for House Registration Book"
  },
  {
    "id": "CDF-00084",
    "countryDocumentId": "13ba749a901703107f446fc9fda902db",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for House Registration Book"
  },
  {
    "id": "CDF-00085",
    "countryDocumentId": "13ba749a901703107f446fc9fda902db",
    "fieldName": "family_members_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for House Registration Book"
  },
  {
    "id": "CDF-00086",
    "countryDocumentId": "13ba749a901703107f446fc9fda902db",
    "fieldName": "registration_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for House Registration Book"
  },
  {
    "id": "CDF-00087",
    "countryDocumentId": "13ba749a901703107f446fc9fda902db",
    "fieldName": "house_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for House Registration Book"
  },
  {
    "id": "CDF-00088",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00089",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "pesel_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00090",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00091",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00092",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00093",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00094",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00095",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00096",
    "countryDocumentId": "14ba349a901703107f446fc9fda90252",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Dowç©¥d Osobisty"
  },
  {
    "id": "CDF-00097",
    "countryDocumentId": "15ba349a901703107f446fc9fda902ae",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00098",
    "countryDocumentId": "15ba349a901703107f446fc9fda902ae",
    "fieldName": "permit_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00099",
    "countryDocumentId": "15ba349a901703107f446fc9fda902ae",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00100",
    "countryDocumentId": "15ba349a901703107f446fc9fda902ae",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00101",
    "countryDocumentId": "15ba349a901703107f446fc9fda902ae",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00102",
    "countryDocumentId": "15ba349a901703107f446fc9fda902ae",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00103",
    "countryDocumentId": "15ba349a901703107f446fc9fda902ae",
    "fieldName": "permit_type",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00104",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00105",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00106",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00107",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00108",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00109",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00110",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00111",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00112",
    "countryDocumentId": "179a709a901703107f446fc9fda90224",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00113",
    "countryDocumentId": "17aaf09a901703107f446fc9fda9029f",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00114",
    "countryDocumentId": "17aaf09a901703107f446fc9fda9029f",
    "fieldName": "cpr_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00115",
    "countryDocumentId": "17aaf09a901703107f446fc9fda9029f",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00116",
    "countryDocumentId": "17aaf09a901703107f446fc9fda9029f",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00117",
    "countryDocumentId": "17aaf09a901703107f446fc9fda9029f",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00118",
    "countryDocumentId": "17aaf09a901703107f446fc9fda9029f",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00119",
    "countryDocumentId": "17aaf09a901703107f446fc9fda9029f",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00120",
    "countryDocumentId": "17aaf09a901703107f446fc9fda9029f",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00121",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00122",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00123",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00124",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00125",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00126",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00127",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00128",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00129",
    "countryDocumentId": "18ba349a901703107f446fc9fda90255",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00130",
    "countryDocumentId": "19ba349a901703107f446fc9fda902b1",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00131",
    "countryDocumentId": "19ba349a901703107f446fc9fda902b1",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00132",
    "countryDocumentId": "19ba349a901703107f446fc9fda902b1",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00133",
    "countryDocumentId": "19ba349a901703107f446fc9fda902b1",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00134",
    "countryDocumentId": "19ba349a901703107f446fc9fda902b1",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00135",
    "countryDocumentId": "19ba349a901703107f446fc9fda902b1",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00136",
    "countryDocumentId": "19ba349a901703107f446fc9fda902b1",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00137",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00138",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00139",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00140",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00141",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00142",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00143",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00144",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00145",
    "countryDocumentId": "1b9a709a901703107f446fc9fda90227",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00146",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00147",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00148",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00149",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00150",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00151",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00152",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00153",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00154",
    "countryDocumentId": "1bba749a901703107f446fc9fda902d4",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00155",
    "countryDocumentId": "1cba349a901703107f446fc9fda90258",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00156",
    "countryDocumentId": "1cba349a901703107f446fc9fda90258",
    "fieldName": "pesel_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00157",
    "countryDocumentId": "1cba349a901703107f446fc9fda90258",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00158",
    "countryDocumentId": "1cba349a901703107f446fc9fda90258",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00159",
    "countryDocumentId": "1cba349a901703107f446fc9fda90258",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00160",
    "countryDocumentId": "1cba349a901703107f446fc9fda90258",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00161",
    "countryDocumentId": "1cba349a901703107f446fc9fda90258",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00162",
    "countryDocumentId": "1cba349a901703107f446fc9fda90258",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00163",
    "countryDocumentId": "1fba749a901703107f446fc9fda902d7",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00164",
    "countryDocumentId": "1fba749a901703107f446fc9fda902d7",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00165",
    "countryDocumentId": "1fba749a901703107f446fc9fda902d7",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00166",
    "countryDocumentId": "1fba749a901703107f446fc9fda902d7",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00167",
    "countryDocumentId": "1fba749a901703107f446fc9fda902d7",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00168",
    "countryDocumentId": "1fba749a901703107f446fc9fda902d7",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00169",
    "countryDocumentId": "1fba749a901703107f446fc9fda902d7",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00170",
    "countryDocumentId": "1fba749a901703107f446fc9fda902d7",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00171",
    "countryDocumentId": "20ba349a901703107f446fc9fda9025c",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for PESEL Certificate"
  },
  {
    "id": "CDF-00172",
    "countryDocumentId": "20ba349a901703107f446fc9fda9025c",
    "fieldName": "pesel_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for PESEL Certificate"
  },
  {
    "id": "CDF-00173",
    "countryDocumentId": "20ba349a901703107f446fc9fda9025c",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for PESEL Certificate"
  },
  {
    "id": "CDF-00174",
    "countryDocumentId": "20ba349a901703107f446fc9fda9025c",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for PESEL Certificate"
  },
  {
    "id": "CDF-00175",
    "countryDocumentId": "20ba349a901703107f446fc9fda9025c",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for PESEL Certificate"
  },
  {
    "id": "CDF-00176",
    "countryDocumentId": "27ba749a901703107f446fc9fda902de",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00177",
    "countryDocumentId": "27ba749a901703107f446fc9fda902de",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00178",
    "countryDocumentId": "27ba749a901703107f446fc9fda902de",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00179",
    "countryDocumentId": "27ba749a901703107f446fc9fda902de",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00180",
    "countryDocumentId": "27ba749a901703107f446fc9fda902de",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00181",
    "countryDocumentId": "27ba749a901703107f446fc9fda902de",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00182",
    "countryDocumentId": "27ba749a901703107f446fc9fda902de",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00183",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00184",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00185",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00186",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00187",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "father_husband_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00188",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00189",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00190",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "vehicle_classes",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00191",
    "countryDocumentId": "2bca789a901703107f446fc9fda9021f",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00192",
    "countryDocumentId": "2fca789a901703107f446fc9fda90218",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for TIN Certificate"
  },
  {
    "id": "CDF-00193",
    "countryDocumentId": "2fca789a901703107f446fc9fda90218",
    "fieldName": "tin_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for TIN Certificate"
  },
  {
    "id": "CDF-00194",
    "countryDocumentId": "2fca789a901703107f446fc9fda90218",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for TIN Certificate"
  },
  {
    "id": "CDF-00195",
    "countryDocumentId": "2fca789a901703107f446fc9fda90218",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for TIN Certificate"
  },
  {
    "id": "CDF-00196",
    "countryDocumentId": "2fca789a901703107f446fc9fda90218",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for TIN Certificate"
  },
  {
    "id": "CDF-00197",
    "countryDocumentId": "30ba349a901703107f446fc9fda9029e",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SNILS (Social Security)"
  },
  {
    "id": "CDF-00198",
    "countryDocumentId": "30ba349a901703107f446fc9fda9029e",
    "fieldName": "snils_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SNILS (Social Security)"
  },
  {
    "id": "CDF-00199",
    "countryDocumentId": "30ba349a901703107f446fc9fda9029e",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for SNILS (Social Security)"
  },
  {
    "id": "CDF-00200",
    "countryDocumentId": "31ca7896901703107f446fc9fda902e9",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00201",
    "countryDocumentId": "31ca7896901703107f446fc9fda902e9",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00202",
    "countryDocumentId": "31ca7896901703107f446fc9fda902e9",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00203",
    "countryDocumentId": "31ca7896901703107f446fc9fda902e9",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00204",
    "countryDocumentId": "31ca7896901703107f446fc9fda902e9",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00205",
    "countryDocumentId": "31ca7896901703107f446fc9fda902e9",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00206",
    "countryDocumentId": "31ca7896901703107f446fc9fda902e9",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00207",
    "countryDocumentId": "31ca7896901703107f446fc9fda902e9",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00208",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00209",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00210",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00211",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00212",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00213",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00214",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00215",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00216",
    "countryDocumentId": "32aaf09a901703107f446fc9fda9025a",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00217",
    "countryDocumentId": "32ba749a901703107f446fc9fda90299",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Oleh (Immigrant ID)"
  },
  {
    "id": "CDF-00218",
    "countryDocumentId": "32ba749a901703107f446fc9fda90299",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Oleh (Immigrant ID)"
  },
  {
    "id": "CDF-00219",
    "countryDocumentId": "32ba749a901703107f446fc9fda90299",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Oleh (Immigrant ID)"
  },
  {
    "id": "CDF-00220",
    "countryDocumentId": "32ba749a901703107f446fc9fda90299",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Teudat Oleh (Immigrant ID)"
  },
  {
    "id": "CDF-00221",
    "countryDocumentId": "32ba749a901703107f446fc9fda90299",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Oleh (Immigrant ID)"
  },
  {
    "id": "CDF-00222",
    "countryDocumentId": "36aaf09a901703107f446fc9fda9025d",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00223",
    "countryDocumentId": "36aaf09a901703107f446fc9fda9025d",
    "fieldName": "personal_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00224",
    "countryDocumentId": "36aaf09a901703107f446fc9fda9025d",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00225",
    "countryDocumentId": "36aaf09a901703107f446fc9fda9025d",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00226",
    "countryDocumentId": "36aaf09a901703107f446fc9fda9025d",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00227",
    "countryDocumentId": "36aaf09a901703107f446fc9fda9025d",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00228",
    "countryDocumentId": "36aaf09a901703107f446fc9fda9025d",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00229",
    "countryDocumentId": "36aaf09a901703107f446fc9fda9025d",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00230",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00231",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00232",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00233",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00234",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00235",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00236",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00237",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00238",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00239",
    "countryDocumentId": "37bab49a901703107f446fc9fda90213",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Citizen Identity Card (CCCD)"
  },
  {
    "id": "CDF-00240",
    "countryDocumentId": "37ca789a901703107f446fc9fda90226",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00241",
    "countryDocumentId": "37ca789a901703107f446fc9fda90226",
    "fieldName": "nic_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00242",
    "countryDocumentId": "37ca789a901703107f446fc9fda90226",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00243",
    "countryDocumentId": "37ca789a901703107f446fc9fda90226",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00244",
    "countryDocumentId": "37ca789a901703107f446fc9fda90226",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00245",
    "countryDocumentId": "37ca789a901703107f446fc9fda90226",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00246",
    "countryDocumentId": "37ca789a901703107f446fc9fda90226",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00247",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00248",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00249",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00250",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00251",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00252",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00253",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "class",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00254",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "restrictions",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00255",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00256",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "height",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00257",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "weight",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00258",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "eye_color",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00259",
    "countryDocumentId": "3a9a309a901703107f446fc9fda902f9",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driver's License"
  },
  {
    "id": "CDF-00260",
    "countryDocumentId": "3aaaf09a901703107f446fc9fda90260",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personbevis (Population Extract)"
  },
  {
    "id": "CDF-00261",
    "countryDocumentId": "3aaaf09a901703107f446fc9fda90260",
    "fieldName": "personal_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personbevis (Population Extract)"
  },
  {
    "id": "CDF-00262",
    "countryDocumentId": "3aaaf09a901703107f446fc9fda90260",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personbevis (Population Extract)"
  },
  {
    "id": "CDF-00263",
    "countryDocumentId": "3aaaf09a901703107f446fc9fda90260",
    "fieldName": "marital_status",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personbevis (Population Extract)"
  },
  {
    "id": "CDF-00264",
    "countryDocumentId": "3aaaf09a901703107f446fc9fda90260",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Personbevis (Population Extract)"
  },
  {
    "id": "CDF-00265",
    "countryDocumentId": "3aca389a901703107f446fc9fda902b9",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for INN (Tax ID)"
  },
  {
    "id": "CDF-00266",
    "countryDocumentId": "3aca389a901703107f446fc9fda902b9",
    "fieldName": "inn_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for INN (Tax ID)"
  },
  {
    "id": "CDF-00267",
    "countryDocumentId": "3aca389a901703107f446fc9fda902b9",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for INN (Tax ID)"
  },
  {
    "id": "CDF-00268",
    "countryDocumentId": "3b9a709a901703107f446fc9fda90263",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Titre de Séjour"
  },
  {
    "id": "CDF-00269",
    "countryDocumentId": "3b9a709a901703107f446fc9fda90263",
    "fieldName": "permit_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Titre de Séjour"
  },
  {
    "id": "CDF-00270",
    "countryDocumentId": "3b9a709a901703107f446fc9fda90263",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Titre de Séjour"
  },
  {
    "id": "CDF-00271",
    "countryDocumentId": "3b9a709a901703107f446fc9fda90263",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Titre de Séjour"
  },
  {
    "id": "CDF-00272",
    "countryDocumentId": "3b9a709a901703107f446fc9fda90263",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Titre de Séjour"
  },
  {
    "id": "CDF-00273",
    "countryDocumentId": "3b9a709a901703107f446fc9fda90263",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Titre de Séjour"
  },
  {
    "id": "CDF-00274",
    "countryDocumentId": "3b9a709a901703107f446fc9fda90263",
    "fieldName": "permit_type",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Titre de Séjour"
  },
  {
    "id": "CDF-00275",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00276",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00277",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00278",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00279",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00280",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00281",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00282",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00283",
    "countryDocumentId": "3bbab49a901703107f446fc9fda90216",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00284",
    "countryDocumentId": "3eba749a901703107f446fc9fda90295",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00285",
    "countryDocumentId": "3eba749a901703107f446fc9fda90295",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00286",
    "countryDocumentId": "3eba749a901703107f446fc9fda90295",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00287",
    "countryDocumentId": "3eba749a901703107f446fc9fda90295",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00288",
    "countryDocumentId": "3eba749a901703107f446fc9fda90295",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00289",
    "countryDocumentId": "3eba749a901703107f446fc9fda90295",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00290",
    "countryDocumentId": "3eba749a901703107f446fc9fda90295",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00291",
    "countryDocumentId": "3eba749a901703107f446fc9fda90295",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00292",
    "countryDocumentId": "3eca389a901703107f446fc9fda902d5",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00293",
    "countryDocumentId": "3eca389a901703107f446fc9fda902d5",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00294",
    "countryDocumentId": "3eca389a901703107f446fc9fda902d5",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00295",
    "countryDocumentId": "3eca389a901703107f446fc9fda902d5",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00296",
    "countryDocumentId": "3eca389a901703107f446fc9fda902d5",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00297",
    "countryDocumentId": "3eca389a901703107f446fc9fda902d5",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00298",
    "countryDocumentId": "3eca389a901703107f446fc9fda902d5",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00299",
    "countryDocumentId": "3fbab49a901703107f446fc9fda90219",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00300",
    "countryDocumentId": "3fbab49a901703107f446fc9fda90219",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00301",
    "countryDocumentId": "3fbab49a901703107f446fc9fda90219",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00302",
    "countryDocumentId": "3fbab49a901703107f446fc9fda90219",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00303",
    "countryDocumentId": "3fbab49a901703107f446fc9fda90219",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00304",
    "countryDocumentId": "3fbab49a901703107f446fc9fda90219",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00305",
    "countryDocumentId": "3fbab49a901703107f446fc9fda90219",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00306",
    "countryDocumentId": "3fbab49a901703107f446fc9fda90219",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00307",
    "countryDocumentId": "42ba749a901703107f446fc9fda9021c",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00308",
    "countryDocumentId": "42ba749a901703107f446fc9fda9021c",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00309",
    "countryDocumentId": "42ba749a901703107f446fc9fda9021c",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00310",
    "countryDocumentId": "42ba749a901703107f446fc9fda9021c",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00311",
    "countryDocumentId": "42ba749a901703107f446fc9fda9021c",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00312",
    "countryDocumentId": "42ba749a901703107f446fc9fda9021c",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00313",
    "countryDocumentId": "42ba749a901703107f446fc9fda9021c",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00314",
    "countryDocumentId": "46ba749a901703107f446fc9fda9021f",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Zehut (ID Card)"
  },
  {
    "id": "CDF-00315",
    "countryDocumentId": "46ba749a901703107f446fc9fda9021f",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Zehut (ID Card)"
  },
  {
    "id": "CDF-00316",
    "countryDocumentId": "46ba749a901703107f446fc9fda9021f",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Teudat Zehut (ID Card)"
  },
  {
    "id": "CDF-00317",
    "countryDocumentId": "46ba749a901703107f446fc9fda9021f",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Zehut (ID Card)"
  },
  {
    "id": "CDF-00318",
    "countryDocumentId": "46ba749a901703107f446fc9fda9021f",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Zehut (ID Card)"
  },
  {
    "id": "CDF-00319",
    "countryDocumentId": "46ba749a901703107f446fc9fda9021f",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Teudat Zehut (ID Card)"
  },
  {
    "id": "CDF-00320",
    "countryDocumentId": "46ba749a901703107f446fc9fda9021f",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Teudat Zehut (ID Card)"
  },
  {
    "id": "CDF-00321",
    "countryDocumentId": "46ba749a901703107f446fc9fda9021f",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Teudat Zehut (ID Card)"
  },
  {
    "id": "CDF-00322",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00323",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00324",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00325",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00326",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00327",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00328",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00329",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00330",
    "countryDocumentId": "51aab09a901703107f446fc9fda90252",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00331",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00332",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00333",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00334",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00335",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00336",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00337",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00338",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00339",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00340",
    "countryDocumentId": "5eaab09a901703107f446fc9fda902d9",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Identity Card (ID-kaart)"
  },
  {
    "id": "CDF-00341",
    "countryDocumentId": "60cab49a901703107f446fc9fda90281",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SIM (Driver's License)"
  },
  {
    "id": "CDF-00342",
    "countryDocumentId": "60cab49a901703107f446fc9fda90281",
    "fieldName": "nik",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SIM (Driver's License)"
  },
  {
    "id": "CDF-00343",
    "countryDocumentId": "60cab49a901703107f446fc9fda90281",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SIM (Driver's License)"
  },
  {
    "id": "CDF-00344",
    "countryDocumentId": "60cab49a901703107f446fc9fda90281",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for SIM (Driver's License)"
  },
  {
    "id": "CDF-00345",
    "countryDocumentId": "60cab49a901703107f446fc9fda90281",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for SIM (Driver's License)"
  },
  {
    "id": "CDF-00346",
    "countryDocumentId": "60cab49a901703107f446fc9fda90281",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SIM (Driver's License)"
  },
  {
    "id": "CDF-00347",
    "countryDocumentId": "60cab49a901703107f446fc9fda90281",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for SIM (Driver's License)"
  },
  {
    "id": "CDF-00348",
    "countryDocumentId": "60cab49a901703107f446fc9fda90281",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for SIM (Driver's License)"
  },
  {
    "id": "CDF-00349",
    "countryDocumentId": "61aab09a901703107f446fc9fda90294",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00350",
    "countryDocumentId": "61aab09a901703107f446fc9fda90294",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00351",
    "countryDocumentId": "61aab09a901703107f446fc9fda90294",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00352",
    "countryDocumentId": "61aab09a901703107f446fc9fda90294",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00353",
    "countryDocumentId": "61aab09a901703107f446fc9fda90294",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00354",
    "countryDocumentId": "61aab09a901703107f446fc9fda90294",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00355",
    "countryDocumentId": "61aab09a901703107f446fc9fda90294",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00356",
    "countryDocumentId": "61aab09a901703107f446fc9fda90294",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00357",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00358",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00359",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00360",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00361",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00362",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00363",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00364",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00365",
    "countryDocumentId": "629a309a901703107f446fc9fda9026d",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00366",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00367",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00368",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00369",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00370",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00371",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00372",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00373",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00374",
    "countryDocumentId": "639a709a901703107f446fc9fda9025d",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00375",
    "countryDocumentId": "63aaf09a901703107f446fc9fda902fa",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00376",
    "countryDocumentId": "63aaf09a901703107f446fc9fda902fa",
    "fieldName": "national_id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00377",
    "countryDocumentId": "63aaf09a901703107f446fc9fda902fa",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00378",
    "countryDocumentId": "63aaf09a901703107f446fc9fda902fa",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00379",
    "countryDocumentId": "63aaf09a901703107f446fc9fda902fa",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00380",
    "countryDocumentId": "63aaf09a901703107f446fc9fda902fa",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00381",
    "countryDocumentId": "63aaf09a901703107f446fc9fda902fa",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00382",
    "countryDocumentId": "63aaf09a901703107f446fc9fda902fa",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00383",
    "countryDocumentId": "65aab09a901703107f446fc9fda90297",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-00384",
    "countryDocumentId": "65aab09a901703107f446fc9fda90297",
    "fieldName": "insurance_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-00385",
    "countryDocumentId": "65aab09a901703107f446fc9fda90297",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-00386",
    "countryDocumentId": "65aab09a901703107f446fc9fda90297",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-00387",
    "countryDocumentId": "65aab09a901703107f446fc9fda90297",
    "fieldName": "employer_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-00388",
    "countryDocumentId": "65aab09a901703107f446fc9fda90297",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-00389",
    "countryDocumentId": "67aaf09a901703107f446fc9fda902fd",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for BankID (Digital ID)"
  },
  {
    "id": "CDF-00390",
    "countryDocumentId": "67aaf09a901703107f446fc9fda902fd",
    "fieldName": "national_id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for BankID (Digital ID)"
  },
  {
    "id": "CDF-00391",
    "countryDocumentId": "67aaf09a901703107f446fc9fda902fd",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for BankID (Digital ID)"
  },
  {
    "id": "CDF-00392",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00393",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00394",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00395",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00396",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00397",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00398",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00399",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00400",
    "countryDocumentId": "6aba749a901703107f446fc9fda90222",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00401",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00402",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00403",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00404",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00405",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00406",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00407",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00408",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00409",
    "countryDocumentId": "6eca389a901703107f446fc9fda902b2",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00410",
    "countryDocumentId": "70aab09a901703107f446fc9fda9022c",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carteira de Trabalho"
  },
  {
    "id": "CDF-00411",
    "countryDocumentId": "70aab09a901703107f446fc9fda9022c",
    "fieldName": "work_card_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carteira de Trabalho"
  },
  {
    "id": "CDF-00412",
    "countryDocumentId": "70aab09a901703107f446fc9fda9022c",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carteira de Trabalho"
  },
  {
    "id": "CDF-00413",
    "countryDocumentId": "70aab09a901703107f446fc9fda9022c",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carteira de Trabalho"
  },
  {
    "id": "CDF-00414",
    "countryDocumentId": "70aab09a901703107f446fc9fda9022c",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carteira de Trabalho"
  },
  {
    "id": "CDF-00415",
    "countryDocumentId": "70aab09a901703107f446fc9fda9022c",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carteira de Trabalho"
  },
  {
    "id": "CDF-00416",
    "countryDocumentId": "74cab49a901703107f446fc9fda90284",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KK (Family Card)"
  },
  {
    "id": "CDF-00417",
    "countryDocumentId": "74cab49a901703107f446fc9fda90284",
    "fieldName": "kk_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KK (Family Card)"
  },
  {
    "id": "CDF-00418",
    "countryDocumentId": "74cab49a901703107f446fc9fda90284",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KK (Family Card)"
  },
  {
    "id": "CDF-00419",
    "countryDocumentId": "74cab49a901703107f446fc9fda90284",
    "fieldName": "family_members_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KK (Family Card)"
  },
  {
    "id": "CDF-00420",
    "countryDocumentId": "74cab49a901703107f446fc9fda90284",
    "fieldName": "relationships",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KK (Family Card)"
  },
  {
    "id": "CDF-00421",
    "countryDocumentId": "74cab49a901703107f446fc9fda90284",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for KK (Family Card)"
  },
  {
    "id": "CDF-00422",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00423",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00424",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00425",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00426",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00427",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00428",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00429",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00430",
    "countryDocumentId": "779a709a901703107f446fc9fda90260",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00431",
    "countryDocumentId": "78cab49a901703107f446fc9fda90287",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NPWP (Tax ID)"
  },
  {
    "id": "CDF-00432",
    "countryDocumentId": "78cab49a901703107f446fc9fda90287",
    "fieldName": "npwp_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NPWP (Tax ID)"
  },
  {
    "id": "CDF-00433",
    "countryDocumentId": "78cab49a901703107f446fc9fda90287",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NPWP (Tax ID)"
  },
  {
    "id": "CDF-00434",
    "countryDocumentId": "78cab49a901703107f446fc9fda90287",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for NPWP (Tax ID)"
  },
  {
    "id": "CDF-00435",
    "countryDocumentId": "79aab09a901703107f446fc9fda9029a",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Relation Certificate"
  },
  {
    "id": "CDF-00436",
    "countryDocumentId": "79aab09a901703107f446fc9fda9029a",
    "fieldName": "family_members_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Relation Certificate"
  },
  {
    "id": "CDF-00437",
    "countryDocumentId": "79aab09a901703107f446fc9fda9029a",
    "fieldName": "relationships",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Relation Certificate"
  },
  {
    "id": "CDF-00438",
    "countryDocumentId": "79aab09a901703107f446fc9fda9029a",
    "fieldName": "household_address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Relation Certificate"
  },
  {
    "id": "CDF-00439",
    "countryDocumentId": "79aab09a901703107f446fc9fda9029a",
    "fieldName": "registration_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Family Relation Certificate"
  },
  {
    "id": "CDF-00440",
    "countryDocumentId": "7baa349a901703107f446fc9fda90200",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Fç©´dselsattest (Birth Certificate)"
  },
  {
    "id": "CDF-00441",
    "countryDocumentId": "7baa349a901703107f446fc9fda90200",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Fç©´dselsattest (Birth Certificate)"
  },
  {
    "id": "CDF-00442",
    "countryDocumentId": "7baa349a901703107f446fc9fda90200",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Fç©´dselsattest (Birth Certificate)"
  },
  {
    "id": "CDF-00443",
    "countryDocumentId": "7baa349a901703107f446fc9fda90200",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Fç©´dselsattest (Birth Certificate)"
  },
  {
    "id": "CDF-00444",
    "countryDocumentId": "7baa349a901703107f446fc9fda90200",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Fç©´dselsattest (Birth Certificate)"
  },
  {
    "id": "CDF-00445",
    "countryDocumentId": "7baa349a901703107f446fc9fda90200",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Fç©´dselsattest (Birth Certificate)"
  },
  {
    "id": "CDF-00446",
    "countryDocumentId": "7baa349a901703107f446fc9fda90200",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Fç©´dselsattest (Birth Certificate)"
  },
  {
    "id": "CDF-00447",
    "countryDocumentId": "7ccab49a901703107f446fc9fda9028a",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyKad"
  },
  {
    "id": "CDF-00448",
    "countryDocumentId": "7ccab49a901703107f446fc9fda9028a",
    "fieldName": "nric_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyKad"
  },
  {
    "id": "CDF-00449",
    "countryDocumentId": "7ccab49a901703107f446fc9fda9028a",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for MyKad"
  },
  {
    "id": "CDF-00450",
    "countryDocumentId": "7ccab49a901703107f446fc9fda9028a",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyKad"
  },
  {
    "id": "CDF-00451",
    "countryDocumentId": "7ccab49a901703107f446fc9fda9028a",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyKad"
  },
  {
    "id": "CDF-00452",
    "countryDocumentId": "7ccab49a901703107f446fc9fda9028a",
    "fieldName": "religion",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyKad"
  },
  {
    "id": "CDF-00453",
    "countryDocumentId": "7ccab49a901703107f446fc9fda9028a",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for MyKad"
  },
  {
    "id": "CDF-00454",
    "countryDocumentId": "7ccab49a901703107f446fc9fda9028a",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for MyKad"
  },
  {
    "id": "CDF-00455",
    "countryDocumentId": "7dba749a901703107f446fc9fda90218",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Absher Digital ID"
  },
  {
    "id": "CDF-00456",
    "countryDocumentId": "7dba749a901703107f446fc9fda90218",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Absher Digital ID"
  },
  {
    "id": "CDF-00457",
    "countryDocumentId": "7dba749a901703107f446fc9fda90218",
    "fieldName": "mobile_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Absher Digital ID"
  },
  {
    "id": "CDF-00458",
    "countryDocumentId": "7dba749a901703107f446fc9fda90218",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Absher Digital ID"
  },
  {
    "id": "CDF-00459",
    "countryDocumentId": "7faa349a901703107f446fc9fda90203",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00460",
    "countryDocumentId": "7faa349a901703107f446fc9fda90203",
    "fieldName": "personal_identity_code",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00461",
    "countryDocumentId": "7faa349a901703107f446fc9fda90203",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00462",
    "countryDocumentId": "7faa349a901703107f446fc9fda90203",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00463",
    "countryDocumentId": "7faa349a901703107f446fc9fda90203",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00464",
    "countryDocumentId": "7faa349a901703107f446fc9fda90203",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00465",
    "countryDocumentId": "7faa349a901703107f446fc9fda90203",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00466",
    "countryDocumentId": "7faa349a901703107f446fc9fda90203",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00467",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00468",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00469",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00470",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00471",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00472",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00473",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00474",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00475",
    "countryDocumentId": "80aa709a901703107f446fc9fda902bb",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00476",
    "countryDocumentId": "80ba349a901703107f446fc9fda90236",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Population Register Extract"
  },
  {
    "id": "CDF-00477",
    "countryDocumentId": "80ba349a901703107f446fc9fda90236",
    "fieldName": "personal_identity_code",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Population Register Extract"
  },
  {
    "id": "CDF-00478",
    "countryDocumentId": "80ba349a901703107f446fc9fda90236",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Population Register Extract"
  },
  {
    "id": "CDF-00479",
    "countryDocumentId": "80ba349a901703107f446fc9fda90236",
    "fieldName": "marital_status",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Population Register Extract"
  },
  {
    "id": "CDF-00480",
    "countryDocumentId": "80ba349a901703107f446fc9fda90236",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Population Register Extract"
  },
  {
    "id": "CDF-00481",
    "countryDocumentId": "82aab09a901703107f446fc9fda902d0",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Codice Fiscale"
  },
  {
    "id": "CDF-00482",
    "countryDocumentId": "82aab09a901703107f446fc9fda902d0",
    "fieldName": "codice_fiscale",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Codice Fiscale"
  },
  {
    "id": "CDF-00483",
    "countryDocumentId": "82aab09a901703107f446fc9fda902d0",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Codice Fiscale"
  },
  {
    "id": "CDF-00484",
    "countryDocumentId": "82aab09a901703107f446fc9fda902d0",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Codice Fiscale"
  },
  {
    "id": "CDF-00485",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00486",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00487",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00488",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00489",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "father_husband_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00490",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "blood_group",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00491",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00492",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00493",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "vehicle_classes",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00494",
    "countryDocumentId": "83ca389a901703107f446fc9fda902e6",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00495",
    "countryDocumentId": "84da789a901703107f446fc9fda90278",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00496",
    "countryDocumentId": "84da789a901703107f446fc9fda90278",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00497",
    "countryDocumentId": "84da789a901703107f446fc9fda90278",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00498",
    "countryDocumentId": "84da789a901703107f446fc9fda90278",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00499",
    "countryDocumentId": "84da789a901703107f446fc9fda90278",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00500",
    "countryDocumentId": "84da789a901703107f446fc9fda90278",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00501",
    "countryDocumentId": "84da789a901703107f446fc9fda90278",
    "fieldName": "vehicle_classes",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00502",
    "countryDocumentId": "84da789a901703107f446fc9fda90278",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00503",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "full_name_kanji",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00504",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "full_name_romaji",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00505",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00506",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00507",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00508",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00509",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00510",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00511",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00512",
    "countryDocumentId": "85aab09a901703107f446fc9fda9024b",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00513",
    "countryDocumentId": "86aab09a901703107f446fc9fda902d3",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00514",
    "countryDocumentId": "86aab09a901703107f446fc9fda902d3",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00515",
    "countryDocumentId": "86aab09a901703107f446fc9fda902d3",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00516",
    "countryDocumentId": "86aab09a901703107f446fc9fda902d3",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00517",
    "countryDocumentId": "86aab09a901703107f446fc9fda902d3",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00518",
    "countryDocumentId": "86aab09a901703107f446fc9fda902d3",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00519",
    "countryDocumentId": "86aab09a901703107f446fc9fda902d3",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00520",
    "countryDocumentId": "86ca389a901703107f446fc9fda90238",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Social Security Card"
  },
  {
    "id": "CDF-00521",
    "countryDocumentId": "86ca389a901703107f446fc9fda90238",
    "fieldName": "social_security_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Social Security Card"
  },
  {
    "id": "CDF-00522",
    "countryDocumentId": "86ca389a901703107f446fc9fda90238",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Social Security Card"
  },
  {
    "id": "CDF-00523",
    "countryDocumentId": "86ca389a901703107f446fc9fda90238",
    "fieldName": "employer",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Social Security Card"
  },
  {
    "id": "CDF-00524",
    "countryDocumentId": "86ca389a901703107f446fc9fda90238",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Social Security Card"
  },
  {
    "id": "CDF-00525",
    "countryDocumentId": "87ca389a901703107f446fc9fda902dc",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for PAN Card"
  },
  {
    "id": "CDF-00526",
    "countryDocumentId": "87ca389a901703107f446fc9fda902dc",
    "fieldName": "pan_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for PAN Card"
  },
  {
    "id": "CDF-00527",
    "countryDocumentId": "87ca389a901703107f446fc9fda902dc",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for PAN Card"
  },
  {
    "id": "CDF-00528",
    "countryDocumentId": "87ca389a901703107f446fc9fda902dc",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for PAN Card"
  },
  {
    "id": "CDF-00529",
    "countryDocumentId": "87ca389a901703107f446fc9fda902dc",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for PAN Card"
  },
  {
    "id": "CDF-00530",
    "countryDocumentId": "88aa709a901703107f446fc9fda902b4",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00531",
    "countryDocumentId": "88aa709a901703107f446fc9fda902b4",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00532",
    "countryDocumentId": "88aa709a901703107f446fc9fda902b4",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00533",
    "countryDocumentId": "88aa709a901703107f446fc9fda902b4",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00534",
    "countryDocumentId": "88aa709a901703107f446fc9fda902b4",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00535",
    "countryDocumentId": "88aa709a901703107f446fc9fda902b4",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00536",
    "countryDocumentId": "88aa709a901703107f446fc9fda902b4",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00537",
    "countryDocumentId": "88ba349a901703107f446fc9fda9022f",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00538",
    "countryDocumentId": "88ba349a901703107f446fc9fda9022f",
    "fieldName": "personal_identity_code",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00539",
    "countryDocumentId": "88ba349a901703107f446fc9fda9022f",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00540",
    "countryDocumentId": "88ba349a901703107f446fc9fda9022f",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00541",
    "countryDocumentId": "88ba349a901703107f446fc9fda9022f",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00542",
    "countryDocumentId": "88ba349a901703107f446fc9fda9022f",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00543",
    "countryDocumentId": "88ba349a901703107f446fc9fda9022f",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00544",
    "countryDocumentId": "88ba349a901703107f446fc9fda9022f",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00545",
    "countryDocumentId": "89aab09a901703107f446fc9fda9024e",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for My Number Card"
  },
  {
    "id": "CDF-00546",
    "countryDocumentId": "89aab09a901703107f446fc9fda9024e",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for My Number Card"
  },
  {
    "id": "CDF-00547",
    "countryDocumentId": "89aab09a901703107f446fc9fda9024e",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for My Number Card"
  },
  {
    "id": "CDF-00548",
    "countryDocumentId": "89aab09a901703107f446fc9fda9024e",
    "fieldName": "my_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for My Number Card"
  },
  {
    "id": "CDF-00549",
    "countryDocumentId": "89aab09a901703107f446fc9fda9024e",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for My Number Card"
  },
  {
    "id": "CDF-00550",
    "countryDocumentId": "89aab09a901703107f446fc9fda9024e",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for My Number Card"
  },
  {
    "id": "CDF-00551",
    "countryDocumentId": "89aab09a901703107f446fc9fda9024e",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for My Number Card"
  },
  {
    "id": "CDF-00552",
    "countryDocumentId": "89aab09a901703107f446fc9fda9024e",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for My Number Card"
  },
  {
    "id": "CDF-00553",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00554",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00555",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00556",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00557",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00558",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00559",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00560",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00561",
    "countryDocumentId": "8aaab09a901703107f446fc9fda902c9",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00562",
    "countryDocumentId": "8aca389a901703107f446fc9fda9023b",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00563",
    "countryDocumentId": "8aca389a901703107f446fc9fda9023b",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00564",
    "countryDocumentId": "8aca389a901703107f446fc9fda9023b",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00565",
    "countryDocumentId": "8aca389a901703107f446fc9fda9023b",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00566",
    "countryDocumentId": "8aca389a901703107f446fc9fda9023b",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00567",
    "countryDocumentId": "8aca389a901703107f446fc9fda9023b",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00568",
    "countryDocumentId": "8aca389a901703107f446fc9fda9023b",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00569",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00570",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00571",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00572",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00573",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00574",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "father_mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00575",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "spouse_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00576",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00577",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00578",
    "countryDocumentId": "8bca389a901703107f446fc9fda902df",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00579",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00580",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00581",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00582",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00583",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00584",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00585",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00586",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00587",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00588",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "height",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00589",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "eye_color",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00590",
    "countryDocumentId": "8caa709a901703107f446fc9fda902b7",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Personalausweis (National ID)"
  },
  {
    "id": "CDF-00591",
    "countryDocumentId": "8cba349a901703107f446fc9fda90232",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kela Card (Social Security)"
  },
  {
    "id": "CDF-00592",
    "countryDocumentId": "8cba349a901703107f446fc9fda90232",
    "fieldName": "personal_identity_code",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Kela Card (Social Security)"
  },
  {
    "id": "CDF-00593",
    "countryDocumentId": "8cba349a901703107f446fc9fda90232",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Kela Card (Social Security)"
  },
  {
    "id": "CDF-00594",
    "countryDocumentId": "8eaab09a901703107f446fc9fda902cc",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Permesso di Soggiorno"
  },
  {
    "id": "CDF-00595",
    "countryDocumentId": "8eaab09a901703107f446fc9fda902cc",
    "fieldName": "permit_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Permesso di Soggiorno"
  },
  {
    "id": "CDF-00596",
    "countryDocumentId": "8eaab09a901703107f446fc9fda902cc",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Permesso di Soggiorno"
  },
  {
    "id": "CDF-00597",
    "countryDocumentId": "8eaab09a901703107f446fc9fda902cc",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Permesso di Soggiorno"
  },
  {
    "id": "CDF-00598",
    "countryDocumentId": "8eaab09a901703107f446fc9fda902cc",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Permesso di Soggiorno"
  },
  {
    "id": "CDF-00599",
    "countryDocumentId": "8eaab09a901703107f446fc9fda902cc",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Permesso di Soggiorno"
  },
  {
    "id": "CDF-00600",
    "countryDocumentId": "8eaab09a901703107f446fc9fda902cc",
    "fieldName": "permit_type",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Permesso di Soggiorno"
  },
  {
    "id": "CDF-00601",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00602",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00603",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00604",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00605",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00606",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00607",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00608",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00609",
    "countryDocumentId": "8eca389a901703107f446fc9fda9023e",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00610",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00611",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00612",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00613",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00614",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "dni_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00615",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00616",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00617",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00618",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00619",
    "countryDocumentId": "8f9a709a901703107f446fc9fda90220",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for DNI (National ID)"
  },
  {
    "id": "CDF-00620",
    "countryDocumentId": "8fca389a901703107f446fc9fda902e2",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Voter ID (EPIC)"
  },
  {
    "id": "CDF-00621",
    "countryDocumentId": "8fca389a901703107f446fc9fda902e2",
    "fieldName": "epic_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Voter ID (EPIC)"
  },
  {
    "id": "CDF-00622",
    "countryDocumentId": "8fca389a901703107f446fc9fda902e2",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Voter ID (EPIC)"
  },
  {
    "id": "CDF-00623",
    "countryDocumentId": "8fca389a901703107f446fc9fda902e2",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Voter ID (EPIC)"
  },
  {
    "id": "CDF-00624",
    "countryDocumentId": "8fca389a901703107f446fc9fda902e2",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Voter ID (EPIC)"
  },
  {
    "id": "CDF-00625",
    "countryDocumentId": "8fca389a901703107f446fc9fda902e2",
    "fieldName": "father_husband_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Voter ID (EPIC)"
  },
  {
    "id": "CDF-00626",
    "countryDocumentId": "8fca389a901703107f446fc9fda902e2",
    "fieldName": "polling_station",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Voter ID (EPIC)"
  },
  {
    "id": "CDF-00627",
    "countryDocumentId": "8fca389a901703107f446fc9fda902e2",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Voter ID (EPIC)"
  },
  {
    "id": "CDF-00628",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00629",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00630",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00631",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00632",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00633",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00634",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00635",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00636",
    "countryDocumentId": "90aa709a901703107f446fc9fda902f0",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00637",
    "countryDocumentId": "92aaf09a901703107f446fc9fda90234",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00638",
    "countryDocumentId": "92aaf09a901703107f446fc9fda90234",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00639",
    "countryDocumentId": "92aaf09a901703107f446fc9fda90234",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00640",
    "countryDocumentId": "92aaf09a901703107f446fc9fda90234",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00641",
    "countryDocumentId": "92aaf09a901703107f446fc9fda90234",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00642",
    "countryDocumentId": "92aaf09a901703107f446fc9fda90234",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00643",
    "countryDocumentId": "92aaf09a901703107f446fc9fda90234",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00644",
    "countryDocumentId": "92aaf09a901703107f446fc9fda90234",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00645",
    "countryDocumentId": "94aa709a901703107f446fc9fda902f3",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aufenthaltstitel (Residence Permit)"
  },
  {
    "id": "CDF-00646",
    "countryDocumentId": "94aa709a901703107f446fc9fda902f3",
    "fieldName": "permit_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aufenthaltstitel (Residence Permit)"
  },
  {
    "id": "CDF-00647",
    "countryDocumentId": "94aa709a901703107f446fc9fda902f3",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aufenthaltstitel (Residence Permit)"
  },
  {
    "id": "CDF-00648",
    "countryDocumentId": "94aa709a901703107f446fc9fda902f3",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Aufenthaltstitel (Residence Permit)"
  },
  {
    "id": "CDF-00649",
    "countryDocumentId": "94aa709a901703107f446fc9fda902f3",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Aufenthaltstitel (Residence Permit)"
  },
  {
    "id": "CDF-00650",
    "countryDocumentId": "94aa709a901703107f446fc9fda902f3",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aufenthaltstitel (Residence Permit)"
  },
  {
    "id": "CDF-00651",
    "countryDocumentId": "94aa709a901703107f446fc9fda902f3",
    "fieldName": "permit_type",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aufenthaltstitel (Residence Permit)"
  },
  {
    "id": "CDF-00652",
    "countryDocumentId": "97ca389a901703107f446fc9fda902e9",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Ration Card"
  },
  {
    "id": "CDF-00653",
    "countryDocumentId": "97ca389a901703107f446fc9fda902e9",
    "fieldName": "ration_card_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Ration Card"
  },
  {
    "id": "CDF-00654",
    "countryDocumentId": "97ca389a901703107f446fc9fda902e9",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Ration Card"
  },
  {
    "id": "CDF-00655",
    "countryDocumentId": "97ca389a901703107f446fc9fda902e9",
    "fieldName": "family_members_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Ration Card"
  },
  {
    "id": "CDF-00656",
    "countryDocumentId": "97ca389a901703107f446fc9fda902e9",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Ration Card"
  },
  {
    "id": "CDF-00657",
    "countryDocumentId": "97ca389a901703107f446fc9fda902e9",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Ration Card"
  },
  {
    "id": "CDF-00658",
    "countryDocumentId": "97ca389a901703107f446fc9fda902e9",
    "fieldName": "card_type",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Ration Card"
  },
  {
    "id": "CDF-00659",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00660",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00661",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00662",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00663",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "father_husband_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00664",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00665",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00666",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "vehicle_classes",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00667",
    "countryDocumentId": "97ca789a901703107f446fc9fda90215",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00668",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00669",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00670",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00671",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00672",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00673",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00674",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00675",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00676",
    "countryDocumentId": "9aaab09a901703107f446fc9fda902d6",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00677",
    "countryDocumentId": "9b9a709a901703107f446fc9fda90243",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NIE (Foreigner ID)"
  },
  {
    "id": "CDF-00678",
    "countryDocumentId": "9b9a709a901703107f446fc9fda90243",
    "fieldName": "nie_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NIE (Foreigner ID)"
  },
  {
    "id": "CDF-00679",
    "countryDocumentId": "9b9a709a901703107f446fc9fda90243",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NIE (Foreigner ID)"
  },
  {
    "id": "CDF-00680",
    "countryDocumentId": "9b9a709a901703107f446fc9fda90243",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for NIE (Foreigner ID)"
  },
  {
    "id": "CDF-00681",
    "countryDocumentId": "9b9a709a901703107f446fc9fda90243",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for NIE (Foreigner ID)"
  },
  {
    "id": "CDF-00682",
    "countryDocumentId": "9b9a709a901703107f446fc9fda90243",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NIE (Foreigner ID)"
  },
  {
    "id": "CDF-00683",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00684",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00685",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00686",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00687",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00688",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "father_mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00689",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00690",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00691",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00692",
    "countryDocumentId": "9bca389a901703107f446fc9fda902ec",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00693",
    "countryDocumentId": "a0ba349a901703107f446fc9fda90278",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00694",
    "countryDocumentId": "a0ba349a901703107f446fc9fda90278",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00695",
    "countryDocumentId": "a0ba349a901703107f446fc9fda90278",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00696",
    "countryDocumentId": "a0ba349a901703107f446fc9fda90278",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00697",
    "countryDocumentId": "a0ba349a901703107f446fc9fda90278",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00698",
    "countryDocumentId": "a0ba349a901703107f446fc9fda90278",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00699",
    "countryDocumentId": "a0ba349a901703107f446fc9fda90278",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00700",
    "countryDocumentId": "a39a709a901703107f446fc9fda9024a",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Social Security Card"
  },
  {
    "id": "CDF-00701",
    "countryDocumentId": "a39a709a901703107f446fc9fda9024a",
    "fieldName": "social_security_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Social Security Card"
  },
  {
    "id": "CDF-00702",
    "countryDocumentId": "a39a709a901703107f446fc9fda9024a",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Social Security Card"
  },
  {
    "id": "CDF-00703",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00704",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00705",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00706",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00707",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00708",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00709",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00710",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00711",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00712",
    "countryDocumentId": "a3ca789a901703107f446fc9fda9021c",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00713",
    "countryDocumentId": "a4aab09a901703107f446fc9fda90222",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CPF"
  },
  {
    "id": "CDF-00714",
    "countryDocumentId": "a4aab09a901703107f446fc9fda90222",
    "fieldName": "cpf_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CPF"
  },
  {
    "id": "CDF-00715",
    "countryDocumentId": "a4aab09a901703107f446fc9fda90222",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for CPF"
  },
  {
    "id": "CDF-00716",
    "countryDocumentId": "a4aab09a901703107f446fc9fda90222",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CPF"
  },
  {
    "id": "CDF-00717",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00718",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00719",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00720",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00721",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00722",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "passport_series",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00723",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00724",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00725",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "issuing_authority",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00726",
    "countryDocumentId": "a4ba349a901703107f446fc9fda9027b",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Internal Passport"
  },
  {
    "id": "CDF-00727",
    "countryDocumentId": "a6aaf09a901703107f446fc9fda90237",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00728",
    "countryDocumentId": "a6aaf09a901703107f446fc9fda90237",
    "fieldName": "permit_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00729",
    "countryDocumentId": "a6aaf09a901703107f446fc9fda90237",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00730",
    "countryDocumentId": "a6aaf09a901703107f446fc9fda90237",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00731",
    "countryDocumentId": "a6aaf09a901703107f446fc9fda90237",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00732",
    "countryDocumentId": "a6aaf09a901703107f446fc9fda90237",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00733",
    "countryDocumentId": "a6aaf09a901703107f446fc9fda90237",
    "fieldName": "permit_type",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Permit"
  },
  {
    "id": "CDF-00734",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00735",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00736",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00737",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00738",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00739",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00740",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00741",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00742",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00743",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "height",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00744",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "eye_color",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00745",
    "countryDocumentId": "a79a709a901703107f446fc9fda9024d",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Carte Nationale d'Identité·¼CNI)"
  },
  {
    "id": "CDF-00746",
    "countryDocumentId": "a8aa709a901703107f446fc9fda902f6",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Meldebescheinigung (Address Proof)"
  },
  {
    "id": "CDF-00747",
    "countryDocumentId": "a8aa709a901703107f446fc9fda902f6",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Meldebescheinigung (Address Proof)"
  },
  {
    "id": "CDF-00748",
    "countryDocumentId": "a8aa709a901703107f446fc9fda902f6",
    "fieldName": "registration_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Meldebescheinigung (Address Proof)"
  },
  {
    "id": "CDF-00749",
    "countryDocumentId": "a8aa709a901703107f446fc9fda902f6",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Meldebescheinigung (Address Proof)"
  },
  {
    "id": "CDF-00750",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00751",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00752",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00753",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00754",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00755",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00756",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00757",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00758",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00759",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00760",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "cpf",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00761",
    "countryDocumentId": "a8aab09a901703107f446fc9fda90225",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for CNH (Driver's License)"
  },
  {
    "id": "CDF-00762",
    "countryDocumentId": "aaaaf09a901703107f446fc9fda9023a",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for BSN (Social Security)"
  },
  {
    "id": "CDF-00763",
    "countryDocumentId": "aaaaf09a901703107f446fc9fda9023a",
    "fieldName": "bsn_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for BSN (Social Security)"
  },
  {
    "id": "CDF-00764",
    "countryDocumentId": "aaaaf09a901703107f446fc9fda9023a",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for BSN (Social Security)"
  },
  {
    "id": "CDF-00765",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00766",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00767",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00768",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00769",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00770",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "rg_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00771",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00772",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "issuing_state",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00773",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00774",
    "countryDocumentId": "acaa709a901703107f446fc9fda902f9",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for RG (Identity Card)"
  },
  {
    "id": "CDF-00775",
    "countryDocumentId": "aeaaf09a901703107f446fc9fda9023d",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00776",
    "countryDocumentId": "aeaaf09a901703107f446fc9fda9023d",
    "fieldName": "personal_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00777",
    "countryDocumentId": "aeaaf09a901703107f446fc9fda9023d",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00778",
    "countryDocumentId": "aeaaf09a901703107f446fc9fda9023d",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00779",
    "countryDocumentId": "aeaaf09a901703107f446fc9fda9023d",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00780",
    "countryDocumentId": "aeaaf09a901703107f446fc9fda9023d",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00781",
    "countryDocumentId": "aeaaf09a901703107f446fc9fda9023d",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00782",
    "countryDocumentId": "aeaaf09a901703107f446fc9fda9023d",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-00783",
    "countryDocumentId": "af9a709a901703107f446fc9fda90246",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00784",
    "countryDocumentId": "af9a709a901703107f446fc9fda90246",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00785",
    "countryDocumentId": "af9a709a901703107f446fc9fda90246",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00786",
    "countryDocumentId": "af9a709a901703107f446fc9fda90246",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00787",
    "countryDocumentId": "af9a709a901703107f446fc9fda90246",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00788",
    "countryDocumentId": "af9a709a901703107f446fc9fda90246",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00789",
    "countryDocumentId": "af9a709a901703107f446fc9fda90246",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-00790",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00791",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00792",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00793",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00794",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00795",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00796",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00797",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00798",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00799",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "height",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00800",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "eye_color",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00801",
    "countryDocumentId": "b1aab09a901703107f446fc9fda902c3",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Carta d'Identità¬°"
  },
  {
    "id": "CDF-00802",
    "countryDocumentId": "b1ca389a901703107f446fc9fda90235",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Hukou (Household Register)"
  },
  {
    "id": "CDF-00803",
    "countryDocumentId": "b1ca389a901703107f446fc9fda90235",
    "fieldName": "hukou_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Hukou (Household Register)"
  },
  {
    "id": "CDF-00804",
    "countryDocumentId": "b1ca389a901703107f446fc9fda90235",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Hukou (Household Register)"
  },
  {
    "id": "CDF-00805",
    "countryDocumentId": "b1ca389a901703107f446fc9fda90235",
    "fieldName": "family_members_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Hukou (Household Register)"
  },
  {
    "id": "CDF-00806",
    "countryDocumentId": "b1ca389a901703107f446fc9fda90235",
    "fieldName": "relationships",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Hukou (Household Register)"
  },
  {
    "id": "CDF-00807",
    "countryDocumentId": "b1ca389a901703107f446fc9fda90235",
    "fieldName": "registration_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Hukou (Household Register)"
  },
  {
    "id": "CDF-00808",
    "countryDocumentId": "b29a309a901703107f446fc9fda902fd",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for State ID"
  },
  {
    "id": "CDF-00809",
    "countryDocumentId": "b29a309a901703107f446fc9fda902fd",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for State ID"
  },
  {
    "id": "CDF-00810",
    "countryDocumentId": "b29a309a901703107f446fc9fda902fd",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for State ID"
  },
  {
    "id": "CDF-00811",
    "countryDocumentId": "b29a309a901703107f446fc9fda902fd",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for State ID"
  },
  {
    "id": "CDF-00812",
    "countryDocumentId": "b29a309a901703107f446fc9fda902fd",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for State ID"
  },
  {
    "id": "CDF-00813",
    "countryDocumentId": "b29a309a901703107f446fc9fda902fd",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for State ID"
  },
  {
    "id": "CDF-00814",
    "countryDocumentId": "b29a309a901703107f446fc9fda902fd",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for State ID"
  },
  {
    "id": "CDF-00815",
    "countryDocumentId": "b29a309a901703107f446fc9fda902fd",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for State ID"
  },
  {
    "id": "CDF-00816",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00817",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "aadhaar_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00818",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00819",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00820",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00821",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "father_husband_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00822",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "mobile_masked",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00823",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "email_masked",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00824",
    "countryDocumentId": "b2ca389a901703107f446fc9fda902d9",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Aadhaar Card"
  },
  {
    "id": "CDF-00825",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00826",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00827",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00828",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00829",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00830",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00831",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00832",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00833",
    "countryDocumentId": "b5aab09a901703107f446fc9fda902c6",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00834",
    "countryDocumentId": "b79a709a901703107f446fc9fda902b1",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Vitale (Health)"
  },
  {
    "id": "CDF-00835",
    "countryDocumentId": "b79a709a901703107f446fc9fda902b1",
    "fieldName": "social_security_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Carte Vitale (Health)"
  },
  {
    "id": "CDF-00836",
    "countryDocumentId": "b79a709a901703107f446fc9fda902b1",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Carte Vitale (Health)"
  },
  {
    "id": "CDF-00837",
    "countryDocumentId": "b79a709a901703107f446fc9fda902b1",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Carte Vitale (Health)"
  },
  {
    "id": "CDF-00838",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00839",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00840",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00841",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00842",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00843",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00844",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00845",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00846",
    "countryDocumentId": "b7aa349a901703107f446fc9fda9022c",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00847",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00848",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00849",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00850",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00851",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00852",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00853",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00854",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00855",
    "countryDocumentId": "b8ba349a901703107f446fc9fda9027e",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for International Passport"
  },
  {
    "id": "CDF-00856",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00857",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00858",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00859",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00860",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00861",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00862",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00863",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00864",
    "countryDocumentId": "b9ca7896901703107f446fc9fda902e5",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00865",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00866",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00867",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00868",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00869",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00870",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00871",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00872",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00873",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00874",
    "countryDocumentId": "bbca789a901703107f446fc9fda90229",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00875",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00876",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00877",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00878",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00879",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00880",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00881",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00882",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00883",
    "countryDocumentId": "bcaab09a901703107f446fc9fda90228",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-00884",
    "countryDocumentId": "bcba349a901703107f446fc9fda90281",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00885",
    "countryDocumentId": "bcba349a901703107f446fc9fda90281",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00886",
    "countryDocumentId": "bcba349a901703107f446fc9fda90281",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00887",
    "countryDocumentId": "bcba349a901703107f446fc9fda90281",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00888",
    "countryDocumentId": "bcba349a901703107f446fc9fda90281",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00889",
    "countryDocumentId": "bcba349a901703107f446fc9fda90281",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00890",
    "countryDocumentId": "bcba349a901703107f446fc9fda90281",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00891",
    "countryDocumentId": "bcba349a901703107f446fc9fda90281",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-00892",
    "countryDocumentId": "bfca789a901703107f446fc9fda90222",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for B-Form (Birth Certificate)"
  },
  {
    "id": "CDF-00893",
    "countryDocumentId": "bfca789a901703107f446fc9fda90222",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for B-Form (Birth Certificate)"
  },
  {
    "id": "CDF-00894",
    "countryDocumentId": "bfca789a901703107f446fc9fda90222",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for B-Form (Birth Certificate)"
  },
  {
    "id": "CDF-00895",
    "countryDocumentId": "bfca789a901703107f446fc9fda90222",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for B-Form (Birth Certificate)"
  },
  {
    "id": "CDF-00896",
    "countryDocumentId": "bfca789a901703107f446fc9fda90222",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for B-Form (Birth Certificate)"
  },
  {
    "id": "CDF-00897",
    "countryDocumentId": "bfca789a901703107f446fc9fda90222",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for B-Form (Birth Certificate)"
  },
  {
    "id": "CDF-00898",
    "countryDocumentId": "bfca789a901703107f446fc9fda90222",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for B-Form (Birth Certificate)"
  },
  {
    "id": "CDF-00899",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "nid_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00900",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00901",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00902",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "grandfather_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00903",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00904",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00905",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "place_of_origin",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00906",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "current_residence",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00907",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "permanent_residence",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00908",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00909",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00910",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "religion",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00911",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "ethnicity",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00912",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "marital_status",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00913",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "profession",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00914",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "mother_tongue",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00915",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00916",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00917",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00918",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "signature",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00919",
    "countryDocumentId": "CDOC-AFG-01",
    "fieldName": "blood_group",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Electronic National Identity Card (e-Tazkira)"
  },
  {
    "id": "CDF-00920",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "nid_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00921",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00922",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00923",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "grandfather_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00924",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00925",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00926",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "current_residence",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00927",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "permanent_residence",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00928",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00929",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00930",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "religion",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00931",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "ethnicity",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00932",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "marital_status",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00933",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "profession",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00934",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "physical_description",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00935",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00936",
    "countryDocumentId": "CDOC-AFG-02",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Paper National Identity Card (Kaghazi Tazkira)"
  },
  {
    "id": "CDF-00937",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00938",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00939",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00940",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "grandfather_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00941",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00942",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00943",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00944",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00945",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00946",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00947",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "issuing_authority",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00948",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "place_of_issue",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00949",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00950",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "signature",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00951",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "mrz_line1",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00952",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "mrz_line2",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00953",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "blood_group",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00954",
    "countryDocumentId": "CDOC-AFG-03",
    "fieldName": "profession",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Standard Machine Readable Passport"
  },
  {
    "id": "CDF-00955",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00956",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "groom_full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00957",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "groom_father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00958",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "groom_date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00959",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "groom_place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00960",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "groom_nid_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00961",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "bride_full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00962",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "bride_father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00963",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "bride_date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00964",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "bride_place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00965",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "bride_nid_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00966",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "marriage_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00967",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "marriage_place",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00968",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "mahr_amount",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00969",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "witness1_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00970",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "witness2_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00971",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "officiant_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00972",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00973",
    "countryDocumentId": "CDOC-AFG-04",
    "fieldName": "issuing_authority",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Marriage Certificate (Nikah Nama)"
  },
  {
    "id": "CDF-00974",
    "countryDocumentId": "CDOC-BGD-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Smart National Identity Card (Smart NID)"
  },
  {
    "id": "CDF-00975",
    "countryDocumentId": "CDOC-BGD-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Smart National Identity Card (Smart NID)"
  },
  {
    "id": "CDF-00976",
    "countryDocumentId": "CDOC-BGD-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Smart National Identity Card (Smart NID)"
  },
  {
    "id": "CDF-00977",
    "countryDocumentId": "CDOC-BGD-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Smart National Identity Card (Smart NID)"
  },
  {
    "id": "CDF-00978",
    "countryDocumentId": "CDOC-BGD-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Smart National Identity Card (Smart NID)"
  },
  {
    "id": "CDF-00979",
    "countryDocumentId": "CDOC-BGD-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Online Birth Registration Certificate (BRC)"
  },
  {
    "id": "CDF-00980",
    "countryDocumentId": "CDOC-BGD-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Online Birth Registration Certificate (BRC)"
  },
  {
    "id": "CDF-00981",
    "countryDocumentId": "CDOC-BGD-02",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Online Birth Registration Certificate (BRC)"
  },
  {
    "id": "CDF-00982",
    "countryDocumentId": "CDOC-BGD-02",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Online Birth Registration Certificate (BRC)"
  },
  {
    "id": "CDF-00983",
    "countryDocumentId": "CDOC-BGD-02",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Online Birth Registration Certificate (BRC)"
  },
  {
    "id": "CDF-00984",
    "countryDocumentId": "CDOC-BGD-02",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Online Birth Registration Certificate (BRC)"
  },
  {
    "id": "CDF-00985",
    "countryDocumentId": "CDOC-PAK-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Computerized National Identity Card (CNIC / Smart NIC)"
  },
  {
    "id": "CDF-00986",
    "countryDocumentId": "CDOC-PAK-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Computerized National Identity Card (CNIC / Smart NIC)"
  },
  {
    "id": "CDF-00987",
    "countryDocumentId": "CDOC-PAK-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Computerized National Identity Card (CNIC / Smart NIC)"
  },
  {
    "id": "CDF-00988",
    "countryDocumentId": "CDOC-PAK-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Computerized National Identity Card (CNIC / Smart NIC)"
  },
  {
    "id": "CDF-00989",
    "countryDocumentId": "CDOC-PAK-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Computerized National Identity Card (CNIC / Smart NIC)"
  },
  {
    "id": "CDF-00990",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "frc_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00991",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "primary_person_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00992",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "primary_person_cnic",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00993",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "primary_person_dob",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00994",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "primary_person_gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00995",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "spouse_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00996",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "spouse_cnic",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00997",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "marriage_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00998",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "children_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-00999",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "children_dobs",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-01000",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-01001",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-01002",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-01003",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-01004",
    "countryDocumentId": "CDOC-PAK-02",
    "fieldName": "issuing_authority",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Registration Certificate (FRC)"
  },
  {
    "id": "CDF-01005",
    "countryDocumentId": "CDOC-SOM-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for UNHCR Proof of Registration (Refugee Card / Document)"
  },
  {
    "id": "CDF-01006",
    "countryDocumentId": "CDOC-SOM-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for UNHCR Proof of Registration (Refugee Card / Document)"
  },
  {
    "id": "CDF-01007",
    "countryDocumentId": "CDOC-SOM-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for UNHCR Proof of Registration (Refugee Card / Document)"
  },
  {
    "id": "CDF-01008",
    "countryDocumentId": "CDOC-SOM-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for UNHCR Proof of Registration (Refugee Card / Document)"
  },
  {
    "id": "CDF-01009",
    "countryDocumentId": "CDOC-SOM-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for UNHCR Proof of Registration (Refugee Card / Document)"
  },
  {
    "id": "CDF-01010",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "family_book_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01011",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "head_of_family_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01012",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "head_of_family_nid",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01013",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "spouse_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01014",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "spouse_nid",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01015",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "marriage_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01016",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "marriage_place",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01017",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "children",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01018",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "children_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01019",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "children_dobs",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01020",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "religion",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01021",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "registry_location",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01022",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01023",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "photo_head",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01024",
    "countryDocumentId": "CDOC-SYR-01",
    "fieldName": "photo_spouse",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Family Book (Daftar A'ila)"
  },
  {
    "id": "CDF-01025",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "nid_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01026",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01027",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01028",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "grandfather_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01029",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01030",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01031",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01032",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01033",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "religion",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01034",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01035",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "current_residence",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01036",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "profession",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01037",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "marital_status",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01038",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01039",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01040",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "issuing_authority",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01041",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01042",
    "countryDocumentId": "CDOC-SYR-02",
    "fieldName": "signature",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01043",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "extract_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01044",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01045",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01046",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "mother_full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01047",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01048",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01049",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01050",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "religion",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01051",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01052",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "civil_registry_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01053",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "marital_status",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01054",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "spouse_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01055",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "registration_location",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01056",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01057",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "issuing_authority",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01058",
    "countryDocumentId": "CDOC-SYR-03",
    "fieldName": "purpose",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Individual Civil Status Extract (Ikhraj Qayd)"
  },
  {
    "id": "CDF-01059",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "nid_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01060",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01061",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01062",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "grandfather_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01063",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01064",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01065",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01066",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01067",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "religion",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01068",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01069",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "current_residence",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01070",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "profession",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01071",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "marital_status",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01072",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01073",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01074",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "issuing_authority",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01075",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01076",
    "countryDocumentId": "CDOC-YEM-01",
    "fieldName": "signature",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National Identity Card (Bitāqat Shakhsiyya)"
  },
  {
    "id": "CDF-01077",
    "countryDocumentId": "d0cab49a901703107f446fc9fda9025b",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01078",
    "countryDocumentId": "d0cab49a901703107f446fc9fda9025b",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01079",
    "countryDocumentId": "d0cab49a901703107f446fc9fda9025b",
    "fieldName": "family_members_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01080",
    "countryDocumentId": "d0cab49a901703107f446fc9fda9025b",
    "fieldName": "relationships",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01081",
    "countryDocumentId": "d0cab49a901703107f446fc9fda9025b",
    "fieldName": "registration_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01082",
    "countryDocumentId": "d1aab09a901703107f446fc9fda9026e",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Card"
  },
  {
    "id": "CDF-01083",
    "countryDocumentId": "d1aab09a901703107f446fc9fda9026e",
    "fieldName": "residence_card_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Card"
  },
  {
    "id": "CDF-01084",
    "countryDocumentId": "d1aab09a901703107f446fc9fda9026e",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Card"
  },
  {
    "id": "CDF-01085",
    "countryDocumentId": "d1aab09a901703107f446fc9fda9026e",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Residence Card"
  },
  {
    "id": "CDF-01086",
    "countryDocumentId": "d1aab09a901703107f446fc9fda9026e",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Residence Card"
  },
  {
    "id": "CDF-01087",
    "countryDocumentId": "d1aab09a901703107f446fc9fda9026e",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Residence Card"
  },
  {
    "id": "CDF-01088",
    "countryDocumentId": "d1aab09a901703107f446fc9fda9026e",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Residence Card"
  },
  {
    "id": "CDF-01089",
    "countryDocumentId": "d1aab09a901703107f446fc9fda9026e",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Residence Card"
  },
  {
    "id": "CDF-01090",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01091",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01092",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01093",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01094",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01095",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01096",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01097",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01098",
    "countryDocumentId": "d1ba349a901703107f446fc9fda902c1",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National ID (Saudi)"
  },
  {
    "id": "CDF-01099",
    "countryDocumentId": "d1cab49a901703107f446fc9fda902df",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyPR (Permanent Resident)"
  },
  {
    "id": "CDF-01100",
    "countryDocumentId": "d1cab49a901703107f446fc9fda902df",
    "fieldName": "mypr_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyPR (Permanent Resident)"
  },
  {
    "id": "CDF-01101",
    "countryDocumentId": "d1cab49a901703107f446fc9fda902df",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyPR (Permanent Resident)"
  },
  {
    "id": "CDF-01102",
    "countryDocumentId": "d1cab49a901703107f446fc9fda902df",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for MyPR (Permanent Resident)"
  },
  {
    "id": "CDF-01103",
    "countryDocumentId": "d1cab49a901703107f446fc9fda902df",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for MyPR (Permanent Resident)"
  },
  {
    "id": "CDF-01104",
    "countryDocumentId": "d1cab49a901703107f446fc9fda902df",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for MyPR (Permanent Resident)"
  },
  {
    "id": "CDF-01105",
    "countryDocumentId": "d4cab49a901703107f446fc9fda9025e",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01106",
    "countryDocumentId": "d4cab49a901703107f446fc9fda9025e",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01107",
    "countryDocumentId": "d4cab49a901703107f446fc9fda9025e",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01108",
    "countryDocumentId": "d4cab49a901703107f446fc9fda9025e",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01109",
    "countryDocumentId": "d4cab49a901703107f446fc9fda9025e",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01110",
    "countryDocumentId": "d4cab49a901703107f446fc9fda9025e",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01111",
    "countryDocumentId": "d4cab49a901703107f446fc9fda9025e",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01112",
    "countryDocumentId": "d5aab09a901703107f446fc9fda90271",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-01113",
    "countryDocumentId": "d5aab09a901703107f446fc9fda90271",
    "fieldName": "insurance_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-01114",
    "countryDocumentId": "d5aab09a901703107f446fc9fda90271",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-01115",
    "countryDocumentId": "d5aab09a901703107f446fc9fda90271",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-01116",
    "countryDocumentId": "d5aab09a901703107f446fc9fda90271",
    "fieldName": "employer_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-01117",
    "countryDocumentId": "d5aab09a901703107f446fc9fda90271",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Health Insurance Card"
  },
  {
    "id": "CDF-01118",
    "countryDocumentId": "d6ca389a901703107f446fc9fda90267",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01119",
    "countryDocumentId": "d6ca389a901703107f446fc9fda90267",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01120",
    "countryDocumentId": "d6ca389a901703107f446fc9fda90267",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01121",
    "countryDocumentId": "d6ca389a901703107f446fc9fda90267",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01122",
    "countryDocumentId": "d6ca389a901703107f446fc9fda90267",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01123",
    "countryDocumentId": "d6ca389a901703107f446fc9fda90267",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01124",
    "countryDocumentId": "d6ca389a901703107f446fc9fda90267",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01125",
    "countryDocumentId": "d6ca389a901703107f446fc9fda90267",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01126",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902a2",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NemID (Digital ID)"
  },
  {
    "id": "CDF-01127",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902a2",
    "fieldName": "cpr_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for NemID (Digital ID)"
  },
  {
    "id": "CDF-01128",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902a2",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for NemID (Digital ID)"
  },
  {
    "id": "CDF-01129",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902d7",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01130",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902d7",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01131",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902d7",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01132",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902d7",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01133",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902d7",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01134",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902d7",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01135",
    "countryDocumentId": "d7aaf09a901703107f446fc9fda902d7",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01136",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01137",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "nik",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01138",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01139",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01140",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01141",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "religion",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01142",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "marital_status",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01143",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "occupation",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01144",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01145",
    "countryDocumentId": "d8cab49a901703107f446fc9fda90261",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for KTP (National ID)"
  },
  {
    "id": "CDF-01146",
    "countryDocumentId": "d9aab09a901703107f446fc9fda90274",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Registration Card"
  },
  {
    "id": "CDF-01147",
    "countryDocumentId": "d9aab09a901703107f446fc9fda90274",
    "fieldName": "rrn",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Registration Card"
  },
  {
    "id": "CDF-01148",
    "countryDocumentId": "d9aab09a901703107f446fc9fda90274",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Resident Registration Card"
  },
  {
    "id": "CDF-01149",
    "countryDocumentId": "d9aab09a901703107f446fc9fda90274",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Registration Card"
  },
  {
    "id": "CDF-01150",
    "countryDocumentId": "d9aab09a901703107f446fc9fda90274",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Registration Card"
  },
  {
    "id": "CDF-01151",
    "countryDocumentId": "d9aab09a901703107f446fc9fda90274",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Resident Registration Card"
  },
  {
    "id": "CDF-01152",
    "countryDocumentId": "d9aab09a901703107f446fc9fda90274",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Resident Registration Card"
  },
  {
    "id": "CDF-01153",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01154",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01155",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01156",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01157",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01158",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01159",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01160",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01161",
    "countryDocumentId": "d9cab49a901703107f446fc9fda902d8",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01162",
    "countryDocumentId": "daca389a901703107f446fc9fda9026a",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01163",
    "countryDocumentId": "daca389a901703107f446fc9fda9026a",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01164",
    "countryDocumentId": "daca389a901703107f446fc9fda9026a",
    "fieldName": "family_members_names",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01165",
    "countryDocumentId": "daca389a901703107f446fc9fda9026a",
    "fieldName": "relationships",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01166",
    "countryDocumentId": "daca389a901703107f446fc9fda9026a",
    "fieldName": "registration_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Household Register"
  },
  {
    "id": "CDF-01167",
    "countryDocumentId": "ddcab49a901703107f446fc9fda902db",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01168",
    "countryDocumentId": "ddcab49a901703107f446fc9fda902db",
    "fieldName": "nric_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01169",
    "countryDocumentId": "ddcab49a901703107f446fc9fda902db",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01170",
    "countryDocumentId": "ddcab49a901703107f446fc9fda902db",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01171",
    "countryDocumentId": "ddcab49a901703107f446fc9fda902db",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01172",
    "countryDocumentId": "ddcab49a901703107f446fc9fda902db",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01173",
    "countryDocumentId": "ddcab49a901703107f446fc9fda902db",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01174",
    "countryDocumentId": "ddcab49a901703107f446fc9fda902db",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01175",
    "countryDocumentId": "deca389a901703107f446fc9fda9026d",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01176",
    "countryDocumentId": "deca389a901703107f446fc9fda9026d",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01177",
    "countryDocumentId": "deca389a901703107f446fc9fda9026d",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01178",
    "countryDocumentId": "deca389a901703107f446fc9fda9026d",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01179",
    "countryDocumentId": "deca389a901703107f446fc9fda9026d",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01180",
    "countryDocumentId": "deca389a901703107f446fc9fda9026d",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01181",
    "countryDocumentId": "deca389a901703107f446fc9fda9026d",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01182",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01183",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01184",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01185",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01186",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01187",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01188",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01189",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01190",
    "countryDocumentId": "e2ca389a901703107f446fc9fda90271",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Internal Passport (ID Card)"
  },
  {
    "id": "CDF-01191",
    "countryDocumentId": "e2ca389a901703107f446fc9fda902b6",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01192",
    "countryDocumentId": "e2ca389a901703107f446fc9fda902b6",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01193",
    "countryDocumentId": "e2ca389a901703107f446fc9fda902b6",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01194",
    "countryDocumentId": "e2ca389a901703107f446fc9fda902b6",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01195",
    "countryDocumentId": "e2ca389a901703107f446fc9fda902b6",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01196",
    "countryDocumentId": "e2ca389a901703107f446fc9fda902b6",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01197",
    "countryDocumentId": "e2ca389a901703107f446fc9fda902b6",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01198",
    "countryDocumentId": "e2ca389a901703107f446fc9fda902b6",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01199",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01200",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "iqama_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01201",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01202",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01203",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01204",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01205",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01206",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01207",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "sponsor_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01208",
    "countryDocumentId": "e5ba349a901703107f446fc9fda902c4",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Iqama (Resident ID)"
  },
  {
    "id": "CDF-01209",
    "countryDocumentId": "e5cab49a901703107f446fc9fda902e2",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01210",
    "countryDocumentId": "e5cab49a901703107f446fc9fda902e2",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01211",
    "countryDocumentId": "e5cab49a901703107f446fc9fda902e2",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01212",
    "countryDocumentId": "e5cab49a901703107f446fc9fda902e2",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01213",
    "countryDocumentId": "e5cab49a901703107f446fc9fda902e2",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01214",
    "countryDocumentId": "e5cab49a901703107f446fc9fda902e2",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01215",
    "countryDocumentId": "e5cab49a901703107f446fc9fda902e2",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01216",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01217",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01218",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01219",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01220",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "ethnicity",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01221",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01222",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01223",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01224",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "issuing_authority",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01225",
    "countryDocumentId": "e5caf49a901703107f446fc9fda902de",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Resident Identity Card"
  },
  {
    "id": "CDF-01226",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01227",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01228",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01229",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01230",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01231",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01232",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01233",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01234",
    "countryDocumentId": "e9ba349a901703107f446fc9fda902c7",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01235",
    "countryDocumentId": "ebaaf09a901703107f446fc9fda902da",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-01236",
    "countryDocumentId": "ebaaf09a901703107f446fc9fda902da",
    "fieldName": "national_id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-01237",
    "countryDocumentId": "ebaaf09a901703107f446fc9fda902da",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-01238",
    "countryDocumentId": "ebaaf09a901703107f446fc9fda902da",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-01239",
    "countryDocumentId": "ebaaf09a901703107f446fc9fda902da",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-01240",
    "countryDocumentId": "ebaaf09a901703107f446fc9fda902da",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-01241",
    "countryDocumentId": "ebaaf09a901703107f446fc9fda902da",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-01242",
    "countryDocumentId": "ebaaf09a901703107f446fc9fda902da",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for National ID Card"
  },
  {
    "id": "CDF-01243",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01244",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01245",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01246",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01247",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01248",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01249",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01250",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01251",
    "countryDocumentId": "eccab49a901703107f446fc9fda90264",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01252",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01253",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01254",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01255",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01256",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01257",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01258",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01259",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01260",
    "countryDocumentId": "edaab09a901703107f446fc9fda90277",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01261",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01262",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01263",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01264",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01265",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01266",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01267",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01268",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01269",
    "countryDocumentId": "efaaf09a901703107f446fc9fda902dd",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01270",
    "countryDocumentId": "f0aab09a901703107f446fc9fda90248",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01271",
    "countryDocumentId": "f0aab09a901703107f446fc9fda90248",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01272",
    "countryDocumentId": "f0aab09a901703107f446fc9fda90248",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01273",
    "countryDocumentId": "f0aab09a901703107f446fc9fda90248",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01274",
    "countryDocumentId": "f0aab09a901703107f446fc9fda90248",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01275",
    "countryDocumentId": "f0aab09a901703107f446fc9fda90248",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01276",
    "countryDocumentId": "f0aab09a901703107f446fc9fda90248",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01277",
    "countryDocumentId": "fdba349a901703107f446fc9fda902ca",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01278",
    "countryDocumentId": "fdba349a901703107f446fc9fda902ca",
    "fieldName": "id_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01279",
    "countryDocumentId": "fdba349a901703107f446fc9fda902ca",
    "fieldName": "license_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01280",
    "countryDocumentId": "fdba349a901703107f446fc9fda902ca",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01281",
    "countryDocumentId": "fdba349a901703107f446fc9fda902ca",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01282",
    "countryDocumentId": "fdba349a901703107f446fc9fda902ca",
    "fieldName": "categories",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01283",
    "countryDocumentId": "fdba349a901703107f446fc9fda902ca",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01284",
    "countryDocumentId": "fdba349a901703107f446fc9fda902ca",
    "fieldName": "photo",
    "fieldType": "image",
    "active": true,
    "notes": "Schema definition for Driving License"
  },
  {
    "id": "CDF-01285",
    "countryDocumentId": "CDOC-CAN-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01286",
    "countryDocumentId": "CDOC-CAN-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01287",
    "countryDocumentId": "CDOC-CAN-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01288",
    "countryDocumentId": "CDOC-CAN-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01289",
    "countryDocumentId": "CDOC-CAN-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01290",
    "countryDocumentId": "CDOC-CAN-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01291",
    "countryDocumentId": "CDOC-CAN-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01292",
    "countryDocumentId": "CDOC-CAN-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01293",
    "countryDocumentId": "CDOC-CAN-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01294",
    "countryDocumentId": "CDOC-CAN-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01295",
    "countryDocumentId": "CDOC-CAN-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01296",
    "countryDocumentId": "CDOC-CAN-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01297",
    "countryDocumentId": "CDOC-CAN-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01298",
    "countryDocumentId": "CDOC-CAN-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01299",
    "countryDocumentId": "CDOC-CAN-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01300",
    "countryDocumentId": "CDOC-CAN-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01301",
    "countryDocumentId": "CDOC-CAN-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01302",
    "countryDocumentId": "CDOC-CAN-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01303",
    "countryDocumentId": "CDOC-ERI-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01304",
    "countryDocumentId": "CDOC-ERI-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01305",
    "countryDocumentId": "CDOC-ERI-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01306",
    "countryDocumentId": "CDOC-ERI-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01307",
    "countryDocumentId": "CDOC-ERI-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01308",
    "countryDocumentId": "CDOC-ERI-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01309",
    "countryDocumentId": "CDOC-ERI-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01310",
    "countryDocumentId": "CDOC-ERI-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01311",
    "countryDocumentId": "CDOC-ERI-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01312",
    "countryDocumentId": "CDOC-ERI-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01313",
    "countryDocumentId": "CDOC-ERI-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01314",
    "countryDocumentId": "CDOC-ERI-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01315",
    "countryDocumentId": "CDOC-ERI-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01316",
    "countryDocumentId": "CDOC-ERI-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01317",
    "countryDocumentId": "CDOC-ERI-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01318",
    "countryDocumentId": "CDOC-ERI-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01319",
    "countryDocumentId": "CDOC-ERI-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01320",
    "countryDocumentId": "CDOC-ERI-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01321",
    "countryDocumentId": "CDOC-ETH-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01322",
    "countryDocumentId": "CDOC-ETH-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01323",
    "countryDocumentId": "CDOC-ETH-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01324",
    "countryDocumentId": "CDOC-ETH-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01325",
    "countryDocumentId": "CDOC-ETH-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01326",
    "countryDocumentId": "CDOC-ETH-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01327",
    "countryDocumentId": "CDOC-ETH-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01328",
    "countryDocumentId": "CDOC-ETH-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01329",
    "countryDocumentId": "CDOC-ETH-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01330",
    "countryDocumentId": "CDOC-ETH-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01331",
    "countryDocumentId": "CDOC-ETH-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01332",
    "countryDocumentId": "CDOC-ETH-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01333",
    "countryDocumentId": "CDOC-ETH-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01334",
    "countryDocumentId": "CDOC-ETH-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01335",
    "countryDocumentId": "CDOC-ETH-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01336",
    "countryDocumentId": "CDOC-ETH-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01337",
    "countryDocumentId": "CDOC-ETH-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01338",
    "countryDocumentId": "CDOC-ETH-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01339",
    "countryDocumentId": "CDOC-IRQ-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01340",
    "countryDocumentId": "CDOC-IRQ-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01341",
    "countryDocumentId": "CDOC-IRQ-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01342",
    "countryDocumentId": "CDOC-IRQ-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01343",
    "countryDocumentId": "CDOC-IRQ-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01344",
    "countryDocumentId": "CDOC-IRQ-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01345",
    "countryDocumentId": "CDOC-IRQ-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01346",
    "countryDocumentId": "CDOC-IRQ-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01347",
    "countryDocumentId": "CDOC-IRQ-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01348",
    "countryDocumentId": "CDOC-IRQ-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01349",
    "countryDocumentId": "CDOC-IRQ-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01350",
    "countryDocumentId": "CDOC-IRQ-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01351",
    "countryDocumentId": "CDOC-IRQ-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01352",
    "countryDocumentId": "CDOC-IRQ-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01353",
    "countryDocumentId": "CDOC-IRQ-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01354",
    "countryDocumentId": "CDOC-IRQ-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01355",
    "countryDocumentId": "CDOC-IRQ-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01356",
    "countryDocumentId": "CDOC-IRQ-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01357",
    "countryDocumentId": "CDOC-SSD-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01358",
    "countryDocumentId": "CDOC-SSD-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01359",
    "countryDocumentId": "CDOC-SSD-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01360",
    "countryDocumentId": "CDOC-SSD-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01361",
    "countryDocumentId": "CDOC-SSD-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01362",
    "countryDocumentId": "CDOC-SSD-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01363",
    "countryDocumentId": "CDOC-SSD-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01364",
    "countryDocumentId": "CDOC-SSD-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01365",
    "countryDocumentId": "CDOC-SSD-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01366",
    "countryDocumentId": "CDOC-SSD-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01367",
    "countryDocumentId": "CDOC-SSD-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01368",
    "countryDocumentId": "CDOC-SSD-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01369",
    "countryDocumentId": "CDOC-SSD-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01370",
    "countryDocumentId": "CDOC-SSD-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01371",
    "countryDocumentId": "CDOC-SSD-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01372",
    "countryDocumentId": "CDOC-SSD-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01373",
    "countryDocumentId": "CDOC-SSD-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01374",
    "countryDocumentId": "CDOC-SSD-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01375",
    "countryDocumentId": "CDOC-SDN-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01376",
    "countryDocumentId": "CDOC-SDN-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01377",
    "countryDocumentId": "CDOC-SDN-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01378",
    "countryDocumentId": "CDOC-SDN-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01379",
    "countryDocumentId": "CDOC-SDN-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01380",
    "countryDocumentId": "CDOC-SDN-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01381",
    "countryDocumentId": "CDOC-SDN-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01382",
    "countryDocumentId": "CDOC-SDN-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01383",
    "countryDocumentId": "CDOC-SDN-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01384",
    "countryDocumentId": "CDOC-SDN-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01385",
    "countryDocumentId": "CDOC-SDN-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01386",
    "countryDocumentId": "CDOC-SDN-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01387",
    "countryDocumentId": "CDOC-SDN-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01388",
    "countryDocumentId": "CDOC-SDN-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01389",
    "countryDocumentId": "CDOC-SDN-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01390",
    "countryDocumentId": "CDOC-SDN-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01391",
    "countryDocumentId": "CDOC-SDN-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01392",
    "countryDocumentId": "CDOC-SDN-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01393",
    "countryDocumentId": "CDOC-GBR-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01394",
    "countryDocumentId": "CDOC-GBR-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01395",
    "countryDocumentId": "CDOC-GBR-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01396",
    "countryDocumentId": "CDOC-GBR-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01397",
    "countryDocumentId": "CDOC-GBR-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01398",
    "countryDocumentId": "CDOC-GBR-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01399",
    "countryDocumentId": "CDOC-GBR-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01400",
    "countryDocumentId": "CDOC-GBR-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01401",
    "countryDocumentId": "CDOC-GBR-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01402",
    "countryDocumentId": "CDOC-GBR-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01403",
    "countryDocumentId": "CDOC-GBR-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01404",
    "countryDocumentId": "CDOC-GBR-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01405",
    "countryDocumentId": "CDOC-GBR-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01406",
    "countryDocumentId": "CDOC-GBR-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01407",
    "countryDocumentId": "CDOC-GBR-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01408",
    "countryDocumentId": "CDOC-GBR-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01409",
    "countryDocumentId": "CDOC-GBR-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01410",
    "countryDocumentId": "CDOC-GBR-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01411",
    "countryDocumentId": "CDOC-COD-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01412",
    "countryDocumentId": "CDOC-COD-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01413",
    "countryDocumentId": "CDOC-COD-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01414",
    "countryDocumentId": "CDOC-COD-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01415",
    "countryDocumentId": "CDOC-COD-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01416",
    "countryDocumentId": "CDOC-COD-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01417",
    "countryDocumentId": "CDOC-COD-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01418",
    "countryDocumentId": "CDOC-COD-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01419",
    "countryDocumentId": "CDOC-COD-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01420",
    "countryDocumentId": "CDOC-COD-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01421",
    "countryDocumentId": "CDOC-COD-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01422",
    "countryDocumentId": "CDOC-COD-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01423",
    "countryDocumentId": "CDOC-COD-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01424",
    "countryDocumentId": "CDOC-COD-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01425",
    "countryDocumentId": "CDOC-COD-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01426",
    "countryDocumentId": "CDOC-COD-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01427",
    "countryDocumentId": "CDOC-COD-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01428",
    "countryDocumentId": "CDOC-COD-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01429",
    "countryDocumentId": "CDOC-MMR-01",
    "fieldName": "national_id",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01430",
    "countryDocumentId": "CDOC-MMR-01",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01431",
    "countryDocumentId": "CDOC-MMR-01",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01432",
    "countryDocumentId": "CDOC-MMR-01",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01433",
    "countryDocumentId": "CDOC-MMR-01",
    "fieldName": "address",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for National Identity Card"
  },
  {
    "id": "CDF-01434",
    "countryDocumentId": "CDOC-MMR-02",
    "fieldName": "passport_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01435",
    "countryDocumentId": "CDOC-MMR-02",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01436",
    "countryDocumentId": "CDOC-MMR-02",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01437",
    "countryDocumentId": "CDOC-MMR-02",
    "fieldName": "gender",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01438",
    "countryDocumentId": "CDOC-MMR-02",
    "fieldName": "nationality",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01439",
    "countryDocumentId": "CDOC-MMR-02",
    "fieldName": "issue_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01440",
    "countryDocumentId": "CDOC-MMR-02",
    "fieldName": "expiry_date",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Passport"
  },
  {
    "id": "CDF-01441",
    "countryDocumentId": "CDOC-MMR-03",
    "fieldName": "full_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01442",
    "countryDocumentId": "CDOC-MMR-03",
    "fieldName": "date_of_birth",
    "fieldType": "date",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01443",
    "countryDocumentId": "CDOC-MMR-03",
    "fieldName": "place_of_birth",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01444",
    "countryDocumentId": "CDOC-MMR-03",
    "fieldName": "father_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01445",
    "countryDocumentId": "CDOC-MMR-03",
    "fieldName": "mother_name",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  },
  {
    "id": "CDF-01446",
    "countryDocumentId": "CDOC-MMR-03",
    "fieldName": "registration_number",
    "fieldType": "text",
    "active": true,
    "notes": "Schema definition for Birth Certificate"
  }
];

export const INITIAL_EVIDENCE_RULES: EvidenceRuleRecord[] = [];

export const INITIAL_VERIFICATION_AUTHORITIES: VerificationAuthorityRecord[] = [];

export const INITIAL_VERIFICATION_REQUESTS: VerificationRequestRecord[] = [];
