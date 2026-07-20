import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";
import { auth } from "../../firebase/config";

export class GetAllTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  private getCurrentUser(): Promise<any> {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  async execute(): Promise<Task[]> {
    const currentUser = await this.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    if (!currentUser.uid) {
      throw new Error('User ID is required');
    }

    return await this.taskRepository.getAll(currentUser.uid);
  }
}