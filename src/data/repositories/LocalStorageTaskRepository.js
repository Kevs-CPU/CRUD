const STORAGE_KEY = "tasks";

export class LocalStorageTaskRepository {
  async getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to read tasks:", error);
      return [];
    }
  }

  async getById(id) {
    const tasks = await this.getAll();
    return tasks.find((task) => task.id === id) || null;
  }

  async add(task) {
    const tasks = await this.getAll();

    tasks.push(task);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    return task;
  }

  async update(task) {
    const tasks = await this.getAll();

    const index = tasks.findIndex((t) => t.id === task.id);

    if (index === -1) {
      throw new Error("Task not found");
    }

    tasks[index] = {
      ...tasks[index],
      ...task,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    return tasks[index];
  }

  async remove(id) {
    const tasks = await this.getAll();

    const filtered = tasks.filter((t) => t.id !== id);

    if (filtered.length === tasks.length) {
      throw new Error("Task not found");
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    return id;
  }

  async findByGmail(gmail) {
    const tasks = await this.getAll();
    return tasks.find((task) => task.gmail === gmail) || null;
  }

  async clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}