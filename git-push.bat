@echo off
chcp 65001 >nul
echo ════════════════════════════════════════
echo  金牌一條根網路行銷 — 自動 push 腳本
echo ════════════════════════════════════════
cd /d "%~dp0"

echo [1/4] 修復 git index...
git reset 2>nul
if errorlevel 1 (
  del /f .git\index 2>nul
  git reset
)

echo [2/4] 加入修改的檔案...
git add index.html admin-dashboard.html admin-members.html admin-orders.html employee-dashboard.html order-tracking.html

echo [3/4] Commit...
git commit -m "patch v1.1: 官方查證、方案精簡、超商門市搜尋"

echo [4/4] Push 到 GitHub Pages...
git push origin main

echo.
echo ✅ 完成！請稍等 1~2 分鐘讓 GitHub Pages 更新
echo    網址：https://a860399-collab.github.io/jinpai/
pause
