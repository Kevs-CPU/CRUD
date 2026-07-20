import { TaskRepository } from "../repositories/TaskRepository";
import { auth } from "../../firebase/config";

export class RemoveTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  private getCurrentUser(): Promise<any> {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  async execute(id: string): Promise<string> {
    const currentUser = await this.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    if (!currentUser.uid) {
      throw new Error('User ID is required');
    }

    // Validate ID
    if (!id?.trim()) {
      throw new Error("Task ID is required");
    }

    const task = await this.taskRepository.getById(id);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== currentUser.uid) {
      throw new Error("You do not have permission to delete this task");
    }

    return await this.taskRepository.remove(id);
  }
}