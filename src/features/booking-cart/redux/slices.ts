import { createSlice } from '@reduxjs/toolkit';

const cartReducer = createSlice({
  name: 'bookingCart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    getCartData: (state, action) => {
      state.cartItems = action.payload;
    },
  },
});

export const { getCartData } = cartReducer.actions;
export default cartReducer.reducer;
