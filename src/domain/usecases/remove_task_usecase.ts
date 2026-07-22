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
    console.log("[RemoveTaskUseCase] Started:", id);

    try {
      const currentUser = await this.getCurrentUser();

      console.log(
        "[RemoveTaskUseCase] Current user:",
        currentUser?.uid
      );

      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      if (!currentUser.uid) {
        throw new Error("User ID is required");
      }

      if (!id?.trim()) {
        throw new Error("Task ID is required");
      }

      console.log(
        "[RemoveTaskUseCase] Getting task:",
        id
      );

      const task = await this.taskRepository.getById(id);

      console.log(
        "[RemoveTaskUseCase] Task found:",
        task
      );

      if (!task) {
        throw new Error("Task not found");
      }

      if (task.userId !== currentUser.uid) {
        throw new Error(
          "You do not have permission to delete this task"
        );
      }

      console.log(
        "[RemoveTaskUseCase] Removing task:",
        id
      );

      const result = await this.taskRepository.remove(id);

      console.log(
        "[RemoveTaskUseCase] Remove successful:",
        result
      );

      return result;
    } catch (error) {
      console.error(
        "[RemoveTaskUseCase] Remove failed:",
        error
      );

      throw error;
    }
  }
}