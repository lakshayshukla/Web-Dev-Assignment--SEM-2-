import { configureStore } from '@reduxjs/toolkit'
import sessionReducer from './sessionSlice'
import distractionReducer from './distractionSlice'
import statsReducer from './statsSlice'
import settingsReducer from './settingsSlice'

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    distraction: distractionReducer,
    stats: statsReducer,
    settings: settingsReducer,
  },
})

export default store
