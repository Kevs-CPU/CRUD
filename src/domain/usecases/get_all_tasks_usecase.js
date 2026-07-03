export class GetAllTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.getAllTasks();
  }
}
