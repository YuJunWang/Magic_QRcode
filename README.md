# Magic Tree 3D

👉 **[線上立即體驗 (Live Demo)](https://yujunwang.github.io/Magic_QRcode/)**

基於 React 19 與 Three.js 的 3D 體素樹 QR Code 產生器。

利用正交投影錯覺（Orthographic Projection Illusion）：
- **俯視角度 (2D)**：標準平面 QR Code，相機直接掃描解碼。
- **45 度等角 (3D)**：方塊高度差展開成一棵立體體素樹。

---

## 核心功能

1. **3 階段程序化生長**：地面地磚與落花 ➔ 垂直實心樹幹 ➔ 二次方拋物面樹冠。
2. **6 款季節與地景主題**：春櫻、松柏、紅楓、覆雪、水晶、枯山水。
3. **雙視角切換**：3D 旋轉欣賞與 2D 掃描模式即時過渡。
4. **狀態網址分享**：透過 `lz-string` 壓縮參數至 URL Hash，免後端直接分享。
5. **截圖匯出**：一鍵下載高解析度 WebGL 渲染圖。

---

## 本地運行

```bash
git clone https://github.com/YuJunWang/Magic_QRcode.git
cd Magic_QRcode
npm install
npm run dev
```

---

## 技術棧

- **Core**: React 19, TypeScript, Vite
- **3D / Motion**: Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP
- **UI**: Tailwind CSS v4, Lucide React
- **Utils**: `qrcode`, `lz-string`

---

## Credits

Inspired by [Enzo Manuel Mangano](https://github.com/enzomanuelmangano)'s [cherry-blossom-qrcode](https://github.com/enzomanuelmangano/demos/tree/main/src/animations/cherry-blossom-qrcode).
