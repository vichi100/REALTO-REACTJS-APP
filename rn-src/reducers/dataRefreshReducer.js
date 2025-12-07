// Action Types
export const TRIGGER_REFRESH = 'TRIGGER_REFRESH';
export const RESET_REFRESH = 'RESET_REFRESH';

// Action Creators
export const triggerRefresh = () => ({
  type: TRIGGER_REFRESH,
});

export const resetRefresh = () => ({
  type: RESET_REFRESH,
});

// Initial State for dataRefresh
const initialState = {
  shouldRefresh: false,
  lastUpdateTime: null, // Optional: useful for debugging or specific logic
};

// Data Refresh Reducer
const dataRefreshReducer = (state = initialState, action) => {
  switch (action.type) {
    case TRIGGER_REFRESH:
      return {
        ...state,
        shouldRefresh: true,
        lastUpdateTime: new Date().toISOString(),
      };
    case RESET_REFRESH:
      return {
        ...state,
        shouldRefresh: false,
      };
    default:
      return state;
  }
};

export default dataRefreshReducer;