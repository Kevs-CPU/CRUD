export class GetTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(id) {
    return this.repository.getTask(id);
  }
}
