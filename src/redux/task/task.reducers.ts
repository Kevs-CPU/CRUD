import { ADD_TASK } from './task.types';

interface TaskState {
  tasks: string[]; 
}

const initialState: TaskState = { tasks: [] };

export const taskReducer = (state = initialState, action: any): TaskState => {
  switch (action.type) {
    case ADD_TASK: 
      return { ...state, tasks: [...state.tasks, action.payload] };
    default: 
      return state;
  }
};