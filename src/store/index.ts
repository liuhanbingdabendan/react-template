import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './counterSlice';
import rootSlice from './root';

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    root: rootSlice
  }
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
