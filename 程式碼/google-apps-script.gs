/**
 * 金牌一條根 × Google Apps Script 後端
 * ════════════════════════════════════════
 * 更新方式：
 *  1. 開啟 https://script.google.com → 開啟現有專案「金牌一條根 API」
 *  2. 全選貼上此完整程式碼（取代舊版）
 *  3. 儲存後點「部署」→「管理部署」→「編輯」→ 版本選「新增版本」→「部署」
 *  4. URL 不變，不需更新 HTML 裡的 SCRIPT_URL
 *
 *  ★ 首次設定保護：部署後在編輯器執行一次 setupSheetProtection()
 *    （工具列 → 執行 → 選 setupSheetProtection）
 *
 * 出貨進度（6步驟）：
 *  訂單成立 → 業務確認 → 備貨中 → 已出貨 → 配送中 → 已送達
 *
 * 通知 Email：a8603992000@yahoo.com.tw
 */

const SHEET_ID     = '1DIUI9ujWWlf_zJJEmlP12jRtm4S-gGIceg_3-CnF9mE';
const ORDERS_TAB   = '訂單';
const MEMBERS_TAB  = '會員';
const NOTIFY_EMAIL = 'a8603992000@yahoo.com.tw';

// ─── CORS Helper ─────────────────────────────────────────────
function cors(output) {
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── GET Router ──────────────────────────────────────────────
function doGet(e) {
  try {
    const action = (e.parameter.action || '').toLowerCase();
    if (action === 'getorders')  return cors(getOrders());
    if (action === 'getorder')   return cors(getOrder(e.parameter.orderNum, e.parameter.phone));
    if (action === 'getmembers') return cors(getMembers());
    if (action === 'getstats')        return cors(getStats());
    if (action === 'getemployeestats') return cors(getEmployeeStats(e.parameter.code));
    return cors({ ok: true, msg: '金牌一條根 API 運作中 ✅' });
  } catch(err) {
    return cors({ ok: false, error: err.message });
  }
}

// ─── POST Router ─────────────────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = (data.action || '').toLowerCase();
    if (action === 'addorder')    return cors(addOrder(data));
    if (action === 'updateorder') return cors(updateOrderStatus(data));
    return cors({ ok: false, error: 'Unknown action' });
  } catch(err) {
    return cors({ ok: false, error: err.message });
  }
}

// ─── 取得全部訂單 ─────────────────────────────────────────────
function getOrders() {
  const ss   = SpreadsheetApp.openById(SHEET_ID);
  const sh   = ss.getSheetByName(ORDERS_TAB);
  if (!sh) return { ok: false, error: '找不到「訂單」工作表' };
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return { ok: true, orders: [] };
  const headers = rows[0];
  const orders  = rows.slice(1).map(r => {
    const o = {};
    headers.forEach((h, i) => { o[h] = r[i]; });
    return normalize(o);
  });
  return { ok: true, orders: orders.reverse() };
}

// ─── 客戶查詢單筆訂單（驗證手機末三碼）──────────────────────────
function getOrder(orderNum, phone3) {
  if (!orderNum || !phone3) return { ok: false, error: '參數不完整' };
  const { orders } = getOrders();
  const found = (orders || []).find(o =>
    o.order_number === orderNum &&
    String(o.customer_phone || '').slice(-3) === phone3
  );
  if (!found) return { ok: false, error: '查無訂單，請確認訂單編號與手機末三碼' };
  const safe = { ...found };
  safe.customer_phone = maskPhone(safe.customer_phone);
  return { ok: true, order: safe };
}

// ─── 取得全部會員 ─────────────────────────────────────────────
function getMembers() {
  const ss   = SpreadsheetApp.openById(SHEET_ID);
  const sh   = ss.getSheetByName(MEMBERS_TAB);
  if (!sh) return { ok: false, error: '找不到「會員」工作表' };
  const rows = sh.getDataRange().getValues();
  if (rows.length < 2) return { ok: true, members: [] };
  const headers = rows[0];
  const members = rows.slice(1).map(r => {
    const m = {};
    headers.forEach((h, i) => { m[h] = r[i]; });
    return m;
  });
  return { ok: true, members };
}

