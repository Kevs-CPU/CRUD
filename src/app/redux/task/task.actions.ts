import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, GET_ALL_TASKS } from './task.types';
import {
  addTaskUseCase,
  removeTaskUseCase,
  updateTaskUseCase,
  getAllTasksUseCase,
} from '../../taskUseCaseProvider';

interface Task {
  id: string;
  title: string;
}

export const fetchAllTasksThunk = () => async (dispatch: any) => {
  const tasks = await getAllTasksUseCase.execute();
  dispatch({ type: GET_ALL_TASKS, payload: tasks });
};

export const addTaskThunk = (title: string) => async (dispatch: any) => {
  const task = await addTaskUseCase.execute({ title });
  dispatch({ type: ADD_TASK, payload: task }); 
};

export const removeTaskThunk = (id: string) => async (dispatch: any) => {
  await removeTaskUseCase.execute(id);
  dispatch({ type: REMOVE_TASK, payload: id });
};

export const updateTaskThunk = (id: string, changes: Partial<Task>) => async (dispatch: any) => {
  const updated = await updateTaskUseCase.execute(id, changes);
  dispatch({ type: UPDATE_TASK, payload: { id, changes: { title: updated.title } } });
};