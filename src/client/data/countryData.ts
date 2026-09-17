export interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  nationality: string;
  passportPattern?: RegExp;
  passportFormatHint?: string;
  nationalIdPattern?: RegExp;
  nationalIdFormatHint?: string;
  states: string[];
}

export const COUNTRIES_DATA: CountryData[] = [
  {
    name: 'Afghanistan',
    code: 'AF',
    dialCode: '+93',
    nationality: 'Afghan',
    passportPattern: /^[A-Z][0-9]{7}$/i,
    passportFormatHint: '1 letter followed by 7 digits (e.g. P1234567)',
    nationalIdPattern: /^[0-9]{13}$/,
    nationalIdFormatHint: '13 digits (Tazkira number)',
    states: ['Kabul', 'Kandahar', 'Herat', 'Mazar-i-Sharif', 'Nangarhar', 'Balkh', 'Badakhshan', 'Helmand', 'Ghor', 'Ghazni', 'Other']
  },
  {
    name: 'Syrian Arab Republic',
    code: 'SY',
    dialCode: '+963',
    nationality: 'Syrian',
    passportPattern: /^[0-9]{9}$/,
    passportFormatHint: '9 digits (e.g. 001234567)',
    nationalIdPattern: /^[0-9]{11}$/,
    nationalIdFormatHint: '11 digits (Syrian National ID)',
    states: ['Damascus', 'Aleppo', 'Homs', 'Hama', 'Latakia', 'Tartus', 'Idlib', 'Daraa', 'Deir ez-Zor', 'Raqqa', 'Al-Hasakah', 'Other']
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    dialCode: '+251',
    nationality: 'Ethiopian',
    passportPattern: /^[EP][0-9]{7}$/i,
    passportFormatHint: 'Letter E or P followed by 7 digits (e.g. EP1234567)',
    nationalIdPattern: /^[0-9]{10,12}$/,
    nationalIdFormatHint: '10 to 12 digits (Fayda Digital ID)',
    states: ['Addis Ababa', 'Oromia', 'Amhara', 'Sidama', 'Somali', 'Tigray', 'SNNPR', 'Afar', 'Benishangul-Gumuz', 'Gambela', 'Other']
  },
  {
    name: 'Sudan',
    code: 'SD',
    dialCode: '+249',
    nationality: 'Sudanese',
    passportPattern: /^[P][0-9]{8}$/i,
    passportFormatHint: 'Letter P followed by 8 digits (e.g. P12345678)',
    nationalIdPattern: /^[0-9]{11}$/,
    nationalIdFormatHint: '11 digits (National Identification Number)',
    states: ['Khartoum', 'Red Sea', 'Gezira', 'Kassala', 'North Kordofan', 'South Darfur', 'North Darfur', 'White Nile', 'Other']
  },
  {
    name: 'Somalia',
    code: 'SO',
    dialCode: '+252',
    nationality: 'Somali',
    passportPattern: /^[P][0-9]{7}$/i,
    passportFormatHint: 'Letter P followed by 7 digits (e.g. P1234567)',
    nationalIdPattern: /^[0-9]{9,12}$/,
    nationalIdFormatHint: '9 to 12 digits',
    states: ['Banaadir (Mogadishu)', 'Puntland', 'Somaliland', 'Jubaland', 'Galmudug', 'South West State', 'Hirshabelle', 'Other']
  },
  {
    name: 'Ukraine',
    code: 'UA',
    dialCode: '+380',
    nationality: 'Ukrainian',
    passportPattern: /^[FE][0-9]{8}$/i,
    passportFormatHint: '2 letters followed by 8 digits or 9 digits ID card',
    nationalIdPattern: /^[0-9]{9,10}$/,
    nationalIdFormatHint: '9 digits ID card or 10 digits Tax ID',
    states: ['Kyiv', 'Kharkiv', 'Odesa', 'Dnipro', 'Lviv', 'Zaporizhzhia', 'Mykolaiv', 'Vinnytsia', 'Chernihiv', 'Poltava', 'Other']
  },
  {
    name: 'India',
    code: 'IN',
    dialCode: '+91',
    nationality: 'Indian',
    passportPattern: /^[A-Z][0-9]{7}$/i,
    passportFormatHint: '1 letter followed by 7 digits (e.g. A1234567)',
    nationalIdPattern: /^[0-9]{12}$/,
    nationalIdFormatHint: '12 digits (Aadhaar Number)',
    states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'West Bengal', 'Telangana', 'Kerala', 'Other']
  },
  {
    name: 'United States',
    code: 'US',
    dialCode: '+1',
    nationality: 'American',
    passportPattern: /^[0-9]{9}$/,
    passportFormatHint: '9 digits (e.g. 123456789)',
    nationalIdPattern: /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/,
    nationalIdFormatHint: '9 digits SSN (XXX-XX-XXXX)',
    states: ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Washington', 'Other']
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    dialCode: '+44',
    nationality: 'British',
    passportPattern: /^[0-9]{9}$/,
    passportFormatHint: '9 digits (e.g. 987654321)',
    nationalIdPattern: /^[A-Z]{2}[0-9]{6}[A-Z]$/i,
    nationalIdFormatHint: 'National Insurance Number (e.g. QQ123456C)',
    states: ['Greater London', 'Greater Manchester', 'West Midlands', 'West Yorkshire', 'Scotland', 'Wales', 'Northern Ireland', 'Other']
  },
  {
    name: 'Canada',
    code: 'CA',
    dialCode: '+1',
    nationality: 'Canadian',
    passportPattern: /^[A-Z]{2}[0-9]{6}$/i,
    passportFormatHint: '2 letters followed by 6 digits (e.g. ZE123456)',
    nationalIdPattern: /^[0-9]{9}$/,
    nationalIdFormatHint: '9 digits SIN (Social Insurance Number)',
    states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'Other']
  },
  {
    name: 'Myanmar',
    code: 'MM',
    dialCode: '+95',
    nationality: 'Burmese',
    passportPattern: /^[MD][0-9]{6}$/i,
    passportFormatHint: 'Letter M or D followed by 6 digits (e.g. MB123456)',
    nationalIdPattern: /^[0-9]{1,2}\/[A-Z]+\([N]\)[0-9]{6}$/i,
    nationalIdFormatHint: 'NRC Card format (e.g. 12/DAGANA(N)123456)',
    states: ['Yangon', 'Mandalay', 'Shan', 'Ayeyarwady', 'Rakhine', 'Bago', 'Magway', 'Sagaing', 'Mon', 'Kachin', 'Other']
  },
  {
    name: 'Yemen',
    code: 'YE',
    dialCode: '+967',
    nationality: 'Yemeni',
    passportPattern: /^[0-9]{8}$/,
    passportFormatHint: '8 digits (e.g. 08123456)',
    nationalIdPattern: /^[0-9]{11}$/,
    nationalIdFormatHint: '11 digits National ID',
    states: ['Sana\'a', 'Aden', 'Taiz', 'Al Hudaydah', 'Ibb', 'Hadramaut', 'Dhamar', 'Other']
  },
  {
    name: 'Democratic Republic of the Congo',
    code: 'CD',
    dialCode: '+243',
    nationality: 'Congolese',
    passportPattern: /^[OP][0-9]{7}$/i,
    passportFormatHint: 'Letter O or P followed by 7 digits',
    nationalIdPattern: /^[0-9]{10}$/,
    nationalIdFormatHint: '10 digits Electoral ID',
    states: ['Kinshasa', 'North Kivu', 'South Kivu', 'Haut-Katanga', 'Ituri', 'Kasaï-Central', 'Other']
  },
  {
    name: 'Eritrea',
    code: 'ER',
    dialCode: '+291',
    nationality: 'Eritrean',
    passportPattern: /^[0-9]{8}$/,
    passportFormatHint: '8 digits',
    nationalIdPattern: /^[0-9]{10}$/,
    nationalIdFormatHint: '10 digits Identity Card',
    states: ['Maekel', 'Anseba', 'Gash-Barka', 'Debub', 'Northern Red Sea', 'Southern Red Sea', 'Other']
  },
  {
    name: 'Pakistan',
    code: 'PK',
    dialCode: '+92',
    nationality: 'Pakistani',
    passportPattern: /^[A-Z]{2}[0-9]{7}$/i,
    passportFormatHint: '2 letters followed by 7 digits (e.g. AB1234567)',
    nationalIdPattern: /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
    nationalIdFormatHint: '13 digits CNIC (XXXXX-XXXXXXX-X)',
    states: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad Capital Territory', 'Azad Kashmir', 'Other']
  },
  {
    name: 'Iraq',
    code: 'IQ',
    dialCode: '+964',
    nationality: 'Iraqi',
    passportPattern: /^[A-Z][0-9]{7,8}$/i,
    passportFormatHint: '1 letter followed by 7-8 digits (e.g. A1234567)',
    nationalIdPattern: /^[0-9]{12}$/,
    nationalIdFormatHint: '12 digits Unified National Card',
    states: ['Baghdad', 'Erbil', 'Basra', 'Nineveh (Mosul)', 'Sulaymaniyah', 'Duhok', 'Kirkuk', 'Anbar', 'Other']
  },
  {
    name: 'South Sudan',
    code: 'SS',
    dialCode: '+211',
    nationality: 'South Sudanese',
    passportPattern: /^[0-9]{7,8}$/,
    passportFormatHint: '7 to 8 digits',
    nationalIdPattern: /^[0-9]{9,11}$/,
    nationalIdFormatHint: '9 to 11 digits',
    states: ['Central Equatoria (Juba)', 'Jonglei', 'Upper Nile', 'Unity', 'Western Equatoria', 'Other']
  },
  {
    name: 'France',
    code: 'FR',
    dialCode: '+33',
    nationality: 'French',
    passportPattern: /^[0-9]{2}[A-Z]{2}[0-9]{5}$/i,
    passportFormatHint: '2 digits, 2 letters, 5 digits (e.g. 12AB34567)',
    nationalIdPattern: /^[0-9]{12}$/,
    nationalIdFormatHint: '12 digits National ID Card',
    states: ['Île-de-France (Paris)', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie', 'Provence-Alpes-Côte d\'Azur', 'Other']
  },
  {
    name: 'Germany',
    code: 'DE',
    dialCode: '+49',
    nationality: 'German',
    passportPattern: /^[C-FGHJKLMNPRTVWXYZ0-9]{9}$/i,
    passportFormatHint: '9 alphanumeric characters',
    nationalIdPattern: /^[L0-9]{9,10}$/i,
    nationalIdFormatHint: '9-10 alphanumeric characters Personalausweis',
    states: ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony', 'Hesse', 'Berlin', 'Other']
  },
  {
    name: 'Turkey',
    code: 'TR',
    dialCode: '+90',
    nationality: 'Turkish',
    passportPattern: /^[U][0-9]{8}$/i,
    passportFormatHint: 'Letter U followed by 8 digits (e.g. U12345678)',
    nationalIdPattern: /^[0-9]{11}$/,
    nationalIdFormatHint: '11 digits T.C. Kimlik No',
    states: ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep', 'Konya', 'Other']
  },
  {
    name: 'Other Country',
    code: 'XX',
    dialCode: '+1',
    nationality: 'Other',
    passportPattern: /^[A-Z0-9]{5,20}$/i,
    passportFormatHint: '5 to 20 alphanumeric characters',
    nationalIdPattern: /^[A-Z0-9-]{5,25}$/i,
    nationalIdFormatHint: '5 to 25 alphanumeric characters',
    states: ['Other']
  }
];

export function getCountryByName(name: string): CountryData {
  const found = COUNTRIES_DATA.find(c => c.name.toLowerCase() === name.toLowerCase());
  return found || COUNTRIES_DATA[COUNTRIES_DATA.length - 1]; // Fallback to Other Country
}
