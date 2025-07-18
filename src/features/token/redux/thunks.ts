// authActions.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken, clearToken } from './slices';
import { Action, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '~/store';

type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const getToken = (): AppThunk<Promise<string | null>> => async (dispatch: any) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      dispatch(setToken(token));
    } else {
      dispatch(clearToken());
    }
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    dispatch(clearToken());
    return null;
  }
};

export const logout = () => async (dispatch: any) => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userName');
    dispatch(clearToken());
  } catch (error) {
    console.error('Error during logout:', error);
  }
};
