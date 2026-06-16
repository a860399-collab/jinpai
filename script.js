// Fill in the published Google Form URL after Apps Script creates it.
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScu6r_VGjeGBBNL773F_K30Dh9MPg0-4RPyr6s6bsKK8Craww/viewform";

document.querySelectorAll(".order-link").forEach((button) => {
  button.addEventListener("click", () => {
    // 優先抓取網址參數中的 code 或 coupon，若無則預設為 TAIJI1000
    const urlParams = new URLSearchParams(window.location.search);
    const coupon = urlParams.get('code') || urlParams.get('coupon') || "TAIJI1000";

    // 這是 Google 表單中「優惠碼」欄位的 Entry ID (範例，需替換)
    const couponFieldId = "entry.1118683510"; 

    if (!GOOGLE_FORM_URL) {
      window.location.hash = "offer";
      alert("Google 表單連結尚未設定。請先在 script.js 填入表單填寫網址，再正式開放下單。");
      return;
    }

    // 構建帶有參數的 URL，自動處理 ? 或 & 符號
    const url = new URL(GOOGLE_FORM_URL);
    url.searchParams.append(couponFieldId, coupon);
    const finalUrl = url.toString();

    window.open(finalUrl, "_blank", "noopener");
  });
});

// --- 實時下單通知邏輯 (行銷從眾效應) ---
const names = ["李*華", "陳*芬", "張*玲", "林*宏", "王*明", "趙*珠", "孫*強", "周*英", "蔡*穎", "許*安"];
const cities = ["台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市", "屏東縣", "彰化縣", "新竹市"];
const packages = ["3+1 團圓免運組", "單瓶體驗組", "2 瓶小資組", "3 瓶分享組"];

function updateToast() {
  const container = document.getElementById('toast-container');
  if (!container) return;

  // 隨機抽選資料
  const name = names[Math.floor(Math.random() * names.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const pkg = packages[Math.floor(Math.random() * packages.length)];

  // 更新 HTML 內容 (這會重新觸發 CSS 的 slideIn 動畫)
  container.innerHTML = `
    <div class="purchase-toast p-3 shadow-lg rounded-lg flex items-center space-x-3 text-xs md:text-sm">
        <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <i class="fas fa-shopping-bag"></i>
        </div>
        <div class="leading-tight">
            <span class="text-[10px] text-gray-400">最新訂單回報</span><br>
            來自${city}的 <span class="font-bold">${name}</span><br>
            剛剛購買了 <span class="text-amber-600 font-bold">${pkg}</span>
        </div>
    </div>
  `;

  // 設定下次更新時間 (8-15秒)
  const nextDelay = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
  setTimeout(updateToast, nextDelay);
}

// 頁面載入 5 秒後開始顯示第一則通知
setTimeout(updateToast, 5000);

// --- 限時優惠倒數計時器 ---
function initCountdown(minutes) {
    const display = document.querySelector('#countdown-timer');
    if (!display) return;

    // 嘗試從本地儲存讀取剩餘時間，若無則初始化
    let startTime = localStorage.getItem('taiji_timer_start');
    if (!startTime) {
        startTime = Date.now();
        localStorage.setItem('taiji_timer_start', startTime);
    }

    const totalSeconds = minutes * 60;

    setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        let timer = totalSeconds - (elapsed % totalSeconds);

        let mins = parseInt(timer / 60, 10);
        let secs = parseInt(timer % 60, 10);

        mins = mins < 10 ? "0" + mins : mins;
        secs = secs < 10 ? "0" + secs : secs;

        display.textContent = mins + ":" + secs;
    }, 1000);
}

initCountdown(15); // 設定 15 分鐘倒數

// --- 捲動顯現動畫觀察者 ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-active');
      // 如果希望動畫只跑一次，可以取消觀察
      // revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 }); // 當元素出現 20% 時觸發

document.querySelectorAll('.reveal-hidden').forEach(el => {
  revealObserver.observe(el);
});

// --- 真假辨識彈窗邏輯 ---
function openModal() {
    const modal = document.getElementById('comparison-modal');
    if (modal) modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 禁止底層滾動
}

function closeModal() {
    const modal = document.getElementById('comparison-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = ''; // 恢復滾動
}

// --- 放大鏡效果邏輯 ---
function magnify(imgID, zoom) {
  var img, glass, w, h, bw;
  img = document.getElementById(imgID);
  if (!img) return;

  /* 建立放大鏡元件 */
  glass = document.createElement("DIV");
  glass.setAttribute("class", "img-magnifier-glass");
  img.parentElement.insertBefore(glass, img);

  /* 設定背景圖片屬性 */
  glass.style.backgroundImage = "url('" + img.src + "')";
  glass.style.backgroundRepeat = "no-repeat";
  glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
  bw = 3;
  w = glass.offsetWidth / 2;
  h = glass.offsetHeight / 2;

  /* 滑鼠移動或觸控時執行的動作 */
  function moveMagnifier(e) {
    var pos, x, y;
    pos = getCursorPos(e);
    x = pos.x; y = pos.y;
    /* 確保放大鏡不超出圖片範圍 */
    if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
    if (x < w / zoom) {x = w / zoom;}
    if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
    if (y < h / zoom) {y = h / zoom;}
    /* 設定放大鏡位置 */
    glass.style.left = (x - w) + "px";
    glass.style.top = (y - h) + "px";
    /* 設定背景偏移量 */
    glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
  }

  function getCursorPos(e) {
    var a, x = 0, y = 0;
    e = e || window.event;
    a = img.getBoundingClientRect();

    // 取得座標，相容觸控點與滑鼠座標
    var pageX = (e.touches && e.touches.length > 0) ? e.touches[0].pageX : e.pageX;
    var pageY = (e.touches && e.touches.length > 0) ? e.touches[0].pageY : e.pageY;

    x = pageX - a.left - window.pageXOffset;
    y = pageY - a.top - window.pageYOffset;
    return {x : x, y : y};
  }

  /* 顯示/隱藏與事件監聽 */
  img.addEventListener("mousemove", moveMagnifier);
  img.addEventListener("mouseenter", () => {
    glass.style.display = "block";
    // 重新計算背景大小以因應響應式縮放
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
  });
  img.addEventListener("mouseleave", () => glass.style.display = "none");

  // 觸控支援 (行動端優化)
  img.addEventListener("touchstart", (e) => {
    if (e.cancelable) e.preventDefault(); // 防止觸控時捲動頁面影響檢視
    glass.style.display = "block";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    moveMagnifier(e);
  }, { passive: false });

  img.addEventListener("touchmove", (e) => {
    if (e.cancelable) e.preventDefault();
    moveMagnifier(e);
  }, { passive: false });

  img.addEventListener("touchend", () => {
    glass.style.display = "none";
  });
}

// 改用 DOMContentLoaded 確保互動功能在 HTML 解析完成後立即初始化
document.addEventListener("DOMContentLoaded", () => {
  magnify("main-product-img", 2);
});
