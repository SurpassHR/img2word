import { useAppState, useAppDispatch } from './store'
import type { ImagesPerPage, LayoutMode } from './types'
import ExportButton from './ExportButton'

const PER_PAGE_OPTIONS: ImagesPerPage[] = [1, 2, 3, 4, 5, 6]
const LAYOUT_OPTIONS: { mode: LayoutMode; label: string }[] = [
  { mode: 'vertical', label: '垂直' },
  { mode: 'grid', label: '网格' },
]

export default function Toolbar() {
  const { imagesPerPage, layoutMode } = useAppState()
  const dispatch = useAppDispatch()

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

        {/* 每页图片数选择器 */}
        <div className="ml-2 flex items-center gap-0.5 md:ml-4 md:gap-1">
          <span className="hidden text-sm text-gray-500 md:inline">每页:</span>
          {PER_PAGE_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => dispatch({ type: 'SET_IMAGES_PER_PAGE', payload: n })}
              className={`rounded px-1.5 py-0.5 text-xs font-medium transition-colors md:px-2 md:py-0.5 md:text-sm ${
                imagesPerPage === n
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* 布局模式切换 */}
        <div className="ml-2 flex items-center gap-0.5">
          {LAYOUT_OPTIONS.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => dispatch({ type: 'SET_LAYOUT_MODE', payload: mode })}
              className={`rounded px-2 py-0.5 text-sm font-medium transition-colors ${
                layoutMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ExportButton />
    </header>
  )
}
