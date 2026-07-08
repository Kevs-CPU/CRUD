import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, GET_ALL_TASKS, GET_TASK } from './task.types';
import {
  addTaskUseCase,
  removeTaskUseCase,
  updateTaskUseCase,
  getAllTasksUseCase,
  getTaskUseCase,
} from '../../app/taskUseCaseProvider';

interface Task {
  id: string;
  title: string;
}

export const addTask = (task: Task) => ({
  type: ADD_TASK,
  payload: task,
});

export const removeTask = (id: string) => ({
  type: REMOVE_TASK,
  payload: id,
});

export const updateTask = (id: string, changes: Partial<Task>) => ({
  type: UPDATE_TASK,
  payload: { id, changes },
});

export const getAllTasks = (tasks: Task[]) => ({
  type: GET_ALL_TASKS,
  payload: tasks,
});

export const getTask = (task: Task) => ({
  type: GET_TASK,
  payload: task,
});

export const fetchAllTasksThunk = () => async (dispatch: any) => {
  const tasks = await getAllTasksUseCase.execute();
  dispatch(getAllTasks(tasks));
};

export const fetchTaskThunk = (id: string) => async (dispatch: any) => {
  const task = await getTaskUseCase.execute(id);
  dispatch(getTask(task));
};

export const addTaskThunk = (title: string) => async (dispatch: any) => {
  const task = await addTaskUseCase.execute({ title });
  dispatch(addTask(task));
};

export const removeTaskThunk = (id: string) => async (dispatch: any) => {
  await removeTaskUseCase.execute(id);
  dispatch(removeTask(id));
};

export const updateTaskThunk = (id: string, changes: Partial<Task>) => async (dispatch: any) => {
  const updated = await updateTaskUseCase.execute(id, changes);
  dispatch(updateTask(id, { title: updated.title }));
};