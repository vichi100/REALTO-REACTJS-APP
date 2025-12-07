import { createStore, combineReducers } from "redux";
import AppReducer from "./../reducers/AppReducer";
import dataRefreshReducer from "./../reducers/dataRefreshReducer";

const rootReducer = combineReducers({
    AppReducer: AppReducer,
    dataRefresh: dataRefreshReducer,
});

const configureStore = () => {
    return createStore(rootReducer);
};
export default configureStore;
