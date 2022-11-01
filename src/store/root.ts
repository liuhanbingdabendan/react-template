import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface rootState {
  isLogin: boolean
}

const initialState: rootState = {
  isLogin: false
}

export const rootSlice = createSlice({
  name: 'root',
  initialState: initialState,
  reducers: {
    changeLoginState: state => {
      state.isLogin = !state.isLogin
    }
  }
})

export const { changeLoginState } = rootSlice.actions;

export default rootSlice.reducer;
