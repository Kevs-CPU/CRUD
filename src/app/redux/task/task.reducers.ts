import {
  ADD_TASK,
  REMOVE_TASK,
  UPDATE_TASK,
  GET_ALL_TASKS,
} from "./task.types";

interface Task {
  id: string;
  gmail: string;
  title: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

export const taskReducer = (
  state = initialState,
  action: any
): TaskState => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case UPDATE_TASK: {
      const { id, changes } = action.payload;

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...changes } : task
        ),
      };
    }

    case GET_ALL_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };

    default:
      return state;
  }
};