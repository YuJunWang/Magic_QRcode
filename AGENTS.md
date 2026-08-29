# AGENTS.md — Magic Tree 3D AI 協同開發指南

本文件是為接手本專案的 AI Agent（如 Antigravity、Claude Code、Cursor、Windsurf 等）量身打造的架構綱領與行為規範。
在進行任何程式碼修改前，你必須先閱讀並嚴格遵守以下核心約束與架構原則。

---

## 1. 專案核心哲學與絕對不變性定理 (Critical Invariants)

⚠️ **以下鐵律嚴禁違反，違反將直接摧毀 2D 掃描功能或引起渲染崩潰：**

1. **純視角錯覺幾何 (Orthographic Perspective Illusion)**：
   - 所有的 3D 方塊在空間中水平座標 $(x, z)$ **永遠對齊 QR 模組網格**。
   - 2D 與 3D 的轉換純粹依靠正交相機角度切換（$\phi: 0.95\text{ rad} \leftrightarrow 0.0001\text{ rad}$），**嚴禁嘗試讓方塊在空間中進行實體位移變形（Physical Morphing）**。
2. **底層不變性定理 (Bottom-Layer Invariant)**：
   - 樹冠最底層 (`layer === baseDroop`) 與地面落花落葉層 (`y = 0.15`) **100% 實心保留，嚴禁加入隨機剔除 (Dropout)**。只有中上層與邊緣允許透氣微孔，以確保正交俯視下無任何幾何破洞。
3. **光學二值化對比鐵律 (Optical Luminance Invariant)**：
   - 手機 QR 掃描器依賴 Otsu 演算法進行二值化。深色模組之 ITU-R BT.601 相對亮度必須嚴格滿足：
     $$Y = 0.299R + 0.587G + 0.114B \le 0.30 \quad (\text{淺色底板 } Y \ge 0.95)$$
   - **禁止將深色方塊或冠頂高光調為亮色系**（如亮度 $> 0.35$），否則 2D 掃碼會全面失效。
4. **保證樹幹定錨 (Guaranteed Trunk Anchor)**：
   - QR 碼中心點有約 50% 機率為白（掩碼運算所致）。`VoxelSystem.tsx` 中的半徑擴展掃描定錨邏輯**不可移除**，否則會出現無幹空心樹。

---

## 2. 核心技術棧與檔案導覽 (Architecture Map)

- **前端框架**: React 19 + TypeScript + Vite + Tailwind CSS
- **3D 渲染**: Three.js + `@react-three/fiber` + `@react-three/drei` (全量 GPU `<Instances>`)
- **動畫運鏡**: `@gsap/react` + `gsap` (球面極座標弧線插值)
- **狀態管理**: `lz-string` (無後端 URL Hash 狀態序列化)
- **測試驗證**: Python + Playwright + `jsqr`

### 核心檔案職責劃分
- `src/components/3d/VoxelSystem.tsx`: 核心 3 階段生成演算法（地面落櫻層、樹幹板根基座、5 雲團有機蓬鬆樹冠、木漏れ日透氣微孔、5 階色彩漸變）。
- `src/components/3d/OrthoCamera.tsx`: GSAP 球面極座標弧線相機運鏡（$\phi: 0.95 \leftrightarrow 0.0001$）。
- `src/components/3d/SceneContainer.tsx`: 3D 場景光照系統、動態 Remount Key（`voxel-${size}-${text}-${theme}` 防 InstancedMesh 溢出）。
- `src/components/3d/TreeVoxel.tsx`: 單一體素方塊實例（Flat Axis-Aligned Slab）。
- `src/components/3d/TreeParticles.tsx`: 3D 景觀模式下的季節性飄落花瓣與樹葉粒子系統。
- `src/components/ui/Header.tsx`: 頂部品牌 Signature + 響應式網址輸入 Command Bar + 主題切換膠囊 + 分享與 PNG 匯出。
- `src/components/ui/ViewSwitch.tsx`: 底部懸浮控制島（`3D 景觀 / 2D 掃描` 切換、自動旋轉開關、花瓣粒子開關、網格解析度顯示）。
- `src/utils/themeConfig.ts`: 6 大主題光學校準色彩、Emissive 微光強度與色碼。
- `src/hooks/useUrlState.ts`: URL Hash 狀態同步與分享封裝（支援 `autoRotate`、`particlesEnabled`）。
- `src/hooks/useQRMatrix.ts`: 呼叫 `qrcode` 將文字轉為二維布林矩陣。

---

## 3. 開發規範與指令 (Development Commands)

- **啟動本機開發伺服器**：
  ```powershell
  npm run dev
  ```
- **TypeScript 檢查與建置**：
  ```powershell
  npm run build
  ```
- **全主題自動化掃碼測試**：
  ```powershell
  python scratch/all_themes_verify.py
  ```
  *(任何涉及 3D 結構、方塊色彩、光照、相機的修改，必須在本地跑通 6/6 主題 `DECODE_SUCCESS` 後才可提交)*

---

## 4. 常見禁忌與避坑指引 (Forbidden & Gotchas)

1. ❌ **禁止將 `ControlPanel.tsx` 重新掛載回 `App.tsx`**：該面板已廢棄，功能已完全整合至頂部 `Header`（Command Bar）與底部 `ViewSwitch`（控制島）。
2. ❌ **禁止改用直角座標 (XYZ) 進行相機補間**：必須使用球座標極角 $\phi$ 插值，否則在正頂點會發生萬向節死鎖（Gimbal Lock）與畫面驟縮。
3. ❌ **禁止在專案根目錄隨意新增臨時腳本**：所有臨時測試工具必須置於 `scratch/` 目錄。
4. ❌ **禁止破壞單一 Draw Call 架構**：不可將 `<TreeVoxel>` 改為獨立 `<mesh>`，必須保持在 `<Instances limit={10000}>` 內以維持手機端 60fps。

---

## 5. 主題擴充指南 (Adding New Themes)

若要新增第 7 個主題，請在 `src/utils/themeConfig.ts` 中新增設定，並嚴格遵循：
- `groundColor` / `lightModuleColor`: 亮度 $Y \ge 0.95$（白、米白、粉白等極淺色）
- `foliagePrimary` / `foliageSecondary` / `foliageAccent` / `foliageHighlight`: 亮度 $Y \le 0.30$
- `foliageEmissiveIntensity`: 建議設定在 $0.05 \sim 0.08$ 之間（搭配濃郁寶石色 `foliageEmissive`）
- 新增後務必執行 `scratch/all_themes_verify.py` 驗收。
