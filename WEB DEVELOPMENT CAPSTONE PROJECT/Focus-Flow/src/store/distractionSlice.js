import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const loadDistractions = () => {
  try {
    const data = localStorage.getItem('focusflow_distractions')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveDistractions = (distractions) => {
  localStorage.setItem('focusflow_distractions', JSON.stringify(distractions))
}

const CATEGORIES = [
  { id: 'social', label: 'Social Media', icon: '📱', color: '#3b82f6' },
  { id: 'messaging', label: 'Messaging', icon: '💬', color: '#8b5cf6' },
  { id: 'news', label: 'News / Browsing', icon: '📰', color: '#f59e0b' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎮', color: '#ef4444' },
  { id: 'food', label: 'Food / Drink', icon: '☕', color: '#f97316' },
  { id: 'people', label: 'People / Noise', icon: '👥', color: '#10b981' },
  { id: 'thoughts', label: 'Random Thoughts', icon: '💭', color: '#a855f7' },
  { id: 'other', label: 'Other', icon: '❓', color: '#6b7280' },
]

const initialState = {
  distractions: loadDistractions(),
  categories: CATEGORIES,
  filter: 'all',
  searchQuery: '',
  sortBy: 'recent',
}

const distractionSlice = createSlice({
  name: 'distraction',
  initialState,
  reducers: {
    logDistraction: (state, action) => {
      const distraction = {
        id: uuidv4(),
        category: action.payload.category || 'other',
        description: action.payload.description || '',
        sessionId: action.payload.sessionId || null,
        timestamp: new Date().toISOString(),
        duration: action.payload.duration || 0, // minutes lost
        severity: action.payload.severity || 'medium', // low | medium | high
        note: action.payload.note || '',
      }
      state.distractions.unshift(distraction)
      saveDistractions(state.distractions)
    },
    deleteDistraction: (state, action) => {
      state.distractions = state.distractions.filter(d => d.id !== action.payload)
      saveDistractions(state.distractions)
    },
    updateDistraction: (state, action) => {
      const idx = state.distractions.findIndex(d => d.id === action.payload.id)
      if (idx !== -1) {
        state.distractions[idx] = { ...state.distractions[idx], ...action.payload }
        saveDistractions(state.distractions)
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    clearAllDistractions: (state) => {
      state.distractions = []
      saveDistractions([])
    },
  },
})

export const {
  logDistraction,
  deleteDistraction,
  updateDistraction,
  setFilter,
  setSearchQuery,
  setSortBy,
  clearAllDistractions,
} = distractionSlice.actions

export const selectCategories = (state) => state.distraction.categories
export const selectDistractions = (state) => state.distraction.distractions
export const selectFilteredDistractions = (state) => {
  const { distractions, filter, searchQuery, sortBy } = state.distraction
  let result = [...distractions]

  if (filter !== 'all') {
    result = result.filter(d => d.category === filter)
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    result = result.filter(d =>
      d.description.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.note.toLowerCase().includes(q)
    )
  }

  if (sortBy === 'recent') {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  } else if (sortBy === 'oldest') {
    result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  } else if (sortBy === 'severity') {
    const sev = { high: 0, medium: 1, low: 2 }
    result.sort((a, b) => sev[a.severity] - sev[b.severity])
  }

  return result
}

export default distractionSlice.reducer
