import { useAuth } from './app/context/AuthContext';
import TaskPage from './app/pages/TaskPage';
import { Login } from './app/components/auth/Login';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#F0F4F8'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="loader"></div>
          <p style={{ marginTop: '16px', color: '#4a5a72' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <TaskPage />;
}

export default App;