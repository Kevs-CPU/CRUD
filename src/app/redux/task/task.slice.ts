import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../../domain/entities/Task";

import {
  addTaskUseCase,
  getAllTasksUseCase,
  updateTaskUseCase,
  removeTaskUseCase,
} from "../../taskUseCaseProvider";

export type FilterType = "all" | "active" | "completed";

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
  editId: string | null;
  editText: string;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: "all",
  editId: null,
  editText: "",
};

export const fetchTasks = createAsyncThunk<Task[], void>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getAllTasksUseCase.execute();
      return result as Task[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk<Task, {
    gmail: string;
    currentUserEmail: string;
    task: string;}> (
  'tasks/addTask',
  async ({ gmail, currentUserEmail, task }, { rejectWithValue }) => {
    try {
const result = await addTaskUseCase.execute(
    gmail,
    currentUserEmail,
    task
);
      return result as Task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk<
  Task,
  { id: string; title?: string; completed?: boolean }
>(
  'tasks/updateTask',
  async ({ id, title, completed }, { rejectWithValue }) => {
    try {
      const result = await updateTaskUseCase.execute({id,title,completed,});
      return result as Task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const removeTask = createAsyncThunk<string, string>(
  'tasks/removeTask',
  async (id, { rejectWithValue }) => {
    try {
      const result = await removeTaskUseCase.execute(id);
      return result as string;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove task');
    }
  }
);

export const toggleTaskComplete = createAsyncThunk<Task, string>(
  'tasks/toggleTaskComplete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { tasks: TaskState };
      const task = state.tasks.tasks.find(t => t.id === id);

      if (!task) {
        throw new Error('Task not found');
      }

      const result = await updateTaskUseCase.execute({
  id,
  completed: !task.completed,
});

      return result as Task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle task');
    }
  }
);

export const selectFilteredTasks = (state: { tasks: TaskState }) => {
  const tasks = state.tasks.tasks || [];
  const filter = state.tasks.filter || 'all';
  if (filter === "active") return tasks.filter(task => !task.completed);
  if (filter === "completed") return tasks.filter(task => task.completed);
  return tasks;
};

export const selectActiveCount = (state: { tasks: TaskState }) => {
  const tasks = state.tasks.tasks || [];
  return tasks.filter(task => !task.completed).length;
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
    setEditId: (state, action: PayloadAction<string | null>) => {
      state.editId = action.payload;
    },
    setEditText: (state, action: PayloadAction<string>) => {
      state.editText = action.payload;
    },
    clearEdit: (state) => {
      state.editId = null;
      state.editText = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch tasks';
      })
      .addCase(addTask.pending, (state) => {
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks.push(action.payload);
          state.error = null;
        }
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to add task';
      })
      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.tasks.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
          state.error = null;
          state.editId = null;
          state.editText = '';
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to update task';
      })
      .addCase(removeTask.pending, (state) => {
        state.error = null;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.tasks = state.tasks.filter(t => t.id !== action.payload);
          state.error = null;
          if (state.editId === action.payload) {
            state.editId = null;
            state.editText = '';
          }
        }
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to remove task';
      })
      .addCase(toggleTaskComplete.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.tasks.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
          state.error = null;
        }
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to toggle task';
      });
  },
});

export const {
  clearError,
  setError,
  setFilter,
  setEditId,
  setEditText,
  clearEdit,
} = taskSlice.actions;

export default taskSlice.reducer;