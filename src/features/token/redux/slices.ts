import { createSlice } from '@reduxjs/toolkit';

interface TokenState {
  token: string | null;
}

const initialState: TokenState = {
  token: null,
};

const tokenSlice = createSlice({
  name: 'Token',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
