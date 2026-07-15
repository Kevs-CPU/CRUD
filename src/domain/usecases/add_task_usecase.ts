// src/domain/usecases/add_task_usecase.ts

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

  async execute(gmail: string, taskDescription: string): Promise<Task> {
    // Validate gmail
    if (!gmail?.trim()) {
      throw new Error('Gmail address is required');
    }

    if (!this.validateGmail(gmail.trim())) {
      throw new Error('Please enter a valid Gmail address (e.g., name@gmail.com)');
    }

    // Validate task description
    if (!taskDescription?.trim()) {
      throw new Error('Task description is required');
    }

    // Create new task with proper structure
    const newTask: Task = {
      id: uuidv4(),           //  Add id
      gmail: gmail.trim(),    //  Add gmail
      title: taskDescription.trim(),
      completed: false
    };

    return await this.taskRepository.add(newTask);
  }
}