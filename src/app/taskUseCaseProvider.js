import { getTaskRepository } from "./taskRepositoryProvider";
import { add_task_UseCase } from "../domain/usecases/add_task_usecase";
import { remove_task_usecase } from "../domain/usecases/remove_task_usecase";
import { update_task_usecase } from "../domain/usecases/update_task_usecase";
import { get_all_tasks_usecase } from "../domain/usecases/get_all_tasks_usecase";
import { get_task_usecase } from "../domain/usecases/get_task_usecase";

const repo = getTaskRepository();

export const addTaskUseCase = new add_task_UseCase(repo);
export const removeTaskUseCase = new remove_task_usecase(repo);
export const updateTaskUseCase = new update_task_usecase(repo);
export const getAllTasksUseCase = new get_all_tasks_usecase(repo);
export const getTaskUseCase = new get_task_usecase(repo);