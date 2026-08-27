# ✨ Magic Tree 3D — 互動式 3D 魔法樹 QR Code 產生器

👉 **[快速預覽 / Live Demo](https://yujunwang.github.io/Magic_QRcode/)** 👈

一個基於 **React 19 + Three.js (React Three Fiber) + GSAP + Tailwind CSS** 的純前端 3D 體素樹 QR Code 產生器。

利用「正交投影錯覺 (Orthographic Projection Illusion)」實現：
- 🔍 **俯視 (Top-Down)**：100% 平面 QR Code，手機相機秒掃秒開。
- 🌳 **等角透視 (Isometric 3D)**：高度差交織成立體生動的 3D 魔法樹景觀。

---

## 🌟 核心特色 (Key Features)

- **🌲 3 階段樹木程序化生成演算法**：地面基底層（泥土磚/落花/草地）➔ 實心垂直樹幹 ➔ 二次方拋物面樹冠。
- **🌸 六大季節與自然主題**：春櫻、夏翠松柏、金秋紅楓、冬霜覆雪、幻彩水晶、日式枯山水。
- **📷 雙視角無縫變焦**：一鍵在 3D 欣賞模式與 2D 俯視掃描模式之間流暢切換。
- **🔗 免後端 URL Hash 分享**：透過 `lz-string` 壓縮狀態至網址 Hash，複製即可分享。
- **📸 3D 寫真下載**：一鍵截圖匯出高畫質 WebGL 渲染圖檔。

---

## 🙏 Credits

Inspired by [Enzo Manuel Mangano](https://github.com/enzomanuelmangano)'s [cherry-blossom-qrcode](https://github.com/enzomanuelmangano/demos/tree/main/src/animations/cherry-blossom-qrcode).

---

## 🛠️ 本地開發 (Local Development)

```bash
git clone https://github.com/YuJunWang/Magic_QRcode.git
cd Magic_QRcode
npm install
npm run dev
```

---

## 📦 技術棧 (Tech Stack)

- **Framework**: React 19, TypeScript, Vite
- **3D & Animation**: Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP
- **Styling**: Tailwind CSS v4, Lucide Icons
- **QR Core**: `qrcode` (Level H), `lz-string`
