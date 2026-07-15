// src/app/taskUseCaseProvider.js
import { InMemoryTaskRepository } from "../data/repositories/InMemoryTaskRepository";
import { LocalStorageTaskRepository } from "../data/repositories/LocalStorageTaskRepository";

import { AddTaskUseCase } from "../domain/usecases/add_task_usecase";
import { RemoveTaskUseCase } from "../domain/usecases/remove_task_usecase";
import { UpdateTaskUseCase } from "../domain/usecases/update_task_usecase";
import { GetAllTasksUseCase } from "../domain/usecases/get_all_tasks_usecase";

const REPOSITORY_TYPE = "localStorage";

let repositoryInstance = null;

function getTaskRepository() {
  if (repositoryInstance) return repositoryInstance;

  try {
    if (REPOSITORY_TYPE === "localStorage") {
      repositoryInstance = new LocalStorageTaskRepository();
    } else {
      repositoryInstance = new InMemoryTaskRepository();
    }
  } catch (err) {
    console.error("Failed to initialize repository:", err);
    repositoryInstance = new InMemoryTaskRepository();
  }

  return repositoryInstance;
}

const repo = getTaskRepository();

export const addTaskUseCase = new AddTaskUseCase(repo);
export const removeTaskUseCase = new RemoveTaskUseCase(repo);
export const updateTaskUseCase = new UpdateTaskUseCase(repo);
export const getAllTasksUseCase = new GetAllTasksUseCase(repo);