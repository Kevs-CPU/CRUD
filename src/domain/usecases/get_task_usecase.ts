import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class GetTaskUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(id: string): Promise<Task | null> {
    if (!id || !id.trim()) {
      throw new Error("Task ID is required");
    }

    return await this.taskRepository.getById(id);
  }
}