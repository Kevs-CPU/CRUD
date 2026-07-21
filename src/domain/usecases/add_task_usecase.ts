import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../firebase/config";

export class AddTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  private getCurrentUser(): Promise<any> {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  private validateGmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  }

  async execute({
    gmail,
    title,
  }: {
    gmail: string;
    title: string;
  }): Promise<Task> {

    const currentUser = await this.getCurrentUser();

    if (!currentUser) {
      throw new Error(
        "User not authenticated. Please log in again."
      );
    }

    if (!currentUser.uid) {
      throw new Error(
        "User ID is required."
      );
    }

    const cleanGmail = gmail.trim().toLowerCase();
    const cleanTitle = title.trim();

    if (!cleanGmail) {
      throw new Error(
        "Gmail address is required."
      );
    }

    if (!this.validateGmail(cleanGmail)) {
      throw new Error(
        "Please enter a valid Gmail address ending with @gmail.com."
      );
    }

    const registeredGmail = currentUser.email
      ?.trim()
      .toLowerCase();

    if (!registeredGmail) {
      throw new Error(
        "No registered Gmail address was found for this account."
      );
    }

    if (cleanGmail !== registeredGmail) {
      throw new Error(
        "Invalid Gmail address."
      );
    }

    if (!cleanTitle) {
      throw new Error(
        "Task description is required."
      );
    }

    const task: Task = {
      id: uuidv4(),
      userId: currentUser.uid,
      username:
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        "User",
      gmail: cleanGmail,
      title: cleanTitle,
      completed: false,
    };

    return await this.taskRepository.add(task);
  }
}