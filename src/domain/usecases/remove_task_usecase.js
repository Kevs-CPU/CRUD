export class remove_task_usecase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(id) {
    if (!id) throw new Error("Task id is required");
    this.repository.removeTask(id);
  }
}
