import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { stateSlice } from './stateSlice';
import { searchSlice } from './searchSlice';
import { dateSlice } from './dateSlice';

const rootReducer = combineReducers({
  currentState: stateSlice.reducer,
  searchValue: searchSlice.reducer,
  date: dateSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;