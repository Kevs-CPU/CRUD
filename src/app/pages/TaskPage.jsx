import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearError,
  setFilter,
  addTask,
  fetchTasks,
  updateTask,
  removeTask,
  setEditId,
  setEditText,
  clearEdit,
  selectFilteredTasks,
  selectActiveCount,
  toggleTaskComplete,
} from "../redux/task/task.slice";
import { useAuth } from "../context/AuthContext";
import { ClipboardCheck } from 'lucide-react';
import "./TaskPage.css";

export default function TaskPage() {
  const dispatch = useDispatch();
  const { logout } = useAuth();

  const loading = useSelector((state) => state.tasks.loading || false);
  const error = useSelector((state) => state.tasks.error);
  const filter = useSelector((state) => state.tasks.filter || 'all');
  const editId = useSelector((state) => state.tasks.editId);
  const editText = useSelector((state) => state.tasks.editText);

  const activeCount = useSelector(selectActiveCount);
  const filteredTasks = useSelector(selectFilteredTasks);

  const [gmailInput, setGmailInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [showAddBar, setShowAddBar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const gmailInputRef = useRef(null);
  const taskInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (showAddBar && gmailInputRef.current) {
      gmailInputRef.current.focus();
    }
  }, [showAddBar]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleGmailChange = (e) => {
    setGmailInput(e.target.value);
    dispatch(clearError());
  };

  const handleTaskChange = (e) => {
    setTaskInput(e.target.value);
    dispatch(clearError());
  };

  const handleAddTask = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(addTask({ gmail: gmailInput, task: taskInput })).unwrap();
      setGmailInput("");
      setTaskInput("");
      setShowAddBar(false);
      dispatch(clearError());
    } catch (error) {
      console.error('Add task failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (editId === id) resetEdit();
    try {
      await dispatch(removeTask(id)).unwrap();
    } catch (error) {
      console.error('Delete task failed:', error);
    }
  };

  const handleStartEdit = (todo) => {
    dispatch(setEditId(todo.id));
    dispatch(setEditText(todo.title));
  };

  const resetEdit = () => {
    dispatch(clearEdit());
    dispatch(clearError());
  };

  const handleSaveEdit = async (id) => {
    try {
      await dispatch(updateTask({ id, title: editText })).unwrap();
      resetEdit();
    } catch (error) {
      console.error('Update task failed:', error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await dispatch(toggleTaskComplete(id)).unwrap();
    } catch (error) {
      console.error('Toggle task failed:', error);
    }
  };

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target === gmailInputRef.current) {
        taskInputRef.current?.focus();
      } else if (e.target === taskInputRef.current) {
        action();
      }
    }
    if (e.key === "Escape") {
      setShowAddBar(false);
      dispatch(clearError());
      setGmailInput("");
      setTaskInput("");
    }
  };

  const handleClose = () => {
    setShowAddBar(false);
    dispatch(clearError());
    setGmailInput("");
    setTaskInput("");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <div className="topbar-title">
            <span className="topbar-icon">
              <ClipboardCheck size={22} strokeWidth={2} color="#ffffff" />
            </span>
            <div>
              <span className="topbar-heading">Todo list</span>
            </div>
          </div>
          <div className="topbar-stats">
            <span className="stat-badge">{activeCount} pending</span>
            <button 
              className="btn btn-logout" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging out...' : ' Logout'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="toast-error">
          <span className="toast-message">{error}</span>
          <button
            className="toast-close"
            onClick={() => dispatch(clearError())}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <div className={`add-bar-overlay ${showAddBar ? "active" : ""}`}>
        <div className="add-bar-modal">
          <div className="add-bar-header">
            <span className="add-bar-title">Add New Task</span>
            <button
              className="add-bar-close"
              onClick={handleClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="add-bar-body">
            <div className="input-group">
              <span className="input-icon"></span>
              <input
                ref={gmailInputRef}
                className={`add-input ${error ? "error" : ""}`}
                name="gmailInput"
                id="gmailInput"
                placeholder="Enter Gmail address"
                value={gmailInput}
                onChange={handleGmailChange}
                onKeyDown={(e) => handleKeyDown(e, handleAddTask)}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            <div className="input-hint">
              <span></span>
              <span>Only Gmail addresses are allowed</span>
            </div>
            
            <div className="input-group" style={{ marginTop: '16px' }}>
              <span className="input-icon"></span>
              <input
                ref={taskInputRef}
                className={`add-input ${error ? "error" : ""}`}
                name="taskInput"
                id="taskInput"
                placeholder="Enter task description"
                value={taskInput}
                onChange={handleTaskChange}
                onKeyDown={(e) => handleKeyDown(e, handleAddTask)}
                disabled={isSubmitting}
              />
            </div>
            <div className="input-hint">
              <span></span>
              <span>Describe what you need to do</span>
            </div>

            {error && (
              <div className="input-error">
                <span className="error-icon"></span>
                <span>{error}</span>
              </div>
            )}
            <div className="add-bar-actions">
              <button
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAddTask}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-chip ${filter === f ? "active" : ""}`}
              onClick={() => handleFilterChange(f)}
            >
              {f === "all" && " All"}
              {f === "active" && " Active"}
              {f === "completed" && "Completed"}
            </button>
          ))}
        </div>
        <span className="filter-count">
          <span className="count-number">{activeCount}</span>
          <span className="count-label">tasks remaining</span>
        </span>
      </div>

      <main className="task-scroll">
        {loading ? (
          <div className="empty-state">
            <div className="loader"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No tasks found</h3>
            <p>Add your first Gmail task</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddBar(true)}
            >
              + Add your first task
            </button>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((todo) => (
              <li
                key={todo.id}
                className={`task-card ${todo.completed ? "completed" : ""}`}
              >
                <button
                  type="button"
                  className={`task-checkbox ${todo.completed ? "checked" : ""}`}
                  onClick={() => handleToggleComplete(todo.id)}
                  aria-label="Mark as complete"
                >
                  {todo.completed && <span className="checkmark">✓</span>}
                </button>

                <div className="task-body">
                  {editId === todo.id ? (
                    <div className="edit-container">
                      <div className="input-group inline">
                        <input
                          className={`edit-input ${error ? "error" : ""}`}
                          name={`editTask-${todo.id}`}
                          id={`editTask-${todo.id}`}
                          placeholder="Enter Gmail address"
                          value={editText}
                          onChange={(e) => {
                            dispatch(setEditText(e.target.value));
                            dispatch(clearError());
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(todo.id);
                            if (e.key === "Escape") resetEdit();
                          }}
                          autoFocus
                        />
                      </div>
                      {error && (
                        <div className="input-error small">
                          <span>{error}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="task-content">
                      <div className="task-info">
                        <span
                          className={`task-title ${
                            todo.completed ? "completed" : ""
                          }`}
                        >
                          {todo.title}
                        </span>
                        <span className="task-meta">Gmail Task</span>
                      </div>
                      {todo.completed && (
                        <span className="task-badge">✅ Done</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="task-actions">
                  {editId === todo.id ? (
                    <>
                      <button
                        className="icon-btn save"
                        onClick={() => handleSaveEdit(todo.id)}
                        aria-label="Save"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        className="icon-btn cancel"
                        onClick={resetEdit}
                        aria-label="Cancel"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="icon-btn edit"
                        onClick={() => handleStartEdit(todo)}
                        aria-label="Edit"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDeleteTask(todo.id)}
                        aria-label="Delete"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <button
        className="fab"
        onClick={() => setShowAddBar(true)}
        aria-label="Add new task"
      >
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
} 