// Action Types
export const ADD_TASK = "ADD_TASK";
export const REMOVE_TASK = "REMOVE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const GET_ALL_TASKS = "GET_ALL_TASKS";

// Task Interface
export interface Task {
  id: string;
  gmail: string;
  title: string;
  completed: boolean;
}

// Action Creators
export const addTask = (task: Task) => ({
  type: ADD_TASK,
  payload: task,
});

export const removeTask = (id: string) => ({
  type: REMOVE_TASK,
  payload: id,
});

export const updateTask = (
  id: string,
  changes: Partial<Task>
) => ({
  type: UPDATE_TASK,
  payload: {
    id,
    changes,
  },
});

export const getAllTasks = (tasks: Task[]) => ({
  type: GET_ALL_TASKS,
  payload: tasks,
});