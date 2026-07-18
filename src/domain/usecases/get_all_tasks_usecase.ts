// src/domain/usecases/get_all_tasks_usecase.ts

import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class GetAllTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    if (!userId?.trim()) {
      throw new Error("User ID is required.");
    }

    return await this.taskRepository.getAll(userId);
  }
}