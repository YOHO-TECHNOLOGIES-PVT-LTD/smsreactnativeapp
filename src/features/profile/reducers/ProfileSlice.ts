import { createSlice } from '@reduxjs/toolkit';

const ProfileSlice = createSlice({
  name: 'ProfileSlice',
  initialState: {
    profileData: [],
  },
  reducers: {
    getProfile: (state, action) => {
      state.profileData = action.payload;
    },
  },
});

export const { getProfile } = ProfileSlice.actions;
export default ProfileSlice.reducer;
