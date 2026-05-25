import type { ImageItem } from './types'
import ImageThumbnail from './ImageThumbnail'

interface ImageListProps {
  images: ImageItem[]
  activeImageId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export default function ImageList({
  images,
  activeImageId,
  onSelect,
  onDelete,
}: ImageListProps) {
  if (images.length === 0) {
    return <p className="mt-8 text-center text-xs text-gray-400">暂无图片</p>
  }

  return (
    <ul className="space-y-1.5">
      {images.map((img) => (
        <ImageThumbnail
          key={img.id}
          image={img}
          isActive={img.id === activeImageId}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
