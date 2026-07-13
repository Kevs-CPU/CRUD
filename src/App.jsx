import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask as addTaskAction,
  removeTask as removeTaskAction,
  updateTask as updateTaskAction,
} from "./app/redux/task/task.slice";
import TodoTable from "./app/components/todo/TodoTable";
import "./App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_DOMAINS = ["gmail.com"];

export default function App() {
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const addTask = () => {
    const value = input.trim();

    if (!value) {
      setInputError("Email is required.");
      return;
    }

    if (!EMAIL_REGEX.test(value)) {
      setInputError("Please enter a valid email domain (e.g. gmail.com).");
      return;
    }

    const domain = value.split("@")[1].toLowerCase();
    if (!VALID_DOMAINS.includes(domain)) {
      setInputError("Please enter a valid email domain (e.g. gmail.com).");
      return;
    }

    dispatch(addTaskAction({ title: value }));
    setInput("");
    setInputError("");
  };

  const deleteTask = (id) => {
    if (editId === id) resetEdit();
    dispatch(removeTaskAction(id));
  };

  const startEdit = (t) => {
    setEditId(t.id);
    setEditText(t.title);
  };

  const resetEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = (id) => {
    const text = editText.trim();
    if (text) dispatch(updateTaskAction({ id, title: text }));
    resetEdit();
  };

  return (
    <div className="app-layout">
    <div className="main-wrapper">

    {inputError && (
      <div className="toast-container">
        <div className="toast-error">
          <span className="toast-icon">!</span>
          <div className="toast-body">
            <p className="toast-title">Invalid email</p>
            <p className="toast-message">{inputError}</p>
          </div>
          <button className="toast-close" onClick={() => setInputError("")} aria-label="Dismiss">✕</button>
        </div>
      </div>
    )}

         <header className="main-header">
    <div className="main-header-text">
        
        <h1>To Do List</h1>
          <p>{tasks.length} task{tasks.length !== 1 ? "s" : ""}</p>
            
    </div>
         </header >
    <div className="add-row">
        <input
            className={`add-input${inputError ? " add-input-error" : ""}`}
            name="newTask"
            id="newTask"
            placeholder="Add a new task…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (inputError) setInputError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
          <button className="add-btn" onClick={addTask}>Add</button>
    </div>

        <ul className="task-list">
          {loading && <li className="empty-state"><span>Loading…</span></li>}

          {!loading && tasks.length === 0 && (
            <li className="empty-state"><span>No tasks yet.</span></li>
          )}

          {tasks.map((todo) => (
            <li key={todo.id} className="task-item">
    <div className="task-content">
        {editId === todo.id ? (
          <input
            className="edit-input"
            name={`editTask-${todo.id}`}
            id={`editTask-${todo.id}`}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(todo.id);
              if (e.key === "Escape") resetEdit();
                }}
                autoFocus
          />
              ) : (
              <span className="task-text">{todo.title}</span>
                )}
    </div>
    <div className="task-actions">
        {editId === todo.id ? (
            <>
        <button className="icon-btn save-btn" onClick={() => saveEdit(todo.id)} aria-label="Save">
            ✓
        </button>
        <button className="icon-btn" onClick={resetEdit} aria-label="Cancel">
            ✕
        </button>
            </>
              ) : (
                  <>
        <button className="icon-btn" onClick={() => startEdit(todo)} aria-label="Edit">
            ✎
        </button>
        <button className="icon-btn delete-btn" onClick={() => deleteTask(todo.id)} aria-label="Delete">
            🗑
        </button>
            </>
                )}
    </div>
            </li>
          ))}
        </ul>
    </div>
    </div>
  );
}