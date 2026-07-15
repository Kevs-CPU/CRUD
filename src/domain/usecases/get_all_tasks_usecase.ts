// src/domain/usecases/get_all_tasks_usecase.ts

import { Task } from '../entities/Task';
import { TaskRepository } from '../repositories/TaskRepository';

export class GetAllTasksUseCase {
  private taskRepository: TaskRepository;

  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(): Promise<Task[]> {
    return await this.taskRepository.getAll();
  }
}