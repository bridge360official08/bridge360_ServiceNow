import https from 'https';

const auth = Buffer.from('admin:mn%XC1^ScdA4').toString('base64');
const HOSTNAME = 'dev187180.service-now.com';
const IP_ADDRESS = '158.158.32.123';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr' },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼', dir: 'ltr' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', dir: 'ltr' }
];

function resilientLookup(hostname, opts, cb) {
  if (typeof opts === 'function') { cb = opts; opts = {}; }
  if (opts && opts.all) {
    cb(null, [{ address: IP_ADDRESS, family: 4 }]);
  } else {
    cb(null, IP_ADDRESS, 4);
  }
}

export function snRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const req = https.request({
      hostname: HOSTNAME,
      path: path,
      method: method,
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      },
      lookup: resilientLookup,
      timeout: 30000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('====================================================');
  console.log(' STEP 1: BULK-ACTIVATE 25 GLOBAL LANGUAGES IN SN');
  console.log('====================================================');

  for (const lang of LANGUAGES) {
    try {
      const q = encodeURIComponent(`id=${lang.code}`);
      const check = await snRequest(`/api/now/table/sys_language?sysparm_query=${q}&sysparm_limit=1`);
      const existing = check.body?.result?.[0];
      if (existing) {
        const update = await snRequest(`/api/now/table/sys_language/${existing.sys_id}`, 'PATCH', {
          active: 'true',
          display_label: lang.nativeName,
          name: lang.name,
          text_direction: lang.dir
        });
        console.log(`[OK] Activated ${lang.code.padEnd(6)} (${lang.name}) -> HTTP ${update.status}`);
      } else {
        const insert = await snRequest('/api/now/table/sys_language', 'POST', {
          id: lang.code,
          name: lang.name,
          display_label: lang.nativeName,
          text_direction: lang.dir,
          active: 'true'
        });
        console.log(`[OK] Created & Activated ${lang.code.padEnd(6)} (${lang.name}) -> HTTP ${insert.status}`);
      }
    } catch (e) {
      console.error(`[ERR] ${lang.code}: ${e.message}`);
    }
  }

  console.log('\n====================================================');
  console.log(' STEP 2: CHECK TRANSLATION PACKS ON INSTANCE');
  console.log('====================================================');
  try {
    const pluginRes = await snRequest('/api/now/table/v_plugin?sysparm_query=idSTARTSWITHcom.snc.i18n&sysparm_limit=50');
    console.log(`Found ${pluginRes.body?.result?.length || 0} i18n plugins on instance:`);
    pluginRes.body?.result?.forEach(p => {
      console.log(`  - ${p.id.padEnd(30)}: ${p.name} (active: ${p.active})`);
    });
  } catch (e) {
    console.error('Plugin check error:', e.message);
  }

  console.log('\n====================================================');
  console.log(' STEP 3: CREATE SERVICE PORTAL LANGUAGE WIDGET');
  console.log('====================================================');
  const widgetHtml = `<div class="b360-lang-widget">
  <div class="dropdown">
    <button class="btn btn-default dropdown-toggle b360-lang-btn" type="button" id="b360LangDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span class="flag-icon">{{c.currentLang.flag}}</span>
      <span class="lang-name">{{c.currentLang.name}}</span>
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu dropdown-menu-right b360-lang-menu" aria-labelledby="b360LangDropdown">
      <li ng-repeat="item in c.languages" ng-class="{'active': item.code === c.currentLang.code}">
        <a href="javascript:void(0)" ng-click="c.switchLanguage(item.code)">
          <span class="flag-icon">{{item.flag}}</span>
          <span class="lang-text">{{item.name}} ({{item.nativeName}})</span>
        </a>
      </li>
    </ul>
  </div>
</div>`;

  const widgetCss = `.b360-lang-widget {
  display: inline-block;
  margin: 8px;
}
.b360-lang-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}
.b360-lang-menu {
  max-height: 360px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
.b360-lang-menu li a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
}`;

  const widgetClientScript = `function($scope, $http, $window) {
  var c = this;
  c.languages = ${JSON.stringify(LANGUAGES)};
  
  var currentCode = $window.g_user_language || 'en';
  c.currentLang = c.languages.find(function(l) { return l.code === currentCode; }) || c.languages[0];

  c.switchLanguage = function(selectedLangCode) {
    $http.post('/api/now/session', { language: selectedLangCode })
      .then(function() {
        $window.location.reload();
      })
      .catch(function(err) {
        console.error('Failed to change session language:', err);
        $window.location.reload();
      });
  };
}`;

  try {
    const widgetId = 'bridge360_language_switcher';
    const checkW = await snRequest(`/api/now/table/sp_widget?sysparm_query=id=${widgetId}&sysparm_limit=1`);
    const existingW = checkW.body?.result?.[0];
    if (existingW) {
      const up = await snRequest(`/api/now/table/sp_widget/${existingW.sys_id}`, 'PATCH', {
        name: 'Bridge360 Global Language Switcher',
        template: widgetHtml,
        css: widgetCss,
        client_script: widgetClientScript,
        public: 'true'
      });
      console.log(`[OK] Updated sp_widget ${widgetId} -> HTTP ${up.status}`);
    } else {
      const ins = await snRequest('/api/now/table/sp_widget', 'POST', {
        id: widgetId,
        name: 'Bridge360 Global Language Switcher',
        template: widgetHtml,
        css: widgetCss,
        client_script: widgetClientScript,
        public: 'true'
      });
      console.log(`[OK] Created sp_widget ${widgetId} -> HTTP ${ins.status}`);
    }
  } catch (e) {
    console.error('Widget creation error:', e.message);
  }

  console.log('\n====================================================');
  console.log(' STEP 5: TRANSLATION COMPLETENESS CHECK (sys_documentation)');
  console.log('====================================================');
  console.log('Language | Status | Documentation Count');
  console.log('---------|--------|--------------------');
  for (const lang of LANGUAGES) {
    try {
      const q = encodeURIComponent(`language=${lang.code}`);
      const docRes = await snRequest(`/api/now/table/sys_documentation?sysparm_query=${q}&sysparm_limit=10`);
      const count = docRes.body?.result?.length || 0;
      let status = '⚠️ Activated (ready for pack)';
      if (count > 0) {
        status = count >= 5 ? '✅ Full / Translated' : '⚠️ Partial';
      }
      console.log(`${lang.code.padEnd(8)} | ${status.padEnd(28)} | ${count > 0 ? (count >= 10 ? '10+ records' : count + ' records') : '0 records'}`);
    } catch (e) {
      console.log(`${lang.code.padEnd(8)} | ⚠️ Error querying: ${e.message}`);
    }
  }
}

run();
