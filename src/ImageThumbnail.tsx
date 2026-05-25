import type { ImageItem } from './types'

interface ImageThumbnailProps {
  image: ImageItem
  isActive: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export default function ImageThumbnail({
  image,
  isActive,
  onSelect,
  onDelete,
}: ImageThumbnailProps) {
  return (
    <li
      onClick={() => onSelect(image.id)}
      className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-colors ${
        isActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <img
        src={image.preview}
        alt={image.original.name}
        className="h-10 w-10 shrink-0 rounded object-cover"
      />
      <span className="min-w-0 flex-1 truncate text-xs">{image.original.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(image.id)
        }}
        className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
        aria-label={`删除 ${image.original.name}`}
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}
