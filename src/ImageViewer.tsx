import type { ReactNode } from 'react'
import type { ImageEdits } from './types'

interface ImageViewerProps {
  preview: string
  alt: string
  edits: ImageEdits
  children?: ReactNode
}

export default function ImageViewer({ preview, alt, edits, children }: ImageViewerProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 p-4">
      <div className="relative flex max-h-full max-w-full items-center justify-center rounded-lg bg-white p-2 shadow">
        <img
          src={preview}
          alt={alt}
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
        {children}
      </div>
    </div>
  )
}
