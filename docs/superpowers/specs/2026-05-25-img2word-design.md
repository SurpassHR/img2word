# img2word 设计规格

**日期**: 2026-05-25
**状态**: 已确认

## 概述

纯前端图片转 Word 文档工具。支持拖入/选择多张图片，浏览、排序、简单图像处理，设置每页图片张数，一键生成 .docx 文件。

## 架构决策

**纯前端方案**，理由：
- `docx` npm 包可在浏览器端生成 Word 文档
- Canvas API 覆盖全部图像处理需求
- 图片不离开浏览器，隐私安全，零服务器成本
- 静态文件部署即可

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | React 18 + TypeScript |
| 构建工具 | Vite |
| Word 生成 | `docx` npm |
| 图像处理 | Canvas API（原生） |
| 拖拽排序 | `@dnd-kit/core` |
| 图像裁剪 | `react-image-crop` |
| 样式 | Tailwind CSS + /frontend-design 输出 |

## 布局方案

工作台模式（左侧图片栏 + 右侧主面板），移动端侧栏折叠。

### 移动端适配（<768px）
- 侧栏折叠为左侧抽屉/底部浮层
- 编辑工具按钮仅图标
- 裁剪操作双指缩放/拖拽
- 排版预览纵向滚动

## 组件树

```
App — 根容器，持有全部状态
├── Toolbar
│   ├── ImagesPerPageSelector
│   └── ExportButton
├── Workspace
│   ├── ImageSidebar
│   │   ├── DropZone
│   │   ├── ImageList (dnd-kit 排序)
│   │   │   └── ImageThumbnail × N
│   │   └── SidebarToggle
│   └── MainPanel
│       ├── ImageViewer
│       ├── CropOverlay（条件渲染）
│       ├── ImageTools
│       │   ├── InvertButton
│       │   ├── GrayscaleButton
│       │   ├── RotateButton
│       │   ├── BrightnessSlider
│       │   └── ContrastSlider
│       └── LayoutPreview
```

## 核心数据模型

```typescript
interface AppState {
  images: ImageItem[]
  activeImageId: string | null
  sidebarOpen: boolean
  imagesPerPage: 1 | 2 | 4 | 6
  exportStatus: 'idle' | 'generating' | 'done'
}

interface ImageItem {
  id: string
  original: File
  preview: string           // createObjectURL
  edits: ImageEdits
}

interface ImageEdits {
  brightness: number        // 默认 100（百分比）
  contrast: number          // 默认 100（百分比）
  rotation: 0 | 90 | 180 | 270
  inverted: boolean
  grayscale: boolean
  crop: { x: number; y: number; width: number; height: number } | null  // 百分比坐标
}
```

## 数据流

1. **导入**: DropZone → File → FileReader → createObjectURL → 追加 `images[]`
2. **编辑**: 修改 `edits` → Canvas 实时重绘 → 更新 `preview`
3. **导出**: 遍历 `images[]` → Canvas 渲染（应用 edits）→ `docx` API 构建文档 → Blob 下载

## 功能清单

### 图片导入
- 拖入多张图片到侧栏放置区
- 点击打开文件选择器
- 仅接受 image/* 类型，非图片文件静默忽略

### 图片浏览
- 侧栏缩略图列表展示所有已导入图片
- 点击缩略图在主面板查看大图

### 拖拽排序
- 侧栏中拖拽缩略图调整图片顺序
- 顺序决定 Word 文档中的出现顺序

### 图像处理（作用于当前选中图片）
- **反色**: 一键翻转 RGB 通道
- **灰度化**: 转灰阶
- **旋转**: 90°/180°/270° 旋转
- **裁剪**: 可视化拖框裁剪，鼠标绘制裁剪区域
- **亮度**: 滑块调节
- **对比度**: 滑块调节
- 所有操作通过 Canvas API 实现，实时预览

### 排版设置
- 顶部工具栏选择每页图片数：1/2/4/6
- 全文档统一布局
- 排版预览区展示当前设置下的网格效果

### Word 导出
- 生成 .docx 文件并触发浏览器下载
- 页面设置：A4，默认边距
- 图片按 edits 处理后的最终效果嵌入
- 生成中按钮显示 loading 状态，禁用其他交互

## 边界情况处理

| 场景 | 处理 |
|---|---|
| 拖入非图片文件 | 静默忽略 |
| 单张图片 >50MB | 警告提示，不阻止 |
| 未导入图片即导出 | 按钮置灰 + tooltip |
| 无图片选中 | 主面板显示空状态引导文案 |
| 裁剪超界 | react-image-crop 自动约束 |
| >100 张图片 | 缩略图列表虚拟化渲染 |
| 移动端触屏 | dnd-kit 触屏传感器 |

## 部署

纯静态文件，托管到 GitHub Pages 或任意静态服务。
