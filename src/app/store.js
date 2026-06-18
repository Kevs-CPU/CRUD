import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

// Dati ito ay nasa loob ng useEffect sa App.jsx:
//   useEffect(() => {
//     localStorage.setItem("todo_ml_v3", JSON.stringify(tasks));
//   }, [tasks]);
//
// Dito na lang natin ginagawa gamit ang store.subscribe — automatic itong
// tumatakbo kapailanman magbago ang state, kaya hindi na kailangan ng
// useEffect para dito sa App.jsx.
store.subscribe(() => {
  localStorage.setItem("todo_ml_v3", JSON.stringify(store.getState().tasks));
});