import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';
import TokenReducer from '../features/token/redux/slices';
import CartReducer from '../features/booking-cart/redux/slices';
import ProfileReducer from '../features/profile/reducers/ProfileSlice';

const store = configureStore({
  reducer: {
    tabReducer: tabReducer,
    TokenReducer: TokenReducer,
    CartReducer: CartReducer,
    ProfileReducer: ProfileReducer,
  },
});

export { store };

// store.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
