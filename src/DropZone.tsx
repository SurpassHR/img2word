import { useCallback, useRef } from 'react'

interface DropZoneProps {
  onFiles: (files: FileList | File[]) => void
}

export default function DropZone({ onFiles }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onFiles(e.dataTransfer.files)
    },
    [onFiles],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) onFiles(e.target.files)
      e.target.value = ''
    },
    [onFiles],
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => fileInputRef.current?.click()}
      className="m-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-3 text-sm text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-500"
    >
      <svg className="mb-1 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-xs">拖入图片或点击选择</span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
