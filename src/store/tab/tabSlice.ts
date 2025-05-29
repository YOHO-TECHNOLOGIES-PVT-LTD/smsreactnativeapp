import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTab: '',
};

const tabSlice = createSlice({
  name: 'tabReducer',
  initialState,
  reducers: {
    setSelectedTab(state, action) {
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = tabSlice.actions;

export default tabSlice.reducer;
