import { TaskRepository } from "../repositories/TaskRepository";

export class RemoveTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, userId: string): Promise<string> {
    // Validate ID
    if (!id?.trim()) {
      throw new Error("Task ID is required");
    }

    if (!userId?.trim()) {
      throw new Error("User ID is required");
    }

    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== userId) {
      throw new Error("You do not have permission to delete this task");
    }

    return await this.taskRepository.remove(id);
  }
}