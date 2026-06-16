import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
    import io
except ImportError:
    print("請執行以下指令安裝必要套件： pip install pillow")
    print("若之後需要真實照片去背，請再安裝： pip install rembg")
    sys.exit(1)

# 設定路徑
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_FOLDER = os.path.join(BASE_DIR, '照片')

# 需要處理的 7 張圖片名稱
REQUIRED_IMAGES = [
    "產品主圖",
    "董事長照片",
    "專利設計特寫",
    "久坐上班族",
    "做家事腰背",
    "長輩日常保養",
    "登山戶外備用",
    "GMP證書",
    "專利證書",
    "產品細節_擠壓口",
    "產品細節_膏體質地",
    "用家實拍1",
    "用家實拍2",
    "產品封條特寫",
    "五行八卦概念圖",
    "生產流程_原料萃取",
    "生產流程_精密調配",
    "生產流程_品質檢驗",
    "適應症_蚊蟲叮咬",
    "社群_Threads截圖",
    "社群_TikTok熱門",
    "社群_IG穿搭質感",
    "社群_FB團購瘋搶",
    "適應症_舟車暈浪",
    "適應症_止痛止癢",
    "適應症_中暑暈眩",
    "適應症_感冒頭痛",
    "適應症_肚痛腹脹",
    "適應症_風溼筋痛",
    "適應症_刀傷創傷",
    "草本配方示意圖",
    "對比_傳統廣口瓶",
    "對比_金太極專利瓶",
    "成分_靈魂萃取",
    "成分_五行工藝",
    "成分_GMP品質",
    "成分_在地透明",
    "痛點_瓶口髒黏",
    "痛點_手指接觸",
    "痛點_交叉污染",
    "痛點_氧化變質",
    "痛點_清理麻煩",
    "痛點_攜帶沾染",
    "痛點_長輩難開",
    "痛點_用量難控",
    "痛點_低價混淆",
    "痛點_價值難辨",
    "製造商_廠房外觀",
    "成分_一條根特寫",
    "封條_安全撕毀對比",
    "專業推薦_醫師",
    "專業推薦_藥師",
    "醫藥認證標章"
]

def create_placeholder(name, path):
    """當找不到原始照片時，生成一張帶有文字的漂亮佔位圖"""
    # 根據不同用途設定不同顏色
    bg_color = (26, 71, 42) if "主圖" in name else (240, 240, 240)
    text_color = (255, 255, 255) if "主圖" in name else (80, 80, 80)
    
    img = Image.new('RGBA', (800, 600), color=bg_color)
    d = ImageDraw.Draw(img)
    
    # 嘗試載入系統中文字體，若失敗則使用預設字體
    font = None
    font_paths = [
        "msjh.ttc",        # Windows: 微軟正黑體
        "SourceHanSans-Regular.otf", 
        "Arial Unicode.ttf"
    ]
    
    for f_path in font_paths:
        try:
            font = ImageFont.truetype(f_path, 40)
            break
        except:
            continue

    # 簡單畫個框與文字
    d.rectangle([20, 20, 780, 580], outline=text_color, width=2)
    text = f"請放入：{name}\n(待處理照片)"
    
    # 在圖中間寫字
    if font:
        d.multiline_text((400, 300), text, fill=text_color, font=font, anchor="mm", align="center", spacing=10)
    else:
        # 備援方案：若無中文字體則顯示簡化訊息
        d.text((400, 300), f"IMAGE: {name}", fill=text_color, anchor="mm")
    
    img.save(path, "PNG")
    print(f"💡 已生成佔位圖: {name}.png (請之後替換為真實照片)")

def automate_image_processing():
    if not os.path.exists(IMAGE_FOLDER):
        print(f"📂 正在建立『照片』資料夾： {IMAGE_FOLDER}")
        os.makedirs(IMAGE_FOLDER)

    print("🚀 開始自動化圖片檢查與去背處理...")
    
    for name in REQUIRED_IMAGES:
        # 檢查是否存在 jpg 或 jpeg 原始檔
        jpg_path = os.path.join(IMAGE_FOLDER, f"{name}.jpg")
        jpeg_path = os.path.join(IMAGE_FOLDER, f"{name}.jpeg")
        png_path = os.path.join(IMAGE_FOLDER, f"{name}.png")
        
        source = None
        if os.path.exists(jpg_path): 
            source = jpg_path
        elif os.path.exists(jpeg_path): 
            source = jpeg_path
        
        if source:
            print(f"📦 正在處理: {name} (去背並轉存 PNG)...")
            try:
                from rembg import remove
                with open(source, 'rb') as i:
                    input_data = i.read()
                    output_data = remove(input_data)
                    
                    # 使用 PIL 進行裁切優化（去除多餘透明邊界，解決圖片在網頁中看起來縮小的問題）
                    img = Image.open(io.BytesIO(output_data))
                    bbox = img.getbbox()
                    if bbox:
                        img = img.crop(bbox)
                    
                    # 啟用優化壓縮，減少網頁圖片載入時間
                    img.save(png_path, "PNG", optimize=True)
                print(f"✅ 完成: {name}.png")
            except Exception as e:
                print(f"❌ 錯誤 ({name}): {e}")
        elif os.path.exists(png_path):
            print(f"ℹ️ 跳過: {name}.png 已存在")
        else:
            # 如果什麼都沒有，就生出一張圖讓網頁不會破掉
            create_placeholder(name, png_path)

    print("\n🎉 所有圖檔處理完畢！現在重新開啟 index.html 即可看到專業效果。")

if __name__ == "__main__":
    automate_image_processing()