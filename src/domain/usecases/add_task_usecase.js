export class add_task_UseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute({ title }) {
    const trimmed = title?.trim();
    if (!trimmed) {
      throw new Error("Task title cannot be empty");
    }
    return this.repository.addTask({ title: trimmed });
  }
  }