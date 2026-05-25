import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import type { Action, AppState, ImageItem } from './types'
import { DEFAULT_EDITS } from './types'

const initialState: AppState = {
  images: [],
  activeImageId: null,
  sidebarOpen: true,
  imagesPerPage: 2,
  exportStatus: 'idle',
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_IMAGES': {
      const existingNames = new Set(state.images.map((img) => img.original.name))
      const newImages = action.payload.filter(
        (img) => !existingNames.has(img.original.name),
      )
      if (newImages.length === 0) return state
      return {
        ...state,
        images: [...state.images, ...newImages],
        activeImageId: state.activeImageId ?? newImages[0].id,
      }
    }

    case 'REMOVE_IMAGE': {
      const images = state.images.filter((img) => img.id !== action.payload)
      const wasActive = state.activeImageId === action.payload
      return {
        ...state,
        images,
        activeImageId: wasActive ? (images[0]?.id ?? null) : state.activeImageId,
      }
    }

    case 'REORDER_IMAGES': {
      const { fromIndex, toIndex } = action.payload
      const images = [...state.images]
      const [moved] = images.splice(fromIndex, 1)
      images.splice(toIndex, 0, moved)
      return { ...state, images }
    }

    case 'SET_ACTIVE_IMAGE':
      return { ...state, activeImageId: action.payload }

    case 'UPDATE_EDITS': {
      const { id, edits } = action.payload
      return {
        ...state,
        images: state.images.map((img) =>
          img.id === id
            ? { ...img, edits: { ...img.edits, ...edits } }
            : img,
        ),
      }
    }

    case 'SET_IMAGES_PER_PAGE':
      return { ...state, imagesPerPage: action.payload }

    case 'SET_EXPORT_STATUS':
      return { ...state, exportStatus: action.payload }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }

    default:
      return state
  }
}

const StateContext = createContext<AppState>(initialState)
const DispatchContext = createContext<Dispatch<Action>>(() => undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export function useAppState() {
  return useContext(StateContext)
}

export function useAppDispatch() {
  return useContext(DispatchContext)
}
