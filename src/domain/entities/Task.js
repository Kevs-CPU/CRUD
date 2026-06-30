export class Task {
  constructor({ id, title, list = "default", done = false }) {
    
    this.id = id;
    this.title = title;
  }
}
