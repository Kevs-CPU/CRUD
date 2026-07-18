import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";
import { v4 as uuidv4 } from "uuid";

export class AddTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  private validateGmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  }

  async execute({
    userId,
    username,
    gmail,
    title,
    currentUserEmail,
  }: {
    userId: string;
    username: string;
    gmail: string;
    title: string;
    currentUserEmail: string;
  }): Promise<Task> {

    // Validate authenticated user
    if (!userId.trim()) {
      throw new Error("User ID is required.");
    }

    if (!username.trim()) {
      throw new Error("Username is required.");
    }

    // Validate Gmail
    if (!gmail.trim()) {
      throw new Error("Gmail address is required.");
    }

    if (!this.validateGmail(gmail.trim())) {
      throw new Error(
        "Please enter a valid Gmail address (example@gmail.com)."
      );
    }

    // Verify Gmail matches logged-in account
    if (gmail.trim().toLowerCase() !== currentUserEmail.trim().toLowerCase()) {
      throw new Error(
        "The entered Gmail does not match the logged-in account."
      );
    }

    // Validate task title
    if (!title.trim()) {
      throw new Error("Task description is required.");
    }

    const task: Task = {
      id: uuidv4(),
      userId,
      username,
      gmail: gmail.trim().toLowerCase(),
      title: title.trim(),
      completed: false,
    };

    return await this.taskRepository.add(task);
  }
}