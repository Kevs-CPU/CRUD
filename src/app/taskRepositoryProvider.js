import { InMemoryTaskRepository } from "../data/repositories/InMemoryTaskRepository";
import { LocalStorageTaskRepository } from "../data/repositories/LocalStorageTaskRepository";

const INIT_TASKS = [
  { id: "1", title: "Buy groceries",         list: "shopping", done: false },
  { id: "2", title: "Read a book",           list: "personal", done: false },
  { id: "3", title: "Finish project report", list: "work",     done: true },
  { id: "4", title: "Pay utility bills",     list: "default",  done: false },
];

const REPOSITORY_TYPE = "localStorage";

let repositoryInstance = null;

export function getTaskRepository() {
  if (repositoryInstance) return repositoryInstance;

  console.log(`Initializing repository: ${REPOSITORY_TYPE}`);

  try {
    const isLocalStorage = REPOSITORY_TYPE === "localStorage";
    
    repositoryInstance = isLocalStorage
      ? new LocalStorageTaskRepository()
      : new InMemoryTaskRepository(INIT_TASKS);

    console.log(`${isLocalStorage ? "LocalStorage" : "InMemory"} repository initialized successfully`);
  } catch (error) {
    console.error("Failed to initialize repository:", error);
    repositoryInstance = new InMemoryTaskRepository(INIT_TASKS);
  }

  return repositoryInstance;
}