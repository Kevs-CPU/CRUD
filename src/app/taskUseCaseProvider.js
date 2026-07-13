import { AddTaskUseCase } from "../domain/usecases/add_task_usecase";
import { RemoveTaskUseCase } from "../domain/usecases/remove_task_usecase";
import { UpdateTaskUseCase } from "../domain/usecases/update_task_usecase";
import { GetAllTaskUseCase } from "../domain/usecases/get_all_tasks_usecase";

const repo = getTaskRepository();

export const addTaskUseCase = new AddTaskUseCase(repo);
export const removeTaskUseCase = new RemoveTaskUseCase(repo);
export const updateTaskUseCase = new UpdateTaskUseCase(repo);
export const getAllTasksUseCase = new GetAllTaskUseCase(repo);