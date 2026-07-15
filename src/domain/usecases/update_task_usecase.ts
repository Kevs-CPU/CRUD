import { TaskRepository } from "../repositories/TaskRepository";

export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  private validateGmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  }

  async execute({
    id,
    gmail,
    title,
    completed,
  }: {
    id: string;
    gmail?: string;
    title?: string;
    completed?: boolean;
  }) {
    if (!id) {
      throw new Error("Task ID is required");
    }

    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (gmail !== undefined) {
      const trimmedGmail = gmail.trim();

      if (!trimmedGmail) {
        throw new Error("Email address is required");
      }

      if (!this.validateGmail(trimmedGmail)) {
        throw new Error(
          "Please enter a valid Gmail address (e.g., name@gmail.com)"
        );
      }

      task.gmail = trimmedGmail;
    }

    if (title !== undefined) {
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        throw new Error("Task description is required");
      }

      task.title = trimmedTitle;
    }

    if (completed !== undefined) {
      task.completed = completed;
    }

    return await this.taskRepository.update(task);
  }
}