---
title: "Magic Tree 3D (3D 魔法樹 QR Code 視覺錯覺產生器)"
description: "記錄 Magic Tree 3D 的完整架構演進、Enzo 3 階段樹木演算法移植、GSAP 球面相機運鏡、光學對比度校準與 Agent 協作開發流程。"
type: project
tags:
  - "#project"
  - "#my-project"
  - "#threejs"
  - "#r3f"
  - "#webgl"
  - "#qrcode"
  - "#gsap"
  - "#optical-illusion"
  - "#agentic_engineering"
timestamp: "2026-08-28T15:35:00+08:00"
---

# Magic Tree 3D (3D 魔法樹 QR Code 視覺錯覺產生器)

## 📊 同步狀態 (Sync Status)
> [!info] 
> **GitHub Repo**: [YuJunWang/Magic_QRcode](https://github.com/YuJunWang/Magic_QRcode)  
> **線上體驗 Live Demo**: [https://yujunwang.github.io/Magic_QRcode/](https://yujunwang.github.io/Magic_QRcode/)  
> **最新穩定版 Commit**: `7c78deb`  
> **原創概念靈感**: [Enzo Manuel Mangano / demos](https://github.com/enzomanuelmangano/demos)

- **作者 / 專案負責人**: [[Yu-Jun Wang]]
- **專案狀態**: V3.5 穩定版（已完成光學校準、球面相機運鏡與 6 大主題自動化驗收）
- **核心技術棧**: React 19, TypeScript, Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), GSAP (`@gsap/react`), Tailwind CSS, Vite, `qrcode`, `lz-string`, `jsqr`, Playwright

---

## 💡 專案核心哲學：橫看成嶺側成峰

**Magic Tree 3D** 是一個結合 **3D 體素幾何雕塑 (Voxel Art)** 與 **2D 矩陣光學錯覺 (Optical Illusion)** 的互動網頁應用。

- **3D 欣賞模式 (Isometric Orbit View, 54.4° 俯角)**：使用者看見的是一棵高低錯落、枝繁葉茂、帶有板根扎根基座與微孔透氣感的多重雲狀盆景樹，花瓣與落葉於林間飄灑。
- **2D 掃描模式 (Orthographic Top-Down View, 0.0001° 垂直正交俯視)**：透過正交相機完全消除透視畸變，三維立體方塊在二維平面上瞬間無縫拼合成一張高對比、完全符合 ISO/IEC 18004 規範且 **100% 可被任何智慧型手機相機秒識別** 的標準 QR Code。

```
       [ 3D 視角：等角透視立體樹 ]
                / \
               /   \  (多層次雲團、板根樹幹、落櫻地表)
              /_____\
                 |
                 | GSAP 球面極座標弧線過渡 (power4.inOut)
                 v
       [ 2D 視角：垂直正交二維矩陣 ]
            ┌─────────┐
            │ █ █ █ █ │
            │ █ ▄▄▄ █ │  (消除幾何間隙，光學亮度 Y <= 0.30)
            │ █ █ █ █ │
            └─────────┘
```

---

## 📖 前世今生與技術典範轉移 (The Evolution)

### 1. 前世：物理方塊位移變形 (Physical Voxel Morphing) 的瓶頸
在專案初期 (v1.0 ~ v2.0)，系統嘗試透過 GSAP 將幾千個三維方塊的 `position: [x, y, z]` 在「樹狀座標」與「扁平 QR 碼座標」之間進行物理平移與縮放。
- **致命痛點**：
  1. **效能瓶頸**：37×37 網格可能產生超過 6,000 個方塊，即時進行大量 `Instance` 矩陣運算會造成低階裝置掉幀。
  2. **錯位破圖**：物理位移過程只要有微小的浮點數誤差，方塊邊界就會出現縫隙（Gaps），導致手機掃碼器無法將模組判定為連續色塊。

### 2. 今生：正交投影純視角錯覺 (Orthographic Perspective Illusion)
受 Enzo Manuel Mangano 的 WebGPU 原型啟發，我們在 v3.0 進行了徹底的技術典範轉移：
- **方塊在三維空間中「永遠不需要移動」**。
- 樹木結構中的每一個方塊，其 $(x, z)$ 水平座標從誕生起就**精確對齊 QR 碼的深色模組網格**。
- 透過控制正交相機（Orthographic Camera）的視角旋轉（$\phi: 54.4^\circ \leftrightarrow 0.0001^\circ$），利用光學投影原理自然消除高度差。樹與 QR Code 的變換**純粹是一場幾何視角魔術**，運算成本降為近乎零，且保證 2D 視角下 100% 緊密無縫。

---

## 🛠️ 開發階段與關鍵突破 (Engineering Milestones)

### Phase 1: Enzo 3 階段樹木生成演算法移植與自適應網格
我們將原創 WebGPU 演算法成功改寫為 React Three Fiber / TypeScript 實作，並拓展為支援任意 URL 長度（自動適應 21×21 至 45×45 網格）的動態演算法：

1. **Stage 1 (地面層 Ground Pass)**：
   - 鋪設高亮度明色地磚（交替色調消弭單調感）。
   - 繪製 3 處大尺寸尋標圖案 (Finder Patterns) 強化辨識基底。
   - 於樹冠投影邊界外生成外圍矮灌木 (`grassBase` / `grassDark`)；於樹冠下方鋪設飄落花瓣層 (`y = 0.15 ~ 0.25`)，營造落櫻堆疊地景。
2. **Stage 2 (樹幹層 Trunk Pass & 保證定錨)**：
   - **QR 遮罩隨機性防禦 (Guaranteed Anchor)**：QR 碼因掩碼運算，中心點 `(0, 0)` 有約 50% 機率為白色。演算法實作了半徑擴展掃描，保證在中心附近自動鎖定最近的深色模組作為核心樹幹，杜絕「無幹空心樹」現象。
   - **板根扎根基座 (Buttress Root Flare)**：在樹幹基座周圍（僅限深色模組）加入快速指數遞減的根部擴展，使樹木接地處呈現穩固外擴的扎根感，隨後向上俐落收斂為主幹。
3. **Stage 3 (樹冠層 Canopy Pass)**：
   - 依據 URL 字串的雜湊值（Deterministic Hash）動態生成 5 顆多重雲狀葉團（1 頂冠 + 4 衛星雲團），確保每個網址長出獨一無二的專屬樹形。

---

### Phase 2: GSAP 球面極座標弧線相機運鏡 (Spherical Orbit Transition)
傳統線性三軸插值（Linear XYZ Tweening）在經過頂點時會產生穿模、視角縮放驟變與萬向節死鎖（Gimbal Lock）。
- **解法**：導入 `@gsap/react`，改採**球面極座標系統 (Spherical Coordinates)**：
  $$\begin{cases}
  x = R \cdot \sin(\phi) \cdot \cos(\theta) \\
  y = R \cdot \cos(\phi) \\
  z = R \cdot \sin(\phi) \cdot \sin(\theta)
  \end{cases}$$
- 將極角 $\phi$ 從 3D 模式的 $0.95\text{ rad}$（約 $54.4^\circ$）平滑插值至 2D 模式的 $0.0001\text{ rad}$（微小偏角避開正頂點奇異點），搭配 `power4.inOut` 緩動曲線，實現電影運鏡般的流暢俯衝與升空體驗。

---

### Phase 3: 光學校準與 2D 掃碼可靠性攻堅 (Optical Luminance Calibration)
在多主題測試時，發現夏翠、金秋、冬霜、水晶等主題在 2D 模式下無法被手機識別。
- **根因分析**：手機 QR 掃描器（如 iOS Camera、Google Lens、jsQR）使用 **Otsu 演算法** 進行影像二值化。先前主題的冠頂高光色亮度過高（$Y > 0.50$），在二值化門檻計算中被誤判為「白色/淺色模組」，造成矩陣資料損毀。
- **光學校準規範**：
  深色模組之 ITU-R BT.601 相對亮度 $Y$ 必須嚴格受控：
  $$Y = 0.299R + 0.587G + 0.114B \le 0.30 \quad (\text{淺色底板 } Y \ge 0.95)$$
- **解決方案**：全面重構 6 大主題色彩，採用深邃濃郁的寶石調（Jewel Tones），並編寫基於 Playwright + jsQR 的自動化測試腳本，達成 **6/6 全主題 100% 掃碼通過驗證**。

---

### Phase 4: 多階連續漸變與自然微光 (Multi-Stop Gradient & Delicate Emissive)
為了解決純色材質在 3D 模式下顯得單調或 Emissive 自發光過曝變為「整棵螢光粉紅」的問題：
1. **微光層 (Subtle Radiance)**：將 `emissiveIntensity` 收斂至 $0.05 \sim 0.08$，並選用深濃的寶石色 Emissive，保留明暗深淺反差。
2. **多因子色階插值 (5-Stop Shading)**：
   綜合「垂直高度 $h$」、「葉團頂點係數 $L$」與「向陽面係數 $sun$」計算複合著色值 $V$：
   $$V = 0.48h + 0.34L + 0.18sun + \text{noise}$$
   方塊於 `深處陰影 (leafRich)` $\to$ `核心枝葉` $\to$ `飽滿本色` $\to$ `向陽高光` $\to$ `頂冠嫩尖 (leafHighlight)` 之間平滑漸變。
3. **木漏れ日透氣微孔 (Airy Dropout)**：
   在樹冠中上層與邊緣加入 $0.040 \sim 0.085$ 的確定性微孔剔除，營造陽光穿透葉縫的自然負空間；同時嚴格將最底層維持 $100\%$ 實心，確保 2D 投影零漏洞。

---

### Phase 5: 極簡工藝感介面重塑 (Studio UI Redesign)
- **視覺去 AI 化**：移除過去過度使用的厚重磨砂玻璃（Glassmorphism）、巨大按鈕與 Emoji 裝飾，改為極簡現代的 Studio 專業介面。
- **命令列與懸浮控制島**：
  - 頂部：品牌 Signature + 網址輸入 Command Bar（手機端自適應為全寬輸入列）+ 季節主題膠囊 + 分享與匯出按鈕。
  - 底部：`3D 景觀 / 2D 掃描` 分段切換器 + 自動旋轉與花瓣粒子開關 + 網格解析度即時監控（如 $37\times37$）。
- **零後端狀態封裝 (Zero-Backend State Sync)**：
  利用 `lz-string` 將網址、主題、自動旋轉、粒子等參數完全壓縮編碼於 URL Hash 中（如 `https://.../#EQGw...`），無需任何資料庫即可實現「開箱即重現」的永久分享連結。

---

## 🧰 開發過程調用之專業技能庫 (Skills & Toolchains)

本專案在開發過程中深度調用了多項領域專業技能，體現了高結構化的 Agentic 協同工作流：

| 技能名稱 | 應用環節與具體貢獻 |
|:---|:---|
| `gsap-react` / `gsap-core` | 實作正交相機的球面極座標弧線插值運鏡，處理相機 `useGSAP` 生命週期與 `dependencies` 同步。 |
| `ui-ux-pro-max` / `frontend-design` | 指導 UI 改造，定義 Minimalist Studio 色彩層次、響應式 Command Bar 與沉浸式懸浮控制島。 |
| `humanizing-ai-text` | 進行 README 與對外說明的 Level 2 高效去 AI 化編寫，維持精準明快的工程語調。 |
| `brainstorming` / `/grill-me` | 於樹冠造型設計階段展開架構訪談，確立多重雲團（Multi-Lobe）與網址雜湊驅動的技術路線。 |
| `systematic-debugging` | 深入分析 Otsu 二值化閾值失效問題，推導 $Y \le 0.30$ 光學校準公式；排查相機 Ref 初始狀態跳動 Bug。 |
| `verification-before-completion` | 貫徹「證據先於結論」原則，使用 Playwright + jsQR 進行全主題無頭截圖與解碼驗證。 |
| `global-wiki-query` | 查詢全域圖書館架構規範，確保跨專案知識隔離與草稿產出合規性。 |

---

## 🏛️ 重要架構決策與實戰經驗 (Architectural Lessons)

1. **InstancedMesh 動態 Remount 機制**：
   Three.js 的 `InstancedMesh` 在初始化後無法輕易動態變更 Buffer 上限。當使用者輸入較長網址導致 QR 碼從 $21\times21$ 變為 $41\times41$ 時，方塊數量可能翻倍。我們在 `SceneContainer` 中為 `<VoxelSystem>` 綁定動態 `key={`voxel-${qrData.size}-${settings.text}-${settings.theme}`}`，強制在網格尺寸變更時乾淨重建幾何實例，徹底避免 Buffer Overflow 崩潰。
2. **底層不變性定理 (Bottom-Layer Invariant)**：
   在三維空間中進行任何透氣微孔（Dropout）、高低起伏（Dome Offset）或枝葉修剪時，**只要保證最底部的第 0 層方塊或地面落瓣層 100% 存在**，正交相機由上往下看就永遠是實心色塊。此一定理成為平衡「3D 豐富造型」與「2D 掃碼剛性需求」的核心基石。
3. **無損無依賴的狀態分享**：
   避免為了單純的展示功能引入 Firebase 或後端 API。利用 LZ-based 壓縮將完整 App 狀態封裝進 URL Hash，大幅降低維護成本與架設門檻。

---

## 🔮 未來維護與演進方向 (Future Directions)

1. **動態四季時間線 (Dynamic Seasonal Timeline)**：
   支援依據真實時間或滑桿，平滑過渡春、夏、秋、冬之樹葉色相與飄落粒子。
2. **3D 實體模型匯出 (GLTF / STL 3D Print Export)**：
   支援將專屬的 3D QR 體素樹匯出為 3D 列印檔案，實現實體雕塑展示與手機掃描。
3. **客製化自訂調色盤 (Custom Color Palette Builder)**：
   提供進階調色面板，並於前端即時進行 Otsu 對比度安全檢查，允許使用者創造個人化主題。

---

## 📚 相關知識節點
- [[Agentic Web Development]]
- [[Design Tokens as Semantic Roles]]
- [[Evidence-based Verification]]
- [[Context Engineering]]
- [[Yu-Jun Wang]]
