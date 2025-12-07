import { createStore, combineReducers } from "redux";
import AppReducer from "./../reducers/AppReducer";
import dataRefreshReducer from "./../reducers/dataRefreshReducer";

const rootReducer = combineReducers({
  AppReducer: AppReducer, // Your existing reducer
  dataRefresh: dataRefreshReducer, // Add the new data refresh reducer
});

const configureStore = () => {
  return createStore(rootReducer);
};
export default configureStore;
