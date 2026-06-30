import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTaskRepository } from '../../app/taskRepositoryProvider';
import { AddTaskUseCase } from "../../usecases/addTaskUseCase";
import { RemoveTaskUseCase } from "../../usecases/removeTaskUseCase";
import { UpdateTaskUseCase } from "../../usecases/updateTaskUseCase";
import { GetAllTasksUseCase } from "../../usecases/getAllTasksUseCase";
import { GetTaskUseCase } from "../../usecases/getTaskUseCase";

interface Task {
  id: string;
  title: string;
  list: string; 
  done: boolean;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const repo = () => getTaskRepository();

const toPlainTask = (t: any): Task => ({
  id: t.id,
  title: t.title,
  list: t.list,
  done: t.done,
});

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const usecase = new GetAllTasksUseCase(repo());
      const tasks = await usecase.execute();
      return tasks.map(toPlainTask);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/add",
  async (payload: { title: string; list: string }, { rejectWithValue }) => {
    try {
      const usecase = new AddTaskUseCase(repo());
      const result = await usecase.execute(payload);
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
      const usecase = new RemoveTaskUseCase(repo());
      await usecase.execute(id);
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
      const usecase = new UpdateTaskUseCase(repo());
      const result = await usecase.execute(payload.id, { title: payload.title });
      return toPlainTask(result);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleTask = createAsyncThunk(
  "tasks/toggle",
  async (id: string, { rejectWithValue }) => {
    try {
      const getUsecase = new GetTaskUseCase(repo());
      const current = await getUsecase.execute(id);
      if (!current) throw new Error("Task not found");

      const updateUsecase = new UpdateTaskUseCase(repo());
      const result = await updateUsecase.execute(id, { done: !current.done });
      return toPlainTask(result);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTasks
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

      // addTask
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

      // removeTask
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

      // updateTask
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
      })

      // toggleTask
      .addCase(toggleTask.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        const i = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (i !== -1) state.tasks[i] = action.payload;
      })
      .addCase(toggleTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default taskSlice.reducer;