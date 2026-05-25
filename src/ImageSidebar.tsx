import { useCallback, useRef } from 'react'
import { useAppState, useAppDispatch } from './store'
import { DEFAULT_EDITS } from './types'

export default function ImageSidebar() {
  const { images, activeImageId, sidebarOpen } = useAppState()
  const dispatch = useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
      if (imageFiles.length === 0) return

      const newImages = imageFiles.map((file) => ({
        id: crypto.randomUUID(),
        original: file,
        preview: URL.createObjectURL(file),
        edits: { ...DEFAULT_EDITS },
      }))
      dispatch({ type: 'ADD_IMAGES', payload: newImages })
    },
    [dispatch],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const toggle = () => dispatch({ type: 'TOGGLE_SIDEBAR' })

  return (
    <>
      {/* 移动端遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={toggle}
        />
      )}

      {/* 侧栏本体 */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed top-[49px] bottom-0 left-0 z-30 flex flex-col border-r border-gray-200 bg-white transition-transform duration-200 md:static md:top-0 md:translate-x-0 md:shrink-0 ${
          sidebarOpen ? 'w-64' : 'md:w-10'
        }`}
      >
        {/* 桌面端折叠切换按钮 */}
        <button
          onClick={toggle}
          className="absolute -right-3 top-4 z-40 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-[10px] shadow-sm hover:bg-gray-50 md:flex"
          aria-label={sidebarOpen ? '折叠侧栏' : '展开侧栏'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* 侧栏内容 — 折叠时隐藏 */}
        {sidebarOpen && (
          <>
            {/* 拖拽放置区 */}
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
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>

            {/* 图片缩略图列表 */}
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              {images.length === 0 ? (
                <p className="mt-8 text-center text-xs text-gray-400">暂无图片</p>
              ) : (
                <ul className="space-y-1.5">
                  {images.map((img) => (
                    <li
                      key={img.id}
                      onClick={() => dispatch({ type: 'SET_ACTIVE_IMAGE', payload: img.id })}
                      className={`flex items-center gap-2 rounded-lg border p-2 cursor-pointer transition-colors ${
                        img.id === activeImageId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img.preview}
                        alt={img.original.name}
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                      <span className="min-w-0 flex-1 truncate text-xs">{img.original.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch({ type: 'REMOVE_IMAGE', payload: img.id })
                        }}
                        className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                        aria-label={`删除 ${img.original.name}`}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
