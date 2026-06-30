import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  addTask as addTaskAction,
  removeTask as removeTaskAction,
  updateTask as updateTaskAction,
  toggleTask as toggleTaskAction,
  
} from "./redux/task/task.slice";

const LISTS = [
  { id: "all", name: "All Lists", icon: "home", special: true },
  { id: "default", name: "Default", icon: "list" },
  { id: "tasks", name: "Tasks", icon: "list" },
  { id: "personal", name: "Personal", icon: "list" },
  { id: "shopping", name: "Shopping", icon: "list" },
  { id: "work", name: "Work", icon: "list" },
  { id: "finished", name: "Finished", icon: "check", special: true },
];

// Single unified Icon Component
function Icon({ name, strokeWidth = 2 }) {
  const paths = {
    home: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
    list: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
    check: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4h6v2" />
      </>
    ),
    save: <polyline points="20 6 9 17 4 12" />,
    x: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    menu: (
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function Sidebar({ sidebarOpen, activeList, selectList, getBadge }) {
  return (
    <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Icon name="check" />
        </div>
        <div className="sidebar-title">To Do List</div>
        <div className="sidebar-sub">by Splend Apps</div>
      </div>

      <div className="list-section">
        <div className="list-section-label">Task Lists</div>
        {LISTS.map(l => {
          const badge = getBadge(l.id);
          return (
            <button
              key={l.id}
              className={`list-item${activeList === l.id ? " active" : ""}`}
              onClick={() => selectList(l.id)}
            >
              <span className="list-item-icon">
                <Icon name={l.icon === "home" || l.icon === "check" ? l.icon : "list"} />
              </span>
              <span className="list-name">{l.name}</span>
              {badge > 0 && <span className="list-badge">{badge}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default function App() {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [activeList, setActiveList] = useState("all");
  const [input, setInput] = useState("");
  const [addList, setAddList] = useState("default");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [undoItem, setUndoItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    if (!undoItem) return;
    const timer = setTimeout(() => setUndoItem(null), 4000);
    return () => clearTimeout(timer);
  }, [undoItem]);

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const getBadge = useCallback((listId) => {
    return tasks.filter(t => {
      if (listId === "all") return !t.done;
      if (listId === "finished") return t.done;
      return t.list === listId && !t.done;
    }).length;
  }, [tasks]);

  const visibleTasks = tasks
    .filter(t => {
      if (activeList === "all") return !t.done;
      if (activeList === "finished") return t.done;
      return t.list === activeList && !t.done;
    })
    .filter(t => {
      return !searchText.trim() || t.title.toLowerCase().includes(searchText.toLowerCase());
    });

  const isMultiView = activeList === "all" || activeList === "finished";
  const activeInfo = LISTS.find(l => l.id === activeList);
  const remaining = getBadge(activeList);

  const addTask = () => {
    if (!input.trim()) return;
    dispatch(addTaskAction({ title: input.trim(), list: isMultiView ? addList : activeList }));
    setInput("");
  };

  const toggleDone = (id) => {
    const t = tasks.find(t => t.id === id);
    if (t) {
      if (!t.done) setUndoItem({ id, text: t.title });
      else if (undoItem?.id === id) setUndoItem(null);
      dispatch(toggleTaskAction(id));
    }
  };

  const resetEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const deleteTask = (id) => {
    if (undoItem?.id === id) setUndoItem(null);
    if (editId === id) resetEdit();
    dispatch(removeTaskAction(id));
  };

  const startEdit = (t) => {
    setEditId(t.id);
    setEditText(t.title);
  };

  const saveEdit = (id) => {
    const text = editText.trim();
    if (text) dispatch(updateTaskAction({ id, title: text }));
    resetEdit();
  };

  const handleUndo = () => {
    if (undoItem) {
      dispatch(toggleTaskAction(undoItem.id));
      setUndoItem(null);
    }
  };

  const selectList = (id) => {
    setActiveList(id);
    resetEdit();
    setSearchText("");
    setShowSearch(false);
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeList={activeList}
        selectList={selectList}
        getBadge={getBadge}
      />

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="main-wrapper">
        <header className="main-header">
          <button className="menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <div className="main-header-text">
            <h1>{activeInfo?.name}</h1>
            <p>{remaining} task{remaining !== 1 ? "s" : ""} remaining</p>
          </div>
          <button
            className={`search-toggle-btn${showSearch ? " active" : ""}`}
            onClick={() => { setShowSearch(s => !s); if (showSearch) setSearchText(""); }}
            aria-label="Toggle search"
          >
            <Icon name="search" />
          </button>
        </header>

        {showSearch && (
          <div className="search-bar">
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Search tasks…"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
        )}

        <div className="add-row">
          <input
            className="add-input"
            placeholder="Add a new task…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
          />
          {isMultiView && (
            <select className="list-select" value={addList} onChange={e => setAddList(e.target.value)}>
              {LISTS.filter(l => !l.special).map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          )}
          <button className="add-btn" onClick={addTask}>Add</button>
        </div>

        <ul className="task-list">
          {visibleTasks.length === 0 && (
            <li className="empty-state">
              <span>
                {activeList === "finished" ? "No completed tasks yet." : "All clear, enjoy your day!"}
              </span>
            </li>
          )}

          {visibleTasks.map(todo => (
            <li key={todo.id} className={`task-item${todo.done ? " done" : ""}`}>
              <button
                className={`check-btn${todo.done ? " checked" : ""}`}
                onClick={() => toggleDone(todo.id)}
                aria-label={todo.done ? "Mark undone" : "Mark done"}
              >
                {todo.done && (
                  <svg viewBox="0 0 12 10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 5 4.5 8.5 11 1" />
                  </svg>
                )}
              </button>

              <div className="task-content">
                {editId === todo.id ? (
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") saveEdit(todo.id);
                      if (e.key === "Escape") resetEdit();
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className={`task-text${todo.done ? " done-text" : ""}`}>{todo.title}</span>
                    {isMultiView && (
                      <span className="task-list-tag">{LISTS.find(l => l.id === todo.list)?.name}</span>
                    )}
                  </>
                )}
              </div>

              <div className="task-actions">
                {editId === todo.id ? (
                  <>
                    <button className="icon-btn save-btn" onClick={() => saveEdit(todo.id)} aria-label="Save">
                      <Icon name="save" strokeWidth={3} />
                    </button>
                    <button className="icon-btn" onClick={resetEdit} aria-label="Cancel">
                      <Icon name="x" strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="icon-btn" onClick={() => startEdit(todo)} aria-label="Edit">
                      <Icon name="edit" />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => deleteTask(todo.id)} aria-label="Delete">
                      <Icon name="trash" />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className={`toast-wrapper${undoItem ? " visible" : ""}`}>
          {undoItem && (
            <div className="toast">
              <span className="toast-text">
                Marked "{undoItem.text.length > 30 ? undoItem.text.slice(0, 30) + "…" : undoItem.text}" as done
              </span>
              <button className="undo-btn" onClick={handleUndo}>Undo</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}