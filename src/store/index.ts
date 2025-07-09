import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';
import TokenReducer from '../features/token/redux/slices';

const store = configureStore({
  reducer: {
    tabReducer: tabReducer,
    TokenReducer: TokenReducer,
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
