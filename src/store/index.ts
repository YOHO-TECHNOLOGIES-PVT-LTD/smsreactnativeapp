import { configureStore } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';

const store = configureStore({
  reducer: {
    tabReducer: tabReducer,
  },
});

export { store };

// store.ts
export type RootState = ReturnType<typeof store.getState>;
