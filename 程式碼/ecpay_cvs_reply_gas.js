/**
 * 金太極草本舒緩膏 — 綠界超商地圖 ServerReplyURL
 * =====================================================
 * 用途：作為 ECPay CVS 地圖選店的 ServerReplyURL
 *        接收門市資料後回傳 HTML，透過 postMessage 傳回主頁面
 *
 * 部署步驟：
 *  1. 開啟 Google Apps Script：https://script.google.com/
 *  2. 建立新專案，貼上此程式碼
 *  3. 點「部署 → 新增部署」→ 類型選「網路應用程式」
 *  4. 執行身分：「我」/ 存取權：「任何人」
 *  5. 複製「網路應用程式網址」
 *  6. 貼回 index.html 的 ECPAY_REPLY_URL 變數
 *  7. 同時將 ECPAY_ENABLED 改為 true
 *
 * 注意：每次修改程式碼後需重新部署（「管理部署 → 編輯 → 新版本」）
 */

/**
 * 接收 ECPay 門市 POST 回傳
 */
function doPost(e) {
  var params = e.parameter;

  var storeID   = params.CVSStoreID   || '';
  var storeName = params.CVSStoreName || '';
  var address   = params.CVSAddress   || '';
  var telephone = params.CVSTelephone || '';
  var outside   = params.CVSOutSide   || ''; // 全家用：是否在外縣市

  // 回傳 HTML，透過 postMessage 通知父視窗，然後關閉彈窗
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<title>門市選擇完成</title>' +
    '<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f0fdf4;}</style>' +
    '</head><body>' +
    '<div style="text-align:center;padding:20px;">' +
    '<p style="font-size:24px;">✅</p>' +
    '<p style="font-weight:bold;font-size:16px;">已選取：' + storeName + '</p>' +
    '<p style="color:#666;font-size:13px;">' + address + '</p>' +
    '<p style="color:#999;font-size:12px;margin-top:10px;">視窗將自動關閉...</p>' +
    '</div>' +
    '<script>' +
    'try {' +
    '  var data = {' +
    '    CVSStoreID:   "' + storeID.replace(/"/g,'\\"') + '",' +
    '    CVSStoreName: "' + storeName.replace(/"/g,'\\"') + '",' +
    '    CVSAddress:   "' + address.replace(/"/g,'\\"') + '",' +
    '    CVSTelephone: "' + telephone.replace(/"/g,'\\"') + '",' +
    '    CVSOutSide:   "' + outside.replace(/"/g,'\\"') + '"' +
    '  };' +
    '  window.opener && window.opener.postMessage(data, "*");' +
    '} catch(err) {}' +
    'setTimeout(function(){ window.close(); }, 1500);' +
    '<\/script>' +
    '</body></html>';

  return ContentService
    .createTextOutput(html)
    .setMimeType(ContentService.MimeType.HTML);
}

/**
 * GET 測試用（部署後可用瀏覽器直接開啟確認有無錯誤）
 */
function doGet(e) {
  return ContentService
    .createTextOutput('ECPay CVS Reply GAS 運作正常 ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}
