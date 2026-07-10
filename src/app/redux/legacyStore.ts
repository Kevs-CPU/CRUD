import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { taskReducer } from "./task/task.reducers";

const rootReducer = combineReducers({ tasks: taskReducer });

export const legacyStore = createStore(rootReducer, applyMiddleware(thunk)); 


