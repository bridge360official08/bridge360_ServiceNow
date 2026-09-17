import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import indexHtml from '../../client/index.html';

UiPage({
  $id: 'bridge360_ui_page',
  endpoint: 'bridge360.do',
  description: 'Bridge360 Refugee Family Case Management System Shell',
  category: 'general',
  html: indexHtml,
  direct: true,
});
