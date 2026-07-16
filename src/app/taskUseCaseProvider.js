import { FirebaseTaskRepository } from "../data/repositories/FirebaseTaskRepository"; // new import 
import { InMemoryTaskRepository } from "../data/repositories/InMemoryTaskRepository";
import { LocalStorageTaskRepository } from "../data/repositories/LocalStorageTaskRepository";

import { AddTaskUseCase } from "../domain/usecases/add_task_usecase";
import { RemoveTaskUseCase } from "../domain/usecases/remove_task_usecase";
import { UpdateTaskUseCase } from "../domain/usecases/update_task_usecase";
import { GetAllTasksUseCase } from "../domain/usecases/get_all_tasks_usecase";

const REPOSITORY_TYPE = "firebase"; // localstorage change into firebase 

let repositoryInstance = null;

function getTaskRepository() {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  try {
    switch (REPOSITORY_TYPE) {
      case "firebase": ///////// firebase
        repositoryInstance = new FirebaseTaskRepository();
        break;

      case "localStorage": 
        repositoryInstance = new LocalStorageTaskRepository();
        break;

      case "memory":
      default:
        repositoryInstance = new InMemoryTaskRepository();
        break;
    }
  } catch (error) {
    console.error("Failed to initialize repository:", error);
    repositoryInstance = new InMemoryTaskRepository();
  }

  return repositoryInstance;
}

const repository = getTaskRepository();

export const addTaskUseCase = new AddTaskUseCase(repository);
export const removeTaskUseCase = new RemoveTaskUseCase(repository);
export const updateTaskUseCase = new UpdateTaskUseCase(repository);
export const getAllTasksUseCase = new GetAllTasksUseCase(repository);