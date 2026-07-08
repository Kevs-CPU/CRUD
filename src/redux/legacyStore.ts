import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { taskReducer } from "./task/task.reducers";

const rootReducer = combineReducers({ tasks: taskReducer });

export const legacyStore = createStore(rootReducer, applyMiddleware(thunk)); 





// Command the original path in your file disk
// cd "to do-List"    //npm run dev -- --open para mag open siya sa browser 
// First task Create todo-list front end only using react.js 
// Second task Apply Redux toollkit using Existing task 
// therd task Enhance the Existing task to clean architecture  

// First disapointed 
// New learning 
// New Enhancement 
// New Growth 
// New Adcievment  

