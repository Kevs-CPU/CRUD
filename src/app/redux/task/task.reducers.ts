import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, GET_ALL_TASKS, GET_TASK } from './task.types';

interface Task {
  id: string;
  title: string;
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
}

const initialState: TaskState = { tasks: [], selectedTask: null };

export const taskReducer = (state = initialState, action: any): TaskState => {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };

    case REMOVE_TASK:
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };

    case UPDATE_TASK: {
      const { id, changes } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...changes } : t)),
      };
    }

    case GET_ALL_TASKS:
      return { ...state, tasks: action.payload };

    case GET_TASK:
      return { ...state, selectedTask: action.payload };

    default:
      return state;
  }
};