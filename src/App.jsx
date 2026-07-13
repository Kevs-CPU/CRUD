import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask as addTaskAction,
  removeTask as removeTaskAction,
  updateTask as updateTaskAction,
} from "./app/redux/task/task.slice";
import "./App.css";

const getEmailAndDesc = (title) => {
  const parts = title.split(" - ");
  const email = parts[0] || "";
  const desc = parts.slice(1).join(" - ");
  return { email, desc };
};

const validateEmail = (text) => {
  const value = text.trim();
  if (!value) {
    return "Email is required.";
  }

  const { email } = getEmailAndDesc(value);

  const atIndex = email.indexOf("@");
  const dotIndex = email.lastIndexOf(".");
  if (atIndex < 1 || dotIndex <= atIndex + 1 || dotIndex === email.length - 1) {
    return "Must contain a valid email address.";
  }

  if (!email.toLowerCase().endsWith("@gmail.com")) {
    return "Only gmail.com domain is allowed.";
  }

  return "";
};

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
    const error = validateEmail(input);
    if (error) return setInputError(error);

    dispatch(addTaskAction({ title: input.trim() }));
    setInput("");
    setInputError("");
  };

  const deleteTask = (id) => {
    if (editId === id) resetEdit();
    dispatch(removeTaskAction(id));
  };

  const startEdit = (todo) => {
    const { desc } = getEmailAndDesc(todo.title);
    setEditId(todo.id);
    setEditText(desc);
  };

  const resetEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = (id, originalTitle) => {
    const { email } = getEmailAndDesc(originalTitle);
    const desc = editText.trim();
    const newTitle = desc ? `${email} - ${desc}` : email;

    dispatch(updateTaskAction({ id, title: newTitle }));
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
        </header>

        <div className="add-row">
          <input
            className={`add-input${inputError ? " add-input-error" : ""}`}
            name="newTask"
            id="newTask"
            placeholder="yourname@gmail.com"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setInputError("");
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

          {tasks.map((todo) => {
            const { email } = getEmailAndDesc(todo.title);
            return (
              <li key={todo.id} className="task-item">
                <div className="task-content">
                  {editId === todo.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", width: "100%" }}>
                      {email && <span style={{ color: "#666", whiteSpace: "nowrap" }}>{email} - </span>}
                      <input
                        className="edit-input"
                        style={{ flex: 1 }}
                        name={`editTask-${todo.id}`}
                        id={`editTask-${todo.id}`}
                        placeholder="Add task…"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(todo.id, todo.title);
                          if (e.key === "Escape") resetEdit();
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span className="task-text">{todo.title}</span>
                  )}
                </div>
                
                <div className="task-actions">
                  {editId === todo.id ? (
                    <>
                      <button className="icon-btn save-btn" onClick={() => saveEdit(todo.id, todo.title)} aria-label="Save">
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
            );
          })}
        </ul>
      </div>
    </div>
  );
}