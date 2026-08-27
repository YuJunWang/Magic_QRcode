# ✨ Magic QR 3D — 互動式 3D QR Code 景觀產生器

👉 **[快速預覽 / Live Demo](https://yujunwang.github.io/Magic_QRcode/)** 👈

> 一個基於 **React 19 + Three.js (React Three Fiber) + Tailwind CSS** 的純前端 3D QR Code 產生器，專為 **GitHub Pages (`github.io`)** 靜態託管打造，無需後端與資料庫即可實現 3D 視覺化與免後端 URL 分享。

---

## 🌟 核心特色 (Key Features)

### 1. 🪨 日式禪風枯山水與苔玉 (Zen Karesansui & Moss Garden)
- **墨綠絨毛苔玉球 & 河卵石**：利用 `InstancedMesh` 批次實例化數百顆帶有微小隨機高低與色澤差異的有機苔玉球與黑色河卵石。
- **白砂耙紋地盤 (Sand Plate)**：細緻象牙白砂盤，刻劃出同心圓與平直水波 rake mark。
- **中央石燈籠 (Stone Lantern)**：精緻低多邊形日式春日石燈籠，火袋內置微光呼吸火焰。
- **微風落葉特效**：隨機落下的青翠竹葉與粉櫻花瓣。

### 2. 💎 幾何水晶礦石花園 (Geometric Crystal & Gem Garden)
- **六角稜柱晶簇 (Hexagonal Crystal Clusters)**：銳利幾何多面體水晶，搭配玻璃透光折射與高光清漆材質（`MeshPhysicalMaterial`）。
- **黑曜石地脈 (Obsidian Bedrock)**：消光金屬質感的深邃黑曜石地盤與發光導軌。
- **中央懸浮母礦 (Floating Geode Core)**：懸浮半空緩慢自轉的多面體核心與內部高能脈衝光。
- **星芒火花微粒**：緩慢向上升騰的晶石閃爍粒子。

### 3. 📷 雙鏡頭引擎 (Dual-Camera Engine)
- **3D 欣賞模式 (Orbit Mode)**：360° 自由環繞旋轉、縮放與傾斜，自適應慢速自轉。
- **垂直俯視掃描模式 (Scan Mode)**：一鍵平滑動畫插值轉換至 90° 垂直正交視角，自動補足向下強光並消除透視變形，**手機相機秒掃秒開**！

### 4. 🔗 免後端 URL Hash 分享 (Stateless Sharing)
- 使用 `lz-string` 將使用者的輸入網址、主題、高度、密度等參數完全壓縮放進 `window.location.hash`。
- 複製產生的網址即可直接分享給朋友，開啟即刻重現專屬 3D 景觀。

### 5. 📸 高清 3D 寫真下載
- 支援一鍵擷取 WebGL 畫布匯出高解析度透明/有底 PNG 圖檔。

---

## 🛠️ 本地開發與運行 (Local Development)

```bash
# 1. 進入專案資料夾
cd E:\Project_AGY\Magic_QRcode

# 2. 安裝相依套件 (若尚未安裝)
npm install

# 3. 啟動本機開發伺服器
npm run dev
```

瀏覽器打開 `http://localhost:5173/` 即可即時體驗與測試！

---

## 🚀 部署至 GitHub Pages (Deploy to GitHub Pages)

本專案已配置完整的自動化 CI/CD 流水線 (`.github/workflows/deploy.yml`)：

1. 在 GitHub 上建立一個新的公開儲存庫（Repository），例如 `magic-qrcode`。
2. 將本機代碼初始化並推送至 GitHub：
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of 3D Magic QR generator"
   git branch -M main
   git remote add origin https://github.com/<你的帳號>/magic-qrcode.git
   git push -u origin main
   ```
3. 在 GitHub 儲存庫的 **Settings** -> **Pages** 中，將 **Source** 設定為 **GitHub Actions**。
4. Actions 工作流程完成後，專案即可在 `https://<你的帳號>.github.io/magic-qrcode/` 即刻上線！

---

## 📦 技術棧一覽

- **Framework**: React 19 + TypeScript + Vite (`base: './'`)
- **3D Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Styling**: Tailwind CSS v4 + Lucide Icons + Glassmorphism UI
- **QR Core**: `qrcode` (Level H Error Correction)
- **Compression**: `lz-string`
- **Celebration**: `canvas-confetti`
