import ImageSidebar from './ImageSidebar'
import MainPanel from './MainPanel'

export default function Workspace() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <ImageSidebar />
      <MainPanel />
    </div>
  )
}
