import { Task } from "../../../domain/entities/Task";

export const ADD_TASK = "ADD_TASK";
export const REMOVE_TASK = "REMOVE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const GET_ALL_TASKS = "GET_ALL_TASKS";

export const addTask = (task: Task) =>
  ({
    type: ADD_TASK,
    payload: task,
  } as const);

export const removeTask = (id: string) =>
  ({
    type: REMOVE_TASK,
    payload: id,
  } as const);

export const updateTask = (
  id: string,
  changes: Partial<Task>
) =>
  ({
    type: UPDATE_TASK,
    payload: {
      id,
      changes,
    },
  } as const);

export const getAllTasks = (tasks: Task[]) =>
  ({
    type: GET_ALL_TASKS,
    payload: tasks,
  } as const);

export type TaskAction =
  | ReturnType<typeof addTask>
  | ReturnType<typeof removeTask>
  | ReturnType<typeof updateTask>
  | ReturnType<typeof getAllTasks>;