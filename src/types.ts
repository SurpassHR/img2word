/** 裁剪区域（百分比坐标） */
export interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

/** 单张图片的图像处理参数 */
export interface ImageEdits {
  brightness: number // 默认 100（百分比）
  contrast: number // 默认 100（百分比）
  rotation: 0 | 90 | 180 | 270
  inverted: boolean
  grayscale: boolean
  crop: CropRect | null
}

/** 导入的图片条目 */
export interface ImageItem {
  id: string
  original: File
  preview: string // createObjectURL
  edits: ImageEdits
}

/** 每页图片数量 */
export type ImagesPerPage = 1 | 2 | 4 | 6

/** 导出状态 */
export type ExportStatus = 'idle' | 'generating' | 'done'

/** 全局应用状态 */
export interface AppState {
  images: ImageItem[]
  activeImageId: string | null
  sidebarOpen: boolean
  imagesPerPage: ImagesPerPage
  exportStatus: ExportStatus
}

/** 所有 dispatch action 的联合类型 */
export type Action =
  | { type: 'ADD_IMAGES'; payload: ImageItem[] }
  | { type: 'REMOVE_IMAGE'; payload: string }
  | { type: 'REORDER_IMAGES'; payload: { fromIndex: number; toIndex: number } }
  | { type: 'SET_ACTIVE_IMAGE'; payload: string | null }
  | { type: 'UPDATE_EDITS'; payload: { id: string; edits: Partial<ImageEdits> } }
  | { type: 'SET_IMAGES_PER_PAGE'; payload: ImagesPerPage }
  | { type: 'SET_EXPORT_STATUS'; payload: ExportStatus }
  | { type: 'TOGGLE_SIDEBAR' }

/** 图像编辑默认值 */
export const DEFAULT_EDITS: ImageEdits = {
  brightness: 100,
  contrast: 100,
  rotation: 0,
  inverted: false,
  grayscale: false,
  crop: null,
}
