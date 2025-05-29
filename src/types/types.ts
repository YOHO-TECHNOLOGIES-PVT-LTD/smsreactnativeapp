// types.ts
export const SET_SELECTED_TAB = 'SET_SELECTED_TAB' as const;

export interface SetSelectedTabAction {
  type: typeof SET_SELECTED_TAB;
  payload: {
    selectedTab: string;
  };
}

// Union of all possible tab-related actions (in case you add more later)
export type TabActionTypes = SetSelectedTabAction;
