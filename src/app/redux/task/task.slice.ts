import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../../../domain/entities/Task";
import { createSelector } from '@reduxjs/toolkit';

import {
  addTaskUseCase,
  getAllTasksUseCase,
  updateTaskUseCase,
  removeTaskUseCase,
} from "../../taskUseCaseProvider";

import { auth } from "../../../firebase/config";

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
  filter: "active",
  editId: null,
  editText: "",
};

const getCurrentUser = (): Promise<any> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const fetchTasks = createAsyncThunk<Task[]>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        return rejectWithValue('User not authenticated');
      }

      if (!currentUser.uid) {
        return rejectWithValue('User ID is required');
      }

      const result = await getAllTasksUseCase.execute(currentUser.uid);
      return result as Task[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk<Task, { gmail: string; task: string }>(
  'tasks/addTask',
  async ({ gmail, task }, { rejectWithValue }) => {
    try {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        return rejectWithValue('User not authenticated. Please log in again.');
      }

      if (!currentUser.uid) {
        return rejectWithValue('User ID is required.');
      }

      const result = await addTaskUseCase.execute({
        userId: currentUser.uid,
        username: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        gmail: gmail,
        title: task,
        currentUserEmail: currentUser.email || '',
      });
      
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
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        return rejectWithValue('User not authenticated');
      }

      const result = await updateTaskUseCase.execute({ 
        id, 
        title, 
        completed,
        userId: currentUser.uid
      });
      
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
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        return rejectWithValue('User not authenticated');
      }

      const result = await removeTaskUseCase.execute(id, currentUser.uid);
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
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        return rejectWithValue('User not authenticated');
      }

      const state = getState() as { tasks: TaskState };
      const task = state.tasks.tasks.find(t => t.id === id);

      if (!task) {
        throw new Error('Task not found');
      }

      const result = await updateTaskUseCase.execute({
        id,
        completed: !task.completed,
        userId: currentUser.uid
      });

      return result as Task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle task');
    }
  }
);

// ✅ Base selectors
const selectTasks = (state: { tasks: TaskState }) => state.tasks.tasks;
const selectFilterState = (state: { tasks: TaskState }) => state.tasks.filter;

// ✅ Memoized selectors using createSelector
export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilterState],
  (tasks, filter) => {
    if (filter === "completed") {
      return tasks.filter(task => task.completed);
    }
    return tasks.filter(task => !task.completed);
  }
);

export const selectActiveCount = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => !task.completed).length
);

export const selectCompletedCount = createSelector(
  [selectTasks],
  (tasks) => tasks.filter(task => task.completed).length
);

export const selectTotalCount = createSelector(
  [selectTasks],
  (tasks) => tasks.length
);

// ✅ CORRECTED: Direct return, no createSelector needed
export const selectFilter = (state: { tasks: TaskState }) => state.tasks.filter;

// ✅ Other selectors
export const selectUserTasks = (state: { tasks: TaskState }, userId: string) => {
  const tasks = state.tasks.tasks || [];
  return tasks.filter(task => task.userId === userId);
};

export const selectTaskById = (state: { tasks: TaskState }, taskId: string) => {
  const tasks = state.tasks.tasks || [];
  return tasks.find(task => task.id === taskId);
};

export const selectLoading = (state: { tasks: TaskState }) => {
  return state.tasks.loading;
};

export const selectError = (state: { tasks: TaskState }) => {
  return state.tasks.error;
};

export const selectEditId = (state: { tasks: TaskState }) => {
  return state.tasks.editId;
};

export const selectEditText = (state: { tasks: TaskState }) => {
  return state.tasks.editText;
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
    clearTasks: (state) => {
      state.tasks = [];
      state.error = null;
      state.loading = false;
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
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch tasks';
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.tasks.push(action.payload);
          state.error = null;
        }
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add task';
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
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
        state.loading = false;
        state.error = action.payload as string || 'Failed to update task';
      })
      .addCase(removeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;
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
        state.loading = false;
        state.error = action.payload as string || 'Failed to remove task';
      })
      .addCase(toggleTaskComplete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.tasks.findIndex(t => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
          state.error = null;
        }
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.loading = false;
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
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;