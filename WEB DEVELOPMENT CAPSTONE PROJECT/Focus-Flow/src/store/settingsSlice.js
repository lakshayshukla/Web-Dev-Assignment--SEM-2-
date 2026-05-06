import { createSlice } from '@reduxjs/toolkit'

const loadSettings = () => {
  try {
    const data = localStorage.getItem('focusflow_settings')
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

const saveSettings = (settings) => {
  localStorage.setItem('focusflow_settings', JSON.stringify(settings))
}

const defaults = {
  darkMode: true,
  soundEnabled: true,
  notifications: true,
  dailyGoal: 4, // focus sessions per day
  focusDuration: 25,
  breakDuration: 5,
  showMotivation: true,
  name: 'Focuser',
}

const initialState = {
  ...defaults,
  ...loadSettings(),
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      saveSettings({ ...state })
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled
      saveSettings({ ...state })
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications
      saveSettings({ ...state })
    },
    setDailyGoal: (state, action) => {
      state.dailyGoal = action.payload
      saveSettings({ ...state })
    },
    setFocusDuration: (state, action) => {
      state.focusDuration = action.payload
      saveSettings({ ...state })
    },
    setBreakDuration: (state, action) => {
      state.breakDuration = action.payload
      saveSettings({ ...state })
    },
    setName: (state, action) => {
      state.name = action.payload
      saveSettings({ ...state })
    },
    toggleMotivation: (state) => {
      state.showMotivation = !state.showMotivation
      saveSettings({ ...state })
    },
  },
})

export const {
  toggleDarkMode,
  toggleSound,
  toggleNotifications,
  setDailyGoal,
  setFocusDuration,
  setBreakDuration,
  setName,
  toggleMotivation,
} = settingsSlice.actions

export default settingsSlice.reducer
