// actions.ts

import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { SET_SELECTED_TAB, SetSelectedTabAction } from '~/types/types';
import { RootState } from '..';

export const setSelectedTabSuccess = (selectedTab: string): SetSelectedTabAction => ({
  type: SET_SELECTED_TAB,
  payload: { selectedTab },
});

// Thunk action
export const setSelectedTab = (
  selectedTab: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch) => {
    dispatch(setSelectedTabSuccess(selectedTab));
  };
};
