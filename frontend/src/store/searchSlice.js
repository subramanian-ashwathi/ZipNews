import { createSlice } from '@reduxjs/toolkit'

// reference: https://react-redux.js.org/tutorials/quick-start
export const searchSlice = createSlice({
  name: 'searchValue',
  initialState: {
    value: "",
  },
  reducers: {
    // state
    changeSearch: (state, action) => {
        state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeSearch } = searchSlice.actions

export default searchSlice.reducer