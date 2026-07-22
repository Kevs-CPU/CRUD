import { createSlice, createAsyncThunk, createSelector, PayloadAction } from "@reduxjs/toolkit";
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
  filter: "active",
  editId: null,
  editText: "",
};

export const fetchTasks = createAsyncThunk<Task[]>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    console.log("[Redux] fetchTasks started");

    try {
      const result = await getAllTasksUseCase.execute();
      console.log("[Redux] fetchTasks success:", result);
      return result as Task[];
    } catch (error: any) {
      console.error("[Redux] fetchTasks failed:", error);
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk<Task, { gmail: string; task: string }>(
  'tasks/addTask',
  async ({ gmail, task }, { rejectWithValue }) => {
    console.log("[Redux] addTask started:", { gmail, task });

    try {
      const result = await addTaskUseCase.execute({
        gmail: gmail,
        title: task,
      });
      console.log("[Redux] addTask success:", result);
      return result as Task;
    } catch (error: any) {
      console.error("[Redux] addTask failed:", error);
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
    console.log("[Redux] updateTask started:", { id, title, completed });

    try {
      const result = await updateTaskUseCase.execute({ id, title, completed });
      console.log("[Redux] updateTask success:", result);
      return result as Task;
    } catch (error: any) {
      console.error("[Redux] updateTask failed:", error);
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const removeTask = createAsyncThunk<string, string>(
  'tasks/removeTask',
  async (id, { rejectWithValue }) => {
    console.log("[Redux] removeTask started:", id);

    try {
      const result = await removeTaskUseCase.execute(id);
      console.log("[Redux] removeTask success:", result);
      return result as string;
    } catch (error: any) {
      console.error("[Redux] removeTask failed:", error);
      return rejectWithValue(error.message || 'Failed to remove task');
    }
  }
);

export const toggleTaskComplete = createAsyncThunk<Task, string>(
  'tasks/toggleTaskComplete',
  async (id, { getState, rejectWithValue }) => {
    console.log("[Redux] toggleTaskComplete started:", id);

    try {
      const state = getState() as { tasks: TaskState };
      const task = state.tasks.tasks.find((t: Task) => t.id === id);

      if (!task) {
        throw new Error('Task not found');
      }

      console.log("[Redux] toggleTaskComplete - toggling from:", {
        id,
        currentStatus: task.completed,
        newStatus: !task.completed,
      });

      const result = await updateTaskUseCase.execute({
        id,
        completed: !task.completed,
      });

      console.log("[Redux] toggleTaskComplete success:", result);
      return result as Task;
    } catch (error: any) {
      console.error("[Redux] toggleTaskComplete failed:", error);
      return rejectWithValue(error.message || 'Failed to toggle task');
    }
  }
);

// ==================== SELECTORS ====================
const selectTasks = (state: { tasks: TaskState }): Task[] => state.tasks.tasks;
const selectFilterState = (state: { tasks: TaskState }): FilterType => state.tasks.filter;

// ✅ FIXED: "all" filter returns ALL tasks
export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilterState],
  (tasks: Task[], filter: FilterType): Task[] => {
    if (filter === "completed") {
      return tasks.filter((task: Task) => task.completed);
    }
    if (filter === "active") {
      return tasks.filter((task: Task) => !task.completed);
    }
    // "all" - return all tasks
    return tasks;
  }
);

export const selectActiveCount = createSelector(
  [selectTasks],
  (tasks: Task[]): number => tasks.filter((task: Task) => !task.completed).length
);

export const selectCompletedCount = createSelector(
  [selectTasks],
  (tasks: Task[]): number => tasks.filter((task: Task) => task.completed).length
);

export const selectTotalCount = createSelector(
  [selectTasks],
  (tasks: Task[]): number => tasks.length
);

export const selectFilter = (state: { tasks: TaskState }): FilterType => state.tasks.filter;
export const selectLoading = (state: { tasks: TaskState }): boolean => state.tasks.loading;
export const selectError = (state: { tasks: TaskState }): string | null => state.tasks.error;
export const selectEditId = (state: { tasks: TaskState }): string | null => state.tasks.editId;
export const selectEditText = (state: { tasks: TaskState }): string => state.tasks.editText;

// ==================== SLICE ====================
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
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload || [];
        state.error = null;
        console.log("[Redux] fetchTasks - State updated:", {
          totalTasks: state.tasks.length,
          activeTasks: state.tasks.filter(t => !t.completed).length,
          completedTasks: state.tasks.filter(t => t.completed).length
        });
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch tasks';
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        if (action.payload) {
          state.tasks.push(action.payload);
          state.error = null;
          console.log("[Redux] addTask - State updated:", {
            taskId: action.payload.id,
            totalTasks: state.tasks.length,
            activeTasks: state.tasks.filter(t => !t.completed).length,
            completedTasks: state.tasks.filter(t => t.completed).length
          });
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
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        if (action.payload) {
          const index = state.tasks.findIndex((t: Task) => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
          state.error = null;
          state.editId = null;
          state.editText = '';
          console.log("[Redux] updateTask - State updated:", {
            taskId: action.payload.id,
            totalTasks: state.tasks.length,
            activeTasks: state.tasks.filter(t => !t.completed).length,
            completedTasks: state.tasks.filter(t => t.completed).length
          });
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
      .addCase(removeTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        if (action.payload) {
          state.tasks = state.tasks.filter((t: Task) => t.id !== action.payload);
          state.error = null;
          if (state.editId === action.payload) {
            state.editId = null;
            state.editText = '';
          }
          console.log("[Redux] removeTask - State updated:", {
            removedId: action.payload,
            totalTasks: state.tasks.length,
            activeTasks: state.tasks.filter(t => !t.completed).length,
            completedTasks: state.tasks.filter(t => t.completed).length
          });
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
      .addCase(toggleTaskComplete.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        if (action.payload) {
          const index = state.tasks.findIndex((t: Task) => t.id === action.payload.id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
          state.error = null;
          console.log("[Redux] toggleTaskComplete - State updated:", {
            taskId: action.payload.id,
            completed: action.payload.completed,
            totalTasks: state.tasks.length,
            activeTasks: state.tasks.filter(t => !t.completed).length,
            completedTasks: state.tasks.filter(t => t.completed).length
          });
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