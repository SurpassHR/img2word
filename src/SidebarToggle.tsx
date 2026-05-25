interface SidebarToggleProps {
  collapsed: boolean
  onToggle: () => void
}

export default function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="absolute -right-3 top-4 z-40 hidden h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-[10px] shadow-sm hover:bg-gray-50 md:flex"
      aria-label={collapsed ? '展开侧栏' : '折叠侧栏'}
    >
      {collapsed ? '▶' : '◀'}
    </button>
  )
}
