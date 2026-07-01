export class get_task_usecase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(id) {
    return this.repository.getTask(id);
  }
}
