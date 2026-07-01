export class get_all_tasks_usecase {
  constructor(repository) {
    this.repository = repository;
  }

  execute() {
    return this.repository.getAllTasks();
  }
}
