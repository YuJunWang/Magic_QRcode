# ✨ Magic Tree 3D — 互動式 3D 魔法樹 QR Code 產生器

👉 **[快速預覽 / Live Demo](https://yujunwang.github.io/Magic_QRcode/)** 👈

> 一個基於 **React 19 + Three.js (React Three Fiber) + GSAP + Tailwind CSS** 的純前端 3D 體素樹 QR Code 產生器。
> 採用「正交投影錯覺 (Orthographic Projection Illusion)」：
> - **俯視 (Top-Down)**：100% 完美的二維平面 QR Code，相機直掃秒開。
> - **等角透視 (Isometric 3D)**：高度差交織出一棵立體生動的 3D 魔法樹與地景！

---

## 🌟 核心特色 (Key Features)

### 1. 🌲 經典 3 階段樹木程序化生成演算法 (3-Stage Procedural Tree Algorithm)
- **第 1 階段：地面基底層 (Ground Pass)**：白色像素轉化為米白雅緻地磚，黑色像素在樹冠下方點綴「落花落葉 (Fallen Petals)」，外圍點綴「草地叢 (Grass)」。
- **第 2 階段：實心垂直樹幹 (Vertical Trunk Columns)**：在樹木中心區域垂直堆疊木質樹幹，確保林下空間淨空。
- **第 3 階段：二次方拋物面樹冠 (Quadratic Dome Canopy)**：樹冠直接架高於樹幹之上，根據中心距離遞減形成圓拱穹頂，並帶有頂部隨機增生的自然層次。

### 2. 🌸 六大季節與自然主題 (Seasonal Themes)
- **🌸 春櫻魔法樹 (Spring Cherry Blossom)**：粉嫩櫻花與飄落花瓣。
- **🌲 夏翠松柏樹 (Summer Pine)**：翠綠針葉與沉穩樹冠。
- **🍁 金秋紅楓樹 (Autumn Maple)**：秋意盎然的楓紅落葉。
- **❄️ 冬霜覆雪樹 (Winter Frost & Snow)**：銀白覆雪的冬日寒木。
- **💎 幻彩水晶礦山 (Crystal Mine)**：晶瑩剔透的多面體紫晶。
- **🍵 日式枯山水苔玉 (Zen Karesansui)**：青苔石階與日式禪意。

### 3. 📷 雙視角無縫變焦引擎 (Orthographic Illusion Engine)
- **3D 欣賞模式 (3D Orbit View)**：45° 等角透視，支援自由環繞旋轉、縮放與自動慢轉。
- **垂直俯視掃描模式 (2D Scan Mode)**：一鍵無縫插值切換至 90° 垂直正交俯視，消除透視畸變，手機相機隨照即解碼！

### 4. 🔗 免後端 URL Hash 分享 (Stateless Sharing)
- 使用 `lz-string` 將使用者的輸入網址、主題等參數壓縮放進 `window.location.hash`。
- 複製網址即可直接分享給朋友，開啟即刻重現專屬 3D 樹木景觀。

### 5. 📸 高清 3D 寫真下載
- 支援一鍵擷取 WebGL 畫布匯出高品質 PNG 圖片。

---

## 🙏 致敬與靈感來源 (Credits & Inspiration)

本專案的核心 3D 視覺錯覺與樹木生成演算法靈感源自於：

- **原作者**：[Enzo Manuel Mangano](https://github.com/enzomanuelmangano)
- **原始專案**：[enzomanuelmangano/demos (cherry-blossom-qrcode)](https://github.com/enzomanuelmangano/demos/tree/main/src/animations/cherry-blossom-qrcode)
- **原創 Demo**：[tree.icqr.com](https://tree.icqr.com)

感謝 Enzo Manuel Mangano 分享這套極富創意與美感的 WebGPU 3D QR Code 視覺錯覺架構，我們將其重新移植為 Web 端的 React Three Fiber / Three.js 實作，並拓展了自適應網格縮放與多季節主題支援。

---

## 🛠️ 本地開發與運行 (Local Development)

```bash
# 1. 進入專案資料夾
cd E:\Project_AGY\Magic_QRcode

# 2. 安裝相依套件
npm install

# 3. 啟動本機開發伺服器
npm run dev
```

瀏覽器打開 `http://localhost:5173/` 即可即時體驗與測試！

---

## 🚀 部署至 GitHub Pages (Deploy to GitHub Pages)

本專案已配置自動化 CI/CD 流水線 (`.github/workflows/deploy.yml`)：
每次推播至 `main` 分支時，GitHub Actions 會自動執行 TypeScript 建置並將靜態檔案發佈至 GitHub Pages。

---

## 📦 技術棧一覽 (Tech Stack)

- **Framework**: React 19 + TypeScript + Vite (`base: './'`)
- **3D Engine**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Animation**: GSAP
- **Styling**: Tailwind CSS v4 + Lucide Icons + Glassmorphism UI
- **QR Core**: `qrcode` (Level H Error Correction)
- **Compression**: `lz-string`
- **Celebration**: `canvas-confetti`
