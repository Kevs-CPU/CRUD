// src/domain/usecases/remove_task_usecase.ts
import { TaskRepository } from "../repositories/TaskRepository";

export class RemoveTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<string> {
    if (!id) {
      throw new Error("Task ID is required");
    }

    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    await this.taskRepository.delete(id);

    return id;
  }
}