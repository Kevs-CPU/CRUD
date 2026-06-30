import { ADD_TASK } from './task.types';

export const addTask = (task: string) => ({ 
    type: ADD_TASK, 
    payload: task 
});