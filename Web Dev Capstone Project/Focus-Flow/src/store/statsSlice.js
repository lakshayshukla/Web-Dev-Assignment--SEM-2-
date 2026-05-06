import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dateRange: '7days', // '7days' | '30days' | 'today' | 'all'
}

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload
    },
  },
})

export const { setDateRange } = statsSlice.actions
export default statsSlice.reducer
