import { useCallback } from 'react'
import { useAppState, useAppDispatch } from './store'
import { DEFAULT_EDITS } from './types'
import DropZone from './DropZone'
import ImageList from './ImageList'
import SidebarToggle from './SidebarToggle'

export default function ImageSidebar() {
  const { images, activeImageId, sidebarOpen } = useAppState()
  const dispatch = useAppDispatch()

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

  const toggle = () => dispatch({ type: 'TOGGLE_SIDEBAR' })
  const selectImage = (id: string) => dispatch({ type: 'SET_ACTIVE_IMAGE', payload: id })
  const deleteImage = (id: string) => dispatch({ type: 'REMOVE_IMAGE', payload: id })

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
        <SidebarToggle collapsed={!sidebarOpen} onToggle={toggle} />

        {sidebarOpen && (
          <>
            <DropZone onFiles={handleFiles} />
            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <ImageList
                images={images}
                activeImageId={activeImageId}
                onSelect={selectImage}
                onDelete={deleteImage}
              />
            </div>
          </>
        )}
      </aside>
    </>
  )
}
