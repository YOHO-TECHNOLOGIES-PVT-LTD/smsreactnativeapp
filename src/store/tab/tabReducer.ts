import { SET_SELECTED_TAB, TabActionTypes } from '../../types/types';

export interface TabState {
  selectedTab: string;
}

const initialState: TabState = {
  selectedTab: '',
};

const tabReducer = (state = initialState, action: TabActionTypes): TabState => {
  switch (action.type) {
    case SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.payload.selectedTab,
      };
    default:
      return state;
  }
};

export default tabReducer;
