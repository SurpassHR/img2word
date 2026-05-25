import { useAppState, useAppDispatch } from './store'
import type { ImagesPerPage } from './types'

const PER_PAGE_OPTIONS: ImagesPerPage[] = [1, 2, 4, 6]

export default function Toolbar() {
  const { imagesPerPage, exportStatus, images } = useAppState()
  const dispatch = useAppDispatch()

  const canExport = images.length > 0 && exportStatus !== 'generating'

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        {/* 移动端侧栏切换按钮 */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="rounded p-1 text-gray-500 hover:bg-gray-100 md:hidden"
          aria-label="切换侧栏"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg font-bold">img2word</h1>

        {/* 每页图片数选择器 — 移动端隐藏 */}
        <div className="ml-4 hidden items-center gap-1 md:flex">
          <span className="mr-1 text-sm text-gray-500">每页:</span>
          {PER_PAGE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => dispatch({ type: 'SET_IMAGES_PER_PAGE', payload: n })}
              className={`rounded px-2 py-0.5 text-sm font-medium transition-colors ${
                imagesPerPage === n
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!canExport}
        onClick={() => dispatch({ type: 'SET_EXPORT_STATUS', payload: 'generating' })}
        className="rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        title={images.length === 0 ? '请先导入图片' : undefined}
      >
        <span className="hidden sm:inline">
          {exportStatus === 'generating' ? '生成中...' : '导出 Word'}
        </span>
        <span className="sm:hidden">
          {exportStatus === 'generating' ? '...' : '导出'}
        </span>
      </button>
    </header>
  )
}
