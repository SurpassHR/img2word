import { AppProvider } from './store'
import Toolbar from './Toolbar'
import Workspace from './Workspace'

export default function App() {
  return (
    <AppProvider>
      <div className="flex h-screen flex-col bg-gray-50 text-gray-900">
        <Toolbar />
        <Workspace />
      </div>
    </AppProvider>
  )
}
