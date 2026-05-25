import { useAppState, useAppDispatch } from './store'
import type { ImageEdits } from './types'

export default function MainPanel() {
  const { images, activeImageId } = useAppState()
  const dispatch = useAppDispatch()

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

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {/* 图片预览区 */}
      <div className="flex flex-1 items-center justify-center bg-gray-100 p-4">
        <div className="flex max-h-full max-w-full items-center justify-center rounded-lg bg-white p-2 shadow">
          <img
            src={activeImage.preview}
            alt={activeImage.original.name}
            className="max-h-[60vh] max-w-full object-contain"
            style={{
              filter: `
                brightness(${edits.brightness}%)
                contrast(${edits.contrast}%)
                grayscale(${edits.grayscale ? 1 : 0})
                invert(${edits.inverted ? 1 : 0})
              `,
              transform: `rotate(${edits.rotation}deg)`,
            }}
          />
        </div>
      </div>

      {/* 图像编辑工具栏 */}
      <div className="border-t border-gray-200 bg-white px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* 旋转按钮 */}
          <button
            onClick={() =>
              update({ rotation: ((edits.rotation + 90) % 360) as ImageEdits['rotation'] })
            }
            className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
            aria-label="旋转 90°"
            title="旋转 90°"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* 反色按钮 */}
          <button
            onClick={() => update({ inverted: !edits.inverted })}
            className={`rounded p-1.5 transition-colors ${
              edits.inverted ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="反色"
            title="反色"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          {/* 灰度按钮 */}
          <button
            onClick={() => update({ grayscale: !edits.grayscale })}
            className={`rounded p-1.5 transition-colors ${
              edits.grayscale ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="灰度化"
            title="灰度化"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <circle cx="12" cy="12" r="6" fill="currentColor" opacity={0.3} />
            </svg>
          </button>

          <div className="mx-1 h-6 w-px bg-gray-200" />

          {/* 亮度滑块 */}
          <label className="flex items-center gap-1.5 text-xs text-gray-500">
            亮度
            <input
              type="range"
              min={0}
              max={200}
              value={edits.brightness}
              onChange={(e) => update({ brightness: Number(e.target.value) })}
              className="h-1 w-20 accent-blue-600"
            />
          </label>

          {/* 对比度滑块 */}
          <label className="flex items-center gap-1.5 text-xs text-gray-500">
            对比度
            <input
              type="range"
              min={0}
              max={200}
              value={edits.contrast}
              onChange={(e) => update({ contrast: Number(e.target.value) })}
              className="h-1 w-20 accent-blue-600"
            />
          </label>
        </div>
      </div>

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
