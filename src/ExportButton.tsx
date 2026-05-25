import { useCallback } from 'react'
import { useAppState, useAppDispatch } from './store'
import { applyEdits } from './imageEngine'
import { generateDocx, type ProcessedImage } from './docxGenerator'

export default function ExportButton() {
  const { images, imagesPerPage, layoutMode, exportStatus } = useAppState()
  const dispatch = useAppDispatch()

  const canExport = images.length > 0 && exportStatus !== 'generating'

  const handleExport = useCallback(async () => {
    if (!canExport) return

    dispatch({ type: 'SET_EXPORT_STATUS', payload: 'generating' })

    try {
      const processed: ProcessedImage[] = []

      for (const item of images) {
        const dataUrl = await processImage(item.preview, item.edits)
        const dimensions = await getImageDimensions(dataUrl)
        processed.push({ dataUrl, ...dimensions })
      }

      const blob = await generateDocx(processed, imagesPerPage, layoutMode)
      downloadBlob(blob, 'img2word.docx')

      dispatch({ type: 'SET_EXPORT_STATUS', payload: 'done' })
      setTimeout(() => {
        dispatch({ type: 'SET_EXPORT_STATUS', payload: 'idle' })
      }, 2000)
    } catch (err) {
      console.error('导出失败:', err)
      dispatch({ type: 'SET_EXPORT_STATUS', payload: 'idle' })
    }
  }, [canExport, images, imagesPerPage, layoutMode, dispatch])

  return (
    <button
      disabled={!canExport}
      onClick={handleExport}
      className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      title={images.length === 0 ? '请先导入图片' : undefined}
    >
      <span className="hidden sm:inline">
        {exportStatus === 'generating'
          ? '生成中...'
          : exportStatus === 'done'
            ? '已导出'
            : '导出 Word'}
      </span>
      <span className="sm:hidden">
        {exportStatus === 'generating' ? '...' : exportStatus === 'done' ? 'OK' : '导出'}
      </span>
    </button>
  )
}

function processImage(
  previewUrl: string,
  edits: import('./types').ImageEdits,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = applyEdits(img, edits)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = previewUrl
  })
}

function getImageDimensions(
  dataUrl: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error('获取图片尺寸失败'))
    img.src = dataUrl
  })
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
