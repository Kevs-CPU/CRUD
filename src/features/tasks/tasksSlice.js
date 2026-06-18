import { createSlice, nanoid } from "@reduxjs/toolkit";

const STORAGE_KEY = "todo_ml_v3";

const INIT_TASKS = [
  { id: 1, text: "Buy groceries",         list: "shopping", done: false },
  { id: 2, text: "Read a book",           list: "personal", done: false },
  { id: 3, text: "Finish project report", list: "work",      done: true  },
  { id: 4, text: "Pay utility bills",     list: "default",  done: false },
];

// Dati ito ay nasa loob ng useState() sa App.jsx:
// useState(() => JSON.parse(localStorage.getItem("todo_ml_v3")) ?? INIT_TASKS)
// Dito na lang natin ginagawa, bilang initialState ng slice.
function loadInitialTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ?? INIT_TASKS;
  } catch {
    return INIT_TASKS;
  }
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState: loadInitialTasks(),
  reducers: {
    // dati: setTasks(prev => [...prev, { id: Date.now(), text, list, done: false }])
    taskAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      // 'prepare' ang gumagawa ng object bago ito i-push sa state.
      // ginamit dito ang nanoid() (galing sa RTK) imbes na Date.now()
      // para garantisadong unique ang id, kahit magdagdag nang sunod-sunod.
      prepare(text, list) {
        return { payload: { id: nanoid(), text, list, done: false } };
      },
    },

    // dati: setTasks(prev => prev.map(t => t.id === id ? {...t, done: !t.done} : t))
    taskToggled(state, action) {
      const task = state.find((t) => t.id === action.payload);
      if (task) task.done = !task.done;
    },

    // dati: setTasks(prev => prev.filter(t => t.id !== id))
    taskDeleted(state, action) {
      return state.filter((t) => t.id !== action.payload);
    },

    // dati: setTasks(prev => prev.map(t => t.id === id ? {...t, text: editText.trim()} : t))
    taskEdited(state, action) {
      const { id, text } = action.payload;
      const task = state.find((t) => t.id === id);
      if (task) task.text = text;
    },
  },
});

export const { taskAdded, taskToggled, taskDeleted, taskEdited } = tasksSlice.actions;
export default tasksSlice.reducer;