// ─── 統計摘要 ─────────────────────────────────────────────────
function getStats() {
  const { orders = [] } = getOrders();
  const { members = [] } = getMembers();
  const today  = new Date().toISOString().slice(0, 10);
  const monthP = new Date().toISOString().slice(0, 7);
  const todayOrders = orders.filter(o => (o.created_at || '').startsWith(today));
  const monthOrders = orders.filter(o => (o.created_at || '').startsWith(monthP));
  const pending     = orders.filter(o =>
    ['訂單成立', '業務確認', '備貨中'].includes(o.order_status)
  );
  return {
    ok: true,
    today_orders:  todayOrders.length,
    today_amount:  todayOrders.reduce((a, o) => a + (Number(o.total) || 0), 0),
    month_orders:  monthOrders.length,
    month_amount:  monthOrders.reduce((a, o) => a + (Number(o.total) || 0), 0),
    pending_count: pending.length,
    total_orders:  orders.length,
    total_members: members.length,
    line_joined:   members.filter(m => m['LINE狀態'] === '已加入').length,
  };
}

// ─── 新增訂單 + 自動寄信通知 ──────────────────────────────────
function addOrder(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(ORDERS_TAB);
  if (!sh) return { ok: false, error: '找不到「訂單」工作表' };
  const d = data.order || data;

  sh.appendRow([
    d.order_number       || '',
    d.created_at         || new Date().toISOString(),
    d.customer_name      || '',
    d.customer_phone     || '',
    d.customer_email     || '',
    d.shipping_address   || '',
    d.product            || '',
    d.quantity           || 1,
    d.subtotal           || 0,
    d.referral_code      || '',   // 推薦碼（原折扣碼欄）
    d.discount_amount    || 0,
    d.shipping_fee       || 0,
    d.total              || 0,
    d.payment_method     || '貨到付款',
    d.order_status       || '訂單成立',
    '',  // 物流公司
    '',  // 物流單號
    '',  // 出貨日期
    d.referral_code_issued || '',
    d.source             || 'website',
    d.notes              || '',
    d.marketing_consent  ? '是' : '否',
    d.referral_code      || '',
    '',  // 業務Email已發
  ]);

  upsertMember(d);
  sendOrderNotificationEmail(d);

  return { ok: true, order_number: d.order_number };
}

// ─── 自動寄送訂單通知信 ────────────────────────────────────────
function sendOrderNotificationEmail(d) {
  try {
    const orderTime = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    const subject   = `🛒 新訂單｜${d.order_number}｜${d.customer_name}｜$${d.total}`;

    const body = `
════════════════════════════════════
  金牌一條根｜新訂單出貨通知
════════════════════════════════════

📦 訂單編號：${d.order_number}
🕐 下單時間：${orderTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【商品資訊】
  商品：${d.product}
  數量：${d.quantity} 罐
  小計：NT$ ${d.subtotal}
  運費：NT$ ${d.shipping_fee}
  ✅ 應收總金額：NT$ ${d.total}（貨到付款）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【收件人資訊】
  收件姓名：${d.customer_name}
  手機號碼：${d.customer_phone}
  收件地址：${d.shipping_address}
${d.customer_email ? '  Email：' + d.customer_email + '\n' : ''}${d.notes ? '  備註：' + d.notes + '\n' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【推薦資訊】
  使用推薦碼：${d.referral_code || '無'}
  客戶獲得推薦碼：${d.referral_code_issued || ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【⚠️ 出貨後請填入 Google Sheet】
請在出貨後更新以下欄位（O~R欄），客戶即可即時查詢進度：

  訂單狀態（O欄）可選：
    備貨中　→ 正在備料包裝
    出貨中　→ 已交給物流，運送中
    已出貨　→ 已到配送站

  ・物流公司（P欄）：例如 黑貓宅急便、7-11 店到店、全家
  ・物流單號（Q欄）：填入追蹤號碼
  ・出貨日期（R欄）：例如 2026/06/03

📊 Google Sheet 訂單管理：
https://docs.google.com/spreadsheets/d/${SHEET_ID}/

════════════════════════════════════
此信件由金牌一條根訂單系統自動發送，請勿回覆
════════════════════════════════════
`;

    MailApp.sendEmail({
      to:      NOTIFY_EMAIL,
      subject: subject,
      body:    body,
    });
  } catch(e) {
    console.log('Email 發送失敗：' + e.message);
  }
}

