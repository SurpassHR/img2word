import type { ImageEdits } from './types'

interface ImageToolsProps {
  edits: ImageEdits
  isCropping: boolean
  onUpdate: (partial: Partial<ImageEdits>) => void
  onCropToggle: () => void
}

export default function ImageTools({ edits, isCropping, onUpdate, onCropToggle }: ImageToolsProps) {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-2">
      <div className="flex flex-wrap items-center gap-2">
        {/* 旋转 90° */}
        <button
          onClick={() =>
            onUpdate({ rotation: ((edits.rotation + 90) % 360) as ImageEdits['rotation'] })
          }
          className="rounded p-1.5 text-gray-600 hover:bg-gray-100"
          aria-label="旋转 90°"
          title="旋转 90°"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* 反色 */}
        <button
          onClick={() => onUpdate({ inverted: !edits.inverted })}
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

        {/* 灰度 */}
        <button
          onClick={() => onUpdate({ grayscale: !edits.grayscale })}
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

        {/* 裁剪 */}
        <button
          onClick={onCropToggle}
          className={`rounded p-1.5 transition-colors ${
            isCropping ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-label="裁剪"
          title="裁剪"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16m-7 4h7m-7 4h7M6 14l-2 2 2 2" />
          </svg>
        </button>

        <div className="mx-1 h-6 w-px bg-gray-200" />

        {/* 亮度 */}
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          亮度
          <input
            type="range"
            min={0}
            max={200}
            value={edits.brightness}
            onChange={(e) => onUpdate({ brightness: Number(e.target.value) })}
            className="h-1 w-20 accent-blue-600"
          />
        </label>

        {/* 对比度 */}
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          对比度
          <input
            type="range"
            min={0}
            max={200}
            value={edits.contrast}
            onChange={(e) => onUpdate({ contrast: Number(e.target.value) })}
            className="h-1 w-20 accent-blue-600"
          />
        </label>
      </div>
    </div>
  )
}
