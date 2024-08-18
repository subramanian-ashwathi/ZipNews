import { createSlice } from '@reduxjs/toolkit'

// reference: https://react-redux.js.org/tutorials/quick-start
export const stateSlice = createSlice({
  name: 'currentState',
  initialState: {
    value: "",
  },
  reducers: {
    // state
    changeState: (state, action) => {
        state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeState } = stateSlice.actions

export default stateSlice.reducer