// src/domain/usecases/remove_task_usecase.ts

import { LocalStorageTaskRepository } from "../../data/repositories/LocalStorageTaskRepository";

export class RemoveTaskUseCase {
  constructor(private taskRepository: LocalStorageTaskRepository) {}

  async execute(id: string): Promise<string> {
    if (!id) {
      throw new Error("Task ID is required");
    }

    // Check if task exists
    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    await this.taskRepository.delete(id);

    return id;
  }
}