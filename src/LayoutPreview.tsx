import { useAppState } from './store'
import type { ImagesPerPage, ImageItem } from './types'

interface PageCardProps {
  pageNumber: number
  pageImages: ImageItem[]
  imagesPerPage: ImagesPerPage
  startIndex: number
  endIndex: number
}

function getGrid(perPage: ImagesPerPage): { cols: number; rows: number } {
  switch (perPage) {
    case 1:
      return { cols: 1, rows: 1 }
    case 2:
      return { cols: 1, rows: 2 }
    case 4:
      return { cols: 2, rows: 2 }
    case 6:
      return { cols: 3, rows: 2 }
  }
}

export default function LayoutPreview() {
  const { images, imagesPerPage } = useAppState()

  if (images.length === 0) return null

  const totalPages = Math.ceil(images.length / imagesPerPage)

  const pages = Array.from({ length: totalPages }, (_, i) => {
    const start = i * imagesPerPage
    return images.slice(start, start + imagesPerPage)
  })

  return (
    <div className="text-xs text-gray-500">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">排版预览</span>
        <span className="tabular-nums">
          {imagesPerPage} 张/页 · {images.length} 张图片 · 共 {totalPages} 页
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {pages.map((pageImages, i) => (
          <PageCard
            key={i}
            pageNumber={i + 1}
            pageImages={pageImages}
            imagesPerPage={imagesPerPage}
            startIndex={i * imagesPerPage + 1}
            endIndex={i * imagesPerPage + pageImages.length}
          />
        ))}
      </div>
    </div>
  )
}

function PageCard({ pageNumber, pageImages, imagesPerPage, startIndex, endIndex }: PageCardProps) {
  const { cols, rows } = getGrid(imagesPerPage)
  const emptySlots = imagesPerPage - pageImages.length

  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-1">
      {/* 模拟 A4 页面卡片 */}
      <div
        className="flex flex-shrink-0 flex-col rounded border border-gray-300 bg-white p-1.5 shadow-sm"
        style={{ width: 140, aspectRatio: '1 / 1.414' }}
      >
        <div
          className="grid flex-1 gap-0.5"
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
      </div>
      {/* 页码及图片范围 */}
      <span className="whitespace-nowrap text-[11px] text-gray-400">
        第 {pageNumber} 页
        <span className="ml-1 text-gray-300">
          ({startIndex}-{endIndex})
        </span>
      </span>
    </div>
  )
}
