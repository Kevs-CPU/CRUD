import { TaskRepository } from "../repositories/TaskRepository";

export class RemoveTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<string> {
    if (!id || !id.trim()) {
      throw new Error("Task ID is required");
    }

    return await this.taskRepository.remove(id);
  }
}