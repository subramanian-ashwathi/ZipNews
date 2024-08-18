import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs';
import {Dayjs} from 'dayjs'

// reference: https://react-redux.js.org/tutorials/quick-start
export const dateSlice = createSlice({
  name: 'date',
  initialState: {
    value: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)),
    // value: new Date(Date.now() - (16.7 * 7 * 24 * 60 * 60 * 1000)),
    // value: new Date('2023-01-1')
  },
  reducers: {
    // state
    changeDate: (state, action) => {
      // console.log(action.payload)
        state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeDate } = dateSlice.actions

export default dateSlice.reducer