// ─── 更新訂單狀態（後台 / 工廠填寫）─────────────────────────────
function updateOrderStatus(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(ORDERS_TAB);
  if (!sh) return { ok: false, error: '找不到「訂單」工作表' };
  const rows    = sh.getDataRange().getValues();
  const headers = rows[0];
  const idxNum  = headers.indexOf('訂單編號');
  const idxStat = headers.indexOf('訂單狀態');
  const idxLog  = headers.indexOf('物流公司');
  const idxTrk  = headers.indexOf('物流單號');
  const idxShip = headers.indexOf('出貨日期');
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idxNum] === data.order_number) {
      if (data.order_status      && idxStat >= 0) sh.getRange(i+1, idxStat+1).setValue(data.order_status);
      if (data.logistics_company && idxLog  >= 0) sh.getRange(i+1, idxLog+1).setValue(data.logistics_company);
      if (data.tracking_number   && idxTrk  >= 0) sh.getRange(i+1, idxTrk+1).setValue(data.tracking_number);
      if (data.shipped_at        && idxShip >= 0) sh.getRange(i+1, idxShip+1).setValue(data.shipped_at);
      return { ok: true };
    }
  }
  return { ok: false, error: '找不到該訂單' };
}

// ─── 設定工作表保護（執行一次即可）───────────────────────────────
// 鎖定：客戶姓名(C)、手機(D)、Email(E)、收件地址(F)、折扣碼(J)、推薦碼(W)
// 開放：訂單狀態(O)、物流公司(P)、物流單號(Q)、出貨日期(R) ← 工廠填這裡
function setupSheetProtection() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(ORDERS_TAB);
  if (!sh) { Logger.log('❌ 找不到訂單工作表'); return; }

  // 移除舊保護
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(p => p.remove());
  sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(p => p.remove());

  // 保護整張工作表
  const protection = sh.protect().setDescription('客資保護 - 工廠只可編輯出貨欄位');

  // 開放工廠編輯的欄位：O(15)~R(18) = 訂單狀態、物流公司、物流單號、出貨日期
  const lastRow = Math.max(sh.getLastRow() + 100, 1000);
  protection.setUnprotectedRanges([
    sh.getRange(2, 15, lastRow, 4)
  ]);

  protection.setWarningOnly(false);

  Logger.log('✅ 保護設定完成！');
  Logger.log('🔒 鎖定：客戶姓名、手機、Email、收件地址、推薦碼');
  Logger.log('✏️  開放編輯：訂單狀態(O)、物流公司(P)、物流單號(Q)、出貨日期(R)');
}

// ─── 工廠作業選單（開啟試算表時自動出現）────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🏭 工廠作業')
    .addItem('📦 批次設為【備貨中】', 'batchSet備貨中')
    .addItem('🚚 批次設為【出貨中】', 'batchSet出貨中')
    .addItem('✅ 批次設為【已出貨】', 'batchSet已出貨')
    .addSeparator()
    .addItem('📋 填寫出貨資料（選取列後執行）', 'fillShippingInfo')
    .addSeparator()
    .addItem('🔄 重新整理格式與排序', 'setupSheetFormat')
    .addToUi();
}

function batchSet備貨中()  { batchSetStatus('備貨中');  }
function batchSet出貨中()  { batchSetStatus('出貨中');  }
function batchSet已出貨()  { batchSetStatus('已出貨');  }

// 批次更新選取列的訂單狀態
function batchSetStatus(status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ORDERS_TAB);
  const selection = sh.getActiveRange();
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const statusCol = headers.indexOf('訂單狀態') + 1;
  if (statusCol === 0) { SpreadsheetApp.getUi().alert('找不到「訂單狀態」欄位'); return; }
  const startRow = selection.getRow();
  const numRows  = selection.getNumRows();
  if (startRow === 1) { SpreadsheetApp.getUi().alert('請先選取訂單資料列（非標題列）'); return; }
  for (let i = 0; i < numRows; i++) {
    sh.getRange(startRow + i, statusCol).setValue(status);
  }
  SpreadsheetApp.getUi().alert('✅ 已將 ' + numRows + ' 筆訂單設為「' + status + '」');
}

