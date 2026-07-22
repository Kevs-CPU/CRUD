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
    console.log("[GetAllTasksUseCase] Started");

    try {
      const currentUser = await this.getCurrentUser();

      console.log(
        "[GetAllTasksUseCase] Current user:",
        currentUser?.uid
      );

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      if (!currentUser.uid) {
        throw new Error("User ID is required");
      }

      console.log(
        "[GetAllTasksUseCase] Fetching tasks for user:",
        currentUser.uid
      );

      const tasks = await this.taskRepository.getAll(
        currentUser.uid
      );

      console.log(
        "[GetAllTasksUseCase] Tasks fetched successfully:",
        tasks
      );

      return tasks;
    } catch (error) {
      console.error(
        "[GetAllTasksUseCase] Failed to fetch tasks:",
        error
      );

      throw error;
    }
  }
}