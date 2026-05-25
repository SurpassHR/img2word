import { useState, useCallback } from 'react'
import { useAppState, useAppDispatch } from './store'
import type { ImageEdits, CropRect } from './types'
import ImageViewer from './ImageViewer'
import ImageTools from './ImageTools'
import CropOverlay from './CropOverlay'

export default function MainPanel() {
  const { images, activeImageId } = useAppState()
  const dispatch = useAppDispatch()
  const [isCropping, setIsCropping] = useState(false)

  const activeImage = images.find((img) => img.id === activeImageId) ?? null

  if (!activeImage) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <svg className="mx-auto mb-3 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">从左侧导入图片开始编辑</p>
          <p className="mt-1 text-xs text-gray-400">支持拖入或点击上传，支持 JPG / PNG / WebP 格式</p>
        </div>
      </main>
    )
  }

  const edits = activeImage.edits
  const update = (partial: Partial<ImageEdits>) =>
    dispatch({ type: 'UPDATE_EDITS', payload: { id: activeImage.id, edits: partial } })

  const handleCropToggle = useCallback(() => {
    setIsCropping((prev) => !prev)
  }, [])

  const handleCropApply = useCallback(
    (crop: CropRect | null) => {
      update({ crop })
      setIsCropping(false)
    },
    [activeImage.id],
  )

  const handleCropCancel = useCallback(() => {
    setIsCropping(false)
  }, [])

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* 图片预览区 / 裁剪覆盖层 */}
      {isCropping ? (
        <CropOverlay
          preview={activeImage.preview}
          initialCrop={edits.crop}
          onApply={handleCropApply}
          onCancel={handleCropCancel}
        />
      ) : (
        <ImageViewer preview={activeImage.preview} alt={activeImage.original.name} edits={edits} />
      )}

      {/* 图像编辑工具栏 */}
      <ImageTools
        edits={edits}
        isCropping={isCropping}
        onUpdate={update}
        onCropToggle={handleCropToggle}
      />

      {/* 排版预览区 */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <LayoutPreview />
      </div>
    </main>
  )
}

/** 根据当前排版设置的网格预览 */
function LayoutPreview() {
  const { images, imagesPerPage } = useAppState()

  if (images.length === 0) return null

  const cols = imagesPerPage <= 2 ? imagesPerPage : imagesPerPage === 4 ? 2 : 3

  return (
    <div className="text-xs text-gray-500">
      <span className="font-medium">排版预览</span>
      <span className="ml-2">
        {imagesPerPage} 张/页 · {images.length} 张图片 · 共 {Math.ceil(images.length / imagesPerPage)} 页
      </span>
      <div
        className="mt-2 grid gap-1 rounded border border-gray-200 bg-gray-50 p-1"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: imagesPerPage }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-[3/4] items-center justify-center rounded border border-dashed border-gray-300 bg-white text-[10px] text-gray-400"
          >
            {i < images.length ? `图${i + 1}` : '空'}
          </div>
        ))}
      </div>
    </div>
  )
}