// 填寫出貨資料（物流公司、物流單號、出貨日期）
function fillShippingInfo() {
  const ui = SpreadsheetApp.getUi();
  const company  = ui.prompt('物流公司', '例：黑貓宅急便 / 7-11 / 全家', ui.ButtonSet.OK_CANCEL);
  if (company.getSelectedButton() !== ui.Button.OK) return;
  const tracking = ui.prompt('物流單號', '輸入追蹤號碼', ui.ButtonSet.OK_CANCEL);
  if (tracking.getSelectedButton() !== ui.Button.OK) return;
  const today = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ORDERS_TAB);
  const selection = sh.getActiveRange();
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const logCol  = headers.indexOf('物流公司') + 1;
  const trkCol  = headers.indexOf('物流單號') + 1;
  const shipCol = headers.indexOf('出貨日期') + 1;
  const stCol   = headers.indexOf('訂單狀態') + 1;
  const startRow = selection.getRow();
  const numRows  = selection.getNumRows();
  if (startRow === 1) { ui.alert('請先選取訂單資料列（非標題列）'); return; }
  for (let i = 0; i < numRows; i++) {
    const r = startRow + i;
    if (logCol)  sh.getRange(r, logCol).setValue(company.getResponseText());
    if (trkCol)  sh.getRange(r, trkCol).setValue(tracking.getResponseText());
    if (shipCol) sh.getRange(r, shipCol).setValue(today);
    if (stCol)   sh.getRange(r, stCol).setValue('已出貨');
  }
  ui.alert('✅ 已更新 ' + numRows + ' 筆出貨資料，狀態設為「已出貨」');
}

// 整理試算表格式（凍結標題、條件著色、欄寬）
function setupSheetFormat() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(ORDERS_TAB);
  if (!sh) { Logger.log('找不到訂單工作表'); return; }
  sh.setFrozenRows(1);
  const headerRange = sh.getRange(1, 1, 1, sh.getLastColumn());
  headerRange.setBackground('#1a1a2e').setFontColor('#ffffff').setFontWeight('bold').setHorizontalAlignment('center');
  const lastRow = Math.max(sh.getLastRow(), 2);
  const statusRange = sh.getRange(2, 15, lastRow - 1, 1);
  const rules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('訂單成立').setBackground('#dbeafe').setFontColor('#1e40af').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('業務確認').setBackground('#fef9c3').setFontColor('#854d0e').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('備貨中').setBackground('#ffedd5').setFontColor('#9a3412').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('出貨中').setBackground('#f3e8ff').setFontColor('#7e22ce').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('已出貨').setBackground('#ede9fe').setFontColor('#5b21b6').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('配送中').setBackground('#e0f2fe').setFontColor('#0c4a6e').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('已送達').setBackground('#dcfce7').setFontColor('#14532d').setRanges([statusRange]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('取消訂單').setBackground('#fee2e2').setFontColor('#991b1b').setRanges([statusRange]).build(),
  ];
  sh.setConditionalFormatRules(rules);
  sh.autoResizeColumns(1, sh.getLastColumn());
  Logger.log('✅ 格式整理完成！');
}

// ─── 設定訂單狀態下拉選單 ────────────────────────────────────────
function setupDataValidation() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(ORDERS_TAB);
  if (!sh) { Logger.log('找不到訂單工作表'); return; }
  const lastRow = Math.max(sh.getLastRow() + 200, 1000);
  const range = sh.getRange(2, 15, lastRow, 1);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['訂單成立','業務確認','備貨中','出貨中','已出貨','配送中','已送達','取消訂單'], true)
    .setAllowInvalid(false).build();
  range.setDataValidation(rule);
  Logger.log('✅ 訂單狀態下拉選單設定完成（O欄）');
}

// ─── 修正欄位標題 ─────────────────────────────────────────────────
function fixColumnHeaders() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(ORDERS_TAB);
  if (!sh) { Logger.log('找不到訂單工作表'); return; }
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  headers.forEach((h, i) => {
    if (h === '折扣碼') {
      sh.getRange(1, i + 1).setValue('推薦碼');
      Logger.log('第 ' + (i+1) + ' 欄已改為推薦碼');
    }
  });
  Logger.log('✅ 完成');
}

