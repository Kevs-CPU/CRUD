import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../firebase/config";

export class AddTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {
    console.log("[AddTaskUseCase] Initialized");
  }

  private getCurrentUser(): Promise<any> {
    console.log("[AddTaskUseCase] Getting current authenticated user...");

    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe();

        console.log(
          "[AddTaskUseCase] Auth state received:",
          user?.uid || "No authenticated user"
        );

        resolve(user);
      });
    });
  }

  private validateGmail(email: string): boolean {
    console.log("[AddTaskUseCase] Validating Gmail address:", email);

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const isValid = gmailRegex.test(email);

    console.log(
      "[AddTaskUseCase] Gmail validation result:",
      isValid
    );

    return isValid;
  }

  async execute({
    gmail,
    title,
  }: {
    gmail: string;
    title: string;
  }): Promise<Task> {
    console.log("[AddTaskUseCase] Started:", {
      gmail,
      title,
    });

    try {
      const currentUser = await this.getCurrentUser();

      console.log(
        "[AddTaskUseCase] Current user:",
        {
          uid: currentUser?.uid,
          email: currentUser?.email,
        }
      );

      if (!currentUser) {
        console.error(
          "[AddTaskUseCase] User is not authenticated"
        );

        throw new Error(
          "User not authenticated. Please log in again."
        );
      }

      if (!currentUser.uid) {
        console.error(
          "[AddTaskUseCase] User ID is missing"
        );

        throw new Error(
          "User ID is required."
        );
      }

      const cleanGmail = gmail.trim().toLowerCase();
      const cleanTitle = title.trim();

      console.log("[AddTaskUseCase] Cleaned input:", {
        gmail: cleanGmail,
        title: cleanTitle,
      });

      if (!cleanGmail) {
        console.error(
          "[AddTaskUseCase] Gmail address is empty"
        );

        throw new Error(
          "Gmail address is required."
        );
      }

      if (!this.validateGmail(cleanGmail)) {
        console.error(
          "[AddTaskUseCase] Invalid Gmail format:",
          cleanGmail
        );

        throw new Error(
          "Please enter a valid Gmail address ending with @gmail.com."
        );
      }

      const registeredGmail = currentUser.email
        ?.trim()
        .toLowerCase();

      console.log(
        "[AddTaskUseCase] Registered Gmail:",
        registeredGmail
      );

      if (!registeredGmail) {
        console.error(
          "[AddTaskUseCase] No registered Gmail found"
        );

        throw new Error(
          "No registered Gmail address was found for this account."
        );
      }

      if (cleanGmail !== registeredGmail) {
        console.error(
          "[AddTaskUseCase] Gmail does not match authenticated user"
        );

        throw new Error(
          "Invalid Gmail address."
        );
      }

      if (!cleanTitle) {
        console.error(
          "[AddTaskUseCase] Task description is empty"
        );

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

      console.log(
        "[AddTaskUseCase] Task created:",
        task
      );

      const result = await this.taskRepository.add(task);

      console.log(
        "[AddTaskUseCase] Task added successfully:",
        result
      );

      return result;
    } catch (error: any) {
      console.error(
        "[AddTaskUseCase] Failed:",
        error
      );

      throw error;
    }
  }
}