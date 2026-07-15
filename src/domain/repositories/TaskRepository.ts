import { Task } from "../entities/Task";

export interface TaskRepository {
  getAll(): Promise<Task[]>;

  getById(id: string): Promise<Task | null>;

  add(task: Task): Promise<Task>;

  update(task: Task): Promise<Task>;

  delete(id: string): Promise<string>;

  findByGmail(gmail: string): Promise<Task | null>;
}