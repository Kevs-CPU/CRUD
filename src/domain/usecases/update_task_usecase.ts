import { TaskRepository } from "../repositories/TaskRepository";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute({
    id,
    title,
    completed,
    userId, // ✅ Added userId parameter
  }: {
    id: string;
    title?: string;
    completed?: boolean;
    userId: string; // ✅ Required parameter
  }) {
    // Validate ID
    if (!id?.trim()) {
      throw new Error("Task ID is required.");
    }

    // Validate userId
    if (!userId?.trim()) {
      throw new Error("User ID is required.");
    }

    // Get existing task
    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new Error("Task not found.");
    }

    // ✅ Validate user owns the task (Security)
    if (task.userId !== userId) {
      throw new Error("You do not have permission to update this task.");
    }

    // Validate and update title if provided
    if (title !== undefined) {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        throw new Error("Task description is required.");
      }

      if (trimmedTitle.length < 3) {
        throw new Error("Task must be at least 3 characters long.");
      }

      if (trimmedTitle.length > 200) {
        throw new Error("Task must be less than 200 characters.");
      }

      task.title = trimmedTitle;
    }

    // Update completed status if provided
    if (completed !== undefined) {
      task.completed = completed;
    }

    // Save updated task
    return await this.taskRepository.update(task);
  }
}