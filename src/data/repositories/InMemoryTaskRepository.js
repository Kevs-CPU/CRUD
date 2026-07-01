import { nanoid } from "@reduxjs/toolkit";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";

export class InMemoryTaskRepository extends ITaskRepository {
  constructor(initialTasks = []) {
    super();
    this.tasks = initialTasks.map((t) => new Task(t));
  }

  addTask({ title }) {
    const task = new Task({ id: nanoid(), title });
    this.tasks.push(task);
    return task;
  }

  removeTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  updateTask(id, changes) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, changes);
    return task;
  }

  getAllTasks() {
    return [...this.tasks];
  }

  getTask(id) {
    return this.tasks.find((t) => t.id === id) ?? null;
  }
}