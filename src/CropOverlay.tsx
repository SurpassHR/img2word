import { useState, useCallback, useRef } from 'react'
import ReactCrop, { type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import type { CropRect } from './types'

interface CropOverlayProps {
  preview: string
  initialCrop: CropRect | null
  onApply: (crop: CropRect | null) => void
  onCancel: () => void
}

/** 将百分比裁剪转为像素裁剪 */
function percentToPixel(
  crop: CropRect,
  containerWidth: number,
  containerHeight: number,
): PixelCrop {
  return {
    x: (crop.x / 100) * containerWidth,
    y: (crop.y / 100) * containerHeight,
    width: (crop.width / 100) * containerWidth,
    height: (crop.height / 100) * containerHeight,
    unit: 'px',
  }
}

/** 将像素裁剪转为百分比裁剪 */
function pixelToPercent(
  crop: PixelCrop,
  containerWidth: number,
  containerHeight: number,
): CropRect {
  return {
    x: (crop.x / containerWidth) * 100,
    y: (crop.y / containerHeight) * 100,
    width: (crop.width / containerWidth) * 100,
    height: (crop.height / containerHeight) * 100,
  }
}

export default function CropOverlay({ preview, initialCrop, onApply, onCancel }: CropOverlayProps) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [crop, setCrop] = useState<PixelCrop | undefined>(undefined)
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null)

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget
      imgRef.current = img
      const { naturalWidth, naturalHeight } = img

      // 使用 CSS 布局后的实际显示尺寸计算比例
      const displayW = naturalWidth
      const displayH = naturalHeight
      setContainerSize({ w: displayW, h: displayH })

      if (initialCrop) {
        setCrop(percentToPixel(initialCrop, displayW, displayH))
      }
    },
    [initialCrop],
  )

  const handleChange = useCallback((c: PixelCrop) => {
    setCrop(c)
  }, [])

  const handleComplete = useCallback((c: PixelCrop) => {
    setCrop(c)
  }, [])

  const handleApply = () => {
    if (!crop || !containerSize || !crop.width || !crop.height) {
      onApply(null)
      return
    }
    onApply(pixelToPercent(crop, containerSize.w, containerSize.h))
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-h-[60vh] max-w-full overflow-auto rounded-lg bg-white p-2 shadow">
        <ReactCrop
          crop={crop}
          onChange={handleChange}
          onComplete={handleComplete}
          className="max-w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="裁剪预览"
            onLoad={onImageLoad}
            className="max-h-[55vh] max-w-full object-contain"
          />
        </ReactCrop>
      </div>

      {/* 操作按钮 */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleApply}
          disabled={!crop?.width || !crop?.height}
          className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          应用裁剪
        </button>
        <button
          onClick={onCancel}
          className="rounded border border-gray-300 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
        >
          取消
        </button>
      </div>
    </div>
  )
}
