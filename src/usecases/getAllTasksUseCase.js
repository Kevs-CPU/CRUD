export class GetAllTasksUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.getAllTasks();
  }
}
