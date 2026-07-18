import { TaskRepository } from "../repositories/TaskRepository";

export class RemoveTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  // ✅ Updated to accept 2 arguments: id and userId
  async execute(id: string, userId: string): Promise<string> {
    // Validate ID
    if (!id?.trim()) {
      throw new Error("Task ID is required");
    }

    // Validate userId
    if (!userId?.trim()) {
      throw new Error("User ID is required");
    }

    // Get existing task
    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new Error("Task not found");
    }

    // ✅ Validate user owns the task (Security)
    if (task.userId !== userId) {
      throw new Error("You do not have permission to delete this task");
    }

    // Delete the task
    return await this.taskRepository.remove(id);
  }
}