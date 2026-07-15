let tasks = [];

export class InMemoryTaskRepository {
  async getAll() {
    return [...tasks];
  }

  async getById(id) {
    return tasks.find(task => task.id === id) || null;
  }

  async add(task) {
    tasks.push(task);
    return task;
  }

  async update(task) {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index === -1) throw new Error('Task not found');
    tasks[index] = { ...tasks[index], ...task };
    return tasks[index];
  }

  async delete(id) {
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length === tasks.length) throw new Error('Task not found');
    tasks = filtered;
    return id;
  }

  async findByGmail(gmail) {
    return tasks.find(task => task.gmail === gmail) || null;
  }

  clear() {
    tasks = [];
  }
}