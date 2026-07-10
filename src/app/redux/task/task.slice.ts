import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addTaskUseCase,
  removeTaskUseCase,
  updateTaskUseCase,
  getAllTasksUseCase,
  getTaskUseCase,
} from "../../taskUseCaseProvider";

interface Task {
  id: string;
  title: string;
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
};

const toPlainTask = (t: any): Task => ({
  id: t.id,
  title: t.title,
});

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await getAllTasksUseCase.execute();
      return tasks.map(toPlainTask);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const task = await getTaskUseCase.execute(id);
      return toPlainTask(task);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/add",
  async (payload: { title: string }, { rejectWithValue }) => {
    try {
      const result = await addTaskUseCase.execute(payload);
      return toPlainTask(result);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeTask = createAsyncThunk(
  "tasks/remove",
  async (id: string, { rejectWithValue }) => {
    try {
      await removeTaskUseCase.execute(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (payload: { id: string; title: string }, { rejectWithValue }) => {
    try {
      const result = await updateTaskUseCase.execute(payload.id, { title: payload.title });
      return toPlainTask(result);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearSelectedTask: (state) => {
      state.selectedTask = null;
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
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(removeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const i = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (i !== -1) state.tasks[i] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedTask } = taskSlice.actions;
export default taskSlice.reducer;