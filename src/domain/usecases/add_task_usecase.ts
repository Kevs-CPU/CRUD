import { Task } from '../entities/Task';
import { TaskRepository } from '../repositories/TaskRepository';
import { v4 as uuidv4 } from 'uuid';

export class AddTaskUseCase {
  private readonly taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  private validateGmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  }

  async execute(
    gmail: string,
    currentUserEmail: string,
    taskDescription: string
  ): Promise<Task> {

    // Validate Gmail input
    if (!gmail?.trim()) {
      throw new Error('Gmail address is required');
    }

    // Validate Gmail format
    if (!this.validateGmail(gmail.trim())) {
      throw new Error('Please enter a valid Gmail address (e.g., name@gmail.com)');
    }

    // Validate logged-in user
    if (!currentUserEmail?.trim()) {
      throw new Error('No authenticated user found');
    }

    // Check if Gmail matches logged-in user
    if (gmail.trim().toLowerCase() !== currentUserEmail.trim().toLowerCase()) {
      throw new Error('The Gmail does not match the currently logged-in account.');
    }

    // Validate task description
    if (!taskDescription?.trim()) {
      throw new Error('Task description is required');
    }

    // Create new task
    const newTask: Task = {
      id: uuidv4(),
      gmail: gmail.trim(),
      title: taskDescription.trim(),
      completed: false,
    };

    return await this.taskRepository.add(newTask);
  }
}