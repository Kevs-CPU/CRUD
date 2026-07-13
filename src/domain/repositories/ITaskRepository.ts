export interface Task {
  id: string;
  title: string;
}

export interface ITaskRepository {
  addTask(input: { title: string }): Task | Promise<Task>;
  getAllTasks(): Task[] | Promise<Task[]>;
  updateTask(id: string, changes: Partial<Task>): Task | null | Promise<Task | null>;
  removeTask(id: string): void | Promise<void>;
}