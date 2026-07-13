import { nanoid } from "@reduxjs/toolkit";
import { Task } from "../../domain/entities/Task";

export class InMemoryTaskRepository {
  constructor(initialTasks = []) {
    this.tasks = initialTasks.map((t) => new Task(t));
  }

  addTask({ title }) {
    const task = new Task({ id: nanoid(), title });
    this.tasks.push(task);
    return task;
  }

  getAllTasks() {
    return [...this.tasks];
  }

  updateTask(id, changes) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, changes);
    return task;
  }

  removeTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}