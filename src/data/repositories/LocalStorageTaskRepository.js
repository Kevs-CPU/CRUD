import { nanoid } from "@reduxjs/toolkit";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { Task } from "../../domain/entities/Task";

const STORAGE_KEY = "todo_ml_v3";

export class LocalStorageTaskRepository extends ITaskRepository {
  _read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw).map((t) => new Task(t)) : [];
    } catch {
      return [];
    }
  }

  _write(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  addTask({ title, list }) {
    const tasks = this._read();
    const task = new Task({ id: nanoid(), title, list, done: false });
    tasks.push(task);
    this._write(tasks);
    return task;
  }

  removeTask(id) {
    const tasks = this._read().filter((t) => t.id !== id);
    this._write(tasks);
  }

  updateTask(id, changes) {
    const tasks = this._read();
    const task = tasks.find((t) => t.id === id);
    if (!task) return null;
    Object.assign(task, changes);
    this._write(tasks);
    return task;
  }

  getAllTasks() {
    return this._read();
  }

  getTask(id) {
    return this._read().find((t) => t.id === id) ?? null;
  }
}