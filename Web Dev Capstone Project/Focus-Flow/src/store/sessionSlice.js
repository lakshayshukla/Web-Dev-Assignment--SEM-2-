import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const loadSessions = () => {
  try {
    const data = localStorage.getItem('focusflow_sessions')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveSessions = (sessions) => {
  localStorage.setItem('focusflow_sessions', JSON.stringify(sessions))
}

const initialState = {
  sessions: loadSessions(),
  activeSession: null,
  timerRunning: false,
  timerSeconds: 0,
  sessionGoal: '',
  sessionType: 'focus',
  pomodoroMode: false,
  pomodoroCount: 0,
  focusDuration: 25 * 60,
  breakDuration: 5 * 60,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action) => {
      const session = {
        id: uuidv4(),
        goal: action.payload.goal,
        type: action.payload.type || 'focus',
        startTime: new Date().toISOString(),
        endTime: null,
        duration: 0,
        distractionCount: 0,
        completed: false,
        tags: action.payload.tags || [],
        mood: action.payload.mood || 'neutral',
      }
      state.activeSession = session
      state.timerRunning = true
      state.timerSeconds = 0
      state.sessionGoal = action.payload.goal
    },
    stopSession: (state) => {
      if (state.activeSession) {
        const completed = {
          ...state.activeSession,
          endTime: new Date().toISOString(),
          duration: state.timerSeconds,
          completed: true,
        }
        state.sessions.unshift(completed)
        saveSessions(state.sessions)
      }
      state.activeSession = null
      state.timerRunning = false
      state.timerSeconds = 0
    },
    pauseTimer: (state) => { state.timerRunning = false },
    resumeTimer: (state) => { state.timerRunning = true },
    tickTimer: (state) => { state.timerSeconds += 1 },
    incrementDistractionInSession: (state) => {
      if (state.activeSession) state.activeSession.distractionCount += 1
    },
    setSessionGoal: (state, action) => { state.sessionGoal = action.payload },
    togglePomodoroMode: (state) => { state.pomodoroMode = !state.pomodoroMode },
    setPomodoroCount: (state, action) => { state.pomodoroCount = action.payload },
    setFocusDuration: (state, action) => { state.focusDuration = action.payload * 60 },
    setBreakDuration: (state, action) => { state.breakDuration = action.payload * 60 },
    // CRUD: Update/Edit session (goal, tags, mood)
    updateSession: (state, action) => {
      const idx = state.sessions.findIndex(s => s.id === action.payload.id)
      if (idx !== -1) {
        state.sessions[idx] = {
          ...state.sessions[idx],
          goal: action.payload.goal ?? state.sessions[idx].goal,
          tags: action.payload.tags ?? state.sessions[idx].tags,
          mood: action.payload.mood ?? state.sessions[idx].mood,
        }
        saveSessions(state.sessions)
      }
    },
    deleteSession: (state, action) => {
      state.sessions = state.sessions.filter(s => s.id !== action.payload)
      saveSessions(state.sessions)
    },
    clearAllSessions: (state) => {
      state.sessions = []
      saveSessions([])
    },
    abandonSession: (state) => {
      state.activeSession = null
      state.timerRunning = false
      state.timerSeconds = 0
    },
  },
})

export const {
  startSession, stopSession, pauseTimer, resumeTimer, tickTimer,
  incrementDistractionInSession, setSessionGoal, togglePomodoroMode,
  setPomodoroCount, setFocusDuration, setBreakDuration,
  updateSession, deleteSession, clearAllSessions, abandonSession,
} = sessionSlice.actions

export default sessionSlice.reducer
