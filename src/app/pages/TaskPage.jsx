import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearError,
  setError,
  setFilter,
  addTask,
  fetchTasks,
  updateTask,
  removeTask,
  setEditId,
  setEditText,
  clearEdit,
  selectActiveCount,
  selectFilteredTasks,
  toggleTaskComplete,
  clearTasks,
  selectLoading,
  selectError,
  selectFilter,
  selectEditId,
  selectEditText,
  selectTotalCount,
  selectCompletedCount,
} from "../redux/task/task.slice";
import { useAuth } from "../context/AuthContext";
import { ClipboardCheck, LogOut, User, Mail, FileText, Check, X } from 'lucide-react';
import "./TaskPage.css";

export default function TaskPage() {
  const dispatch = useDispatch();
  const { logout, user, getUsername } = useAuth();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const filter = useSelector(selectFilter);
  const editId = useSelector(selectEditId);
  const editText = useSelector(selectEditText);
  const activeCount = useSelector(selectActiveCount);
  const filteredTasks = useSelector(selectFilteredTasks);
  const completedCount = useSelector(selectCompletedCount);

  const [taskInput, setTaskInput] = useState("");
  const [gmailInput, setGmailInput] = useState("");
  const [showAddBar, setShowAddBar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const gmailInputRef = useRef(null);

  const filterOptions = useMemo(() => [
    { key: "all", label: "All", count: activeCount },
    { key: "active", label: "Active", count: activeCount },
    { key: "completed", label: "Completed", count: completedCount },
  ], [activeCount, completedCount]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchTasks());
    }
  }, [dispatch, user?.uid]);

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
      dispatch(clearTasks());
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(setError('Failed to logout. Please try again.'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleTaskChange = (e) => {
    setTaskInput(e.target.value);
    dispatch(clearError());
  };

  const handleGmailChange = (e) => {
    setGmailInput(e.target.value);
    dispatch(clearError());
  };

  const handleAddTask = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(addTask({
        gmail: gmailInput,
        task: taskInput,
      })).unwrap();

      setTaskInput("");
      setGmailInput("");
      setShowAddBar(false);
      dispatch(clearError());
    } catch (error) {
      console.error("Add task failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    if (editId === id) resetEdit();
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await dispatch(removeTask(deleteTargetId)).unwrap();
      setShowConfirmModal(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error('Delete task failed:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteTargetId(null);
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
      await dispatch(updateTask({
        id,
        title: editText
      })).unwrap();
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
    if (e.key === "Escape") {
      handleClose();
    }
  };

  const handleClose = () => {
    setShowAddBar(false);
    setTaskInput("");
    setGmailInput("");
    dispatch(clearError());
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-content">
          <div className="topbar-title">
            <span className="topbar-icon">
              <ClipboardCheck size={22} strokeWidth={2} color="#ffffff" />
            </span>
            <div className="user-greeting">
              <span className="topbar-heading">
                Welcome {getUsername()}
              </span>
            </div>
          </div>
          <div className="topbar-actions">
            {activeCount > 0 && (
              <span className="stat-badge">{activeCount} pending</span>
            )}
            <button
              className="logout-btn"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Logout"
            >
              <LogOut size={16} />
              {isLoggingOut ? "Logging out..." : "Logout"}
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
            <X size={16} />
          </button>
        </div>
      )}

      <div className={`add-bar-overlay ${showAddBar ? "active" : ""}`}>
        <div className="add-bar-modal">
          <div className="add-bar-header">
            <div className="add-bar-icon-wrapper">
              <span className="add-bar-icon">📝</span>
            </div>
            <span className="add-bar-title">Add New Task</span>
          </div>

          <div className="add-bar-body">
            <div className="form-group">
              <label className="form-label" htmlFor="gmailInput">
                Gmail Address <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  ref={gmailInputRef}
                  className={`form-input ${error ? "error" : ""}`}
                  id="gmailInput"
                  placeholder="Enter your registered Gmail"
                  value={gmailInput}
                  onChange={handleGmailChange}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="taskInput">
                Task Description <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <FileText size={16} className="input-icon" />
                <input
                  className={`form-input ${error ? "error" : ""}`}
                  id="taskInput"
                  placeholder="What needs to be done?"
                  value={taskInput}
                  onChange={handleTaskChange}
                  onKeyDown={handleKeyDown}
                  disabled={isSubmitting}
                />
              </div>
              {error ? (
                <div className="input-error">
                  <span className="error-icon">⚠</span>
                  <span>{error}</span>
                </div>
              ) : (
                <div className="input-hint">
                  Be specific and clear with your task description
                </div>
              )}
            </div>

            <div className="form-actions">
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
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Add Task
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="modal-icon">🗑</span>
                <h3>Delete Task</h3>
              </div>
            </div>
            <div className="modal-body">
              <p className="modal-message">Are you sure you want to delete this task?</p>
              <p className="modal-subtext">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-modal btn-modal-secondary"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn-modal btn-modal-danger"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="filter-row">
        <div className="filter-group">
          {filterOptions.map((item) => (
            <button
              key={item.key}
              className={`filter-chip ${filter === item.key ? "active" : ""}`}
              onClick={() => handleFilterChange(item.key)}
            >
              {item.label}
              {item.count > 0 && (
                <span className="filter-badge">{item.count}</span>
              )}
            </button>
          ))}
        </div>
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
            <p>
              {filter === 'all'
                ? "Add your first task"
                : filter === 'active'
                  ? "No active tasks"
                  : "No completed tasks"}
            </p>
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
                {!todo.completed && (
                  <button
                    type="button"
                    className="task-checkbox"
                    onClick={() => handleToggleComplete(todo.id)}
                    aria-label="Mark as complete"
                  />
                )}

                <div className="task-body">
                  {editId === todo.id ? (
                    <div className="edit-container">
                      <div className="input-group inline">
                        <input
                          className={`edit-input ${error ? "error" : ""}`}
                          placeholder="Edit task..."
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
                        <span className={`task-title ${todo.completed ? "completed" : ""}`}>
                          {todo.title}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="task-actions">
                  {todo.completed ? (
                    <div className="completed-actions">
                      <button
                        className="btn-remove"
                        onClick={() => handleDeleteClick(todo.id)}
                        aria-label="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  ) : editId === todo.id ? (
                    <>
                      <button
                        className="icon-btn save"
                        onClick={() => handleSaveEdit(todo.id)}
                        aria-label="Save"
                      >
                        ✓
                      </button>
                      <button
                        className="icon-btn cancel"
                        onClick={resetEdit}
                        aria-label="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="icon-btn edit"
                        onClick={() => handleStartEdit(todo)}
                        aria-label="Edit"
                      >
                        ✎
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDeleteClick(todo.id)}
                        aria-label="Delete"
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