// ─── 員工業績查詢 ─────────────────────────────────────────────────
function getEmployeeStats(referralCode) {
  if (!referralCode) return { ok: false, error: '請提供推薦碼' };
  const VALID = ['1688','2588','5208','6688','JIN1000'];
  if (!VALID.includes(referralCode.toUpperCase())) return { ok: false, error: '推薦碼不存在' };
  const { orders = [] } = getOrders();
  const myOrders = orders.filter(o =>
    (o.discount_code || '').toString().toUpperCase() === referralCode.toUpperCase() ||
    (o.referral_code_issued || '').toString().toUpperCase().startsWith(referralCode.toUpperCase())
  );
  const PAID_STATUS = ['已送達','已收款完成','已收款','已入帳','已結案'];
  const totalAmount     = myOrders.reduce((a, o) => a + (Number(o.total) || 0), 0);
  const confirmedOrders = myOrders.filter(o => PAID_STATUS.includes(o.order_status));
  const confirmedAmount = confirmedOrders.reduce((a, o) => a + (Number(o.total) || 0), 0);
  const pendingOrders   = myOrders.filter(o => !PAID_STATUS.includes(o.order_status) && o.order_status !== '取消訂單');
  const pendingAmount   = pendingOrders.reduce((a, o) => a + (Number(o.total) || 0), 0);
  const cancelledOrders = myOrders.filter(o => o.order_status === '取消訂單');
  return {
    ok: true,
    referral_code: referralCode,
    total_orders:     myOrders.length,
    total_amount:     totalAmount,
    confirmed_orders: confirmedOrders.length,
    confirmed_amount: confirmedAmount,
    pending_orders:   pendingOrders.length,
    pending_amount:   pendingAmount,
    cancelled_orders: cancelledOrders.length,
    orders: myOrders.map(o => ({
      order_number: o.order_number,
      created_at: o.created_at,
      product: o.product,
      quantity: o.quantity,
      total: o.total,
      order_status: o.order_status,
    }))
  };
}

// ─── 建立/更新會員 ────────────────────────────────────────────────
function upsertMember(d) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sh = ss.getSheetByName(MEMBERS_TAB);
    if (!sh) return;
    const rows  = sh.getDataRange().getValues();
    const phone = d.customer_phone || '';
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][2] === phone) {
        sh.getRange(i+1, 8).setValue((Number(rows[i][7]) || 0) + 1);
        sh.getRange(i+1, 9).setValue((Number(rows[i][8]) || 0) + (Number(d.total) || 0));
        return;
      }
    }
    const id = 'M' + String(rows.length).padStart(4, '0');
    sh.appendRow([id, d.customer_name||'', phone, d.customer_email||'', '未加入', d.source||'website', d.referral_code||'', 1, Number(d.total)||0, '', d.marketing_consent?'是':'否', new Date().toISOString()]);
  } catch(e) {}
}

// ─── Helper ──────────────────────────────────────────────────────
function maskPhone(p) {
  if (!p) return '—';
  return String(p).slice(0, 4) + '***' + String(p).slice(-3);
}

function normalize(o) {
  return {
    order_number:      o['訂單編號']    || '',
    created_at:        String(o['下單時間'] || ''),
    customer_name:     o['客戶姓名']    || '',
    customer_phone:    String(o['手機'] || ''),
    customer_email:    o['Email']       || '',
    shipping_address:  o['收件地址']    || '',
    product:           o['商品名稱']    || '',
    quantity:          Number(o['數量']) || 1,
    subtotal:          Number(o['小計']) || 0,
    discount_code:     o['推薦碼'] || o['折扣碼'] || '',
    discount_amount:   Number(o['折扣金額']) || 0,
    shipping_fee:      Number(o['運費']) || 0,
    total:             Number(o['總金額']) || 0,
    payment_method:    o['付款方式']    || '貨到付款',
    order_status:      o['訂單狀態']    || '訂單成立',
    logistics_company: o['物流公司']    || '',
    tracking_number:   o['物流單號']    || '',
    shipped_at:        String(o['出貨日期'] || ''),
    referral_code_issued: o['發行推薦碼'] || '',
    source:            o['來源']        || '',
    notes:             o['備註']        || '',
    marketing_consent: o['行銷同意']    === '是',
  };
}
