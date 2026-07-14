import { ITaskRepository } from '../repositories/ITaskRepository';

export class AddTaskUseCase {
  private taskRepository: ITaskRepository;

  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  private validateGmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  }

  async execute(gmail: string, taskDescription: string) {
    if (!gmail || !gmail.trim()) {
      throw new Error('Gmail address is required');
    }

    if (!this.validateGmail(gmail.trim())) {
      throw new Error('Please enter a valid Gmail address (e.g., name@gmail.com)');
    }

    if (!taskDescription || !taskDescription.trim()) {
      throw new Error('Task description is required');
    }

    const fullTitle = `${gmail.trim()} - ${taskDescription.trim()}`;

    const task = {
      title: fullTitle,
      completed: false
    };

    return await this.taskRepository.add(task);
  }
}