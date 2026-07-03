export class UpdateTaskUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  execute(id, changes) {
    if (!id) throw new Error("Task id is required");

    if ("title" in changes) {
      const trimmed = changes.title?.trim();
      if (!trimmed) throw new Error("Task title cannot be empty");
      changes = { ...changes, title: trimmed };
    }

    const updated = this.repository.updateTask(id, changes);
    if (!updated) throw new Error(`Task with id "${id}" was not found`);
    return updated;
  }
}
