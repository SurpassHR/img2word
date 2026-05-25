import { useAppState } from './store'
import type { ImagesPerPage, ImageItem, LayoutMode } from './types'

interface PageCardProps {
  pageNumber: number
  pageImages: ImageItem[]
  imagesPerPage: ImagesPerPage
  layoutMode: LayoutMode
  startIndex: number
  endIndex: number
}

function getGrid(perPage: ImagesPerPage): { cols: number; rows: number } {
  switch (perPage) {
    case 1:
      return { cols: 1, rows: 1 }
    case 2:
      return { cols: 1, rows: 2 }
    case 3:
      return { cols: 1, rows: 3 }
    case 4:
      return { cols: 2, rows: 2 }
    case 5:
      return { cols: 1, rows: 5 }
    case 6:
      return { cols: 3, rows: 2 }
    default:
      return { cols: 1, rows: perPage }
  }
}

const LAYOUT_LABELS: Record<LayoutMode, string> = {
  grid: '网格',
  vertical: '垂直',
}

export default function LayoutPreview() {
  const { images, imagesPerPage, layoutMode } = useAppState()

  if (images.length === 0) return null

  const totalPages = Math.ceil(images.length / imagesPerPage)

  const pages = Array.from({ length: totalPages }, (_, i) => {
    const start = i * imagesPerPage
    return images.slice(start, start + imagesPerPage)
  })

  return (
    <div className="text-xs text-gray-500">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">
          排版预览
          <span className="ml-1.5 rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-medium text-blue-700">
            {LAYOUT_LABELS[layoutMode]}
          </span>
        </span>
        <span className="tabular-nums">
          {imagesPerPage} 张/页 · {images.length} 张图片 · 共 {totalPages} 页
        </span>
      </div>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {pages.map((pageImages, i) => (
          <PageCard
            key={i}
            pageNumber={i + 1}
            pageImages={pageImages}
            imagesPerPage={imagesPerPage}
            layoutMode={layoutMode}
            startIndex={i * imagesPerPage + 1}
            endIndex={i * imagesPerPage + pageImages.length}
          />
        ))}
      </div>
    </div>
  )
}

function PageCard({ pageNumber, pageImages, imagesPerPage, layoutMode, startIndex, endIndex }: PageCardProps) {
  const { cols, rows } = getGrid(imagesPerPage)
  const emptySlots = imagesPerPage - pageImages.length

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex flex-col overflow-hidden rounded border border-gray-300 bg-white p-1 shadow-sm"
        style={{ width: 'min(120px, 22vw)', aspectRatio: '1 / 1.414' }}
      >
        {layoutMode === 'vertical' ? (
          <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
            {pageImages.map((img) => (
              <div key={img.id} className="min-h-0 flex-1 overflow-hidden rounded-sm border border-gray-200">
                <img
                  src={img.preview}
                  alt={img.original.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-0 flex-1 rounded-sm border border-dashed border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        ) : (
          <div
            className="grid flex-1 gap-0.5 overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
            }}
          >
            {pageImages.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-sm border border-gray-200">
                <img
                  src={img.preview}
                  alt={img.original.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="rounded-sm border border-dashed border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        )}
      </div>
      <span className="whitespace-nowrap text-[11px] text-gray-400">
        第 {pageNumber} 页
        <span className="ml-1 text-gray-300">
          ({startIndex}-{endIndex})
        </span>
      </span>
    </div>
  )
}
