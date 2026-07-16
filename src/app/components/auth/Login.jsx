import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login, register, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isResetting) {
        await resetPassword(email);
        setSuccessMessage('Password reset email sent! Check your inbox.');
        setEmail('');
        setIsResetting(false);
        return;
      }
      
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setIsResetting(false);
    setLocalError('');
    setSuccessMessage('');
  };

  const toggleReset = () => {
    setIsResetting(!isResetting);
    setIsRegistering(false);
    setLocalError('');
    setSuccessMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">📋</span>
          <h2>Todo list</h2>
          <p>
            {isResetting 
              ? 'Reset your password' 
              : isRegistering 
                ? 'Create your account' 
                : 'Sign in to continue'}
          </p>
        </div>

        {localError && (
          <div className="login-error">
            <span>⚠️</span>
            <span>{localError}</span>
          </div>
        )}

        {successMessage && (
          <div className="login-success">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {!isResetting && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading 
              ? 'Loading...' 
              : isResetting 
                ? 'Send Reset Email'
                : isRegistering 
                  ? 'Create Account' 
                  : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          {!isResetting && (
            <button 
              className="toggle-btn"
              onClick={toggleMode}
              disabled={loading}
            >
              {isRegistering 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </button>
          )}
          <br />
          <button 
            className="toggle-btn"
            onClick={toggleReset}
            disabled={loading}
          >
            {isResetting 
              ? 'Back to Sign In' 
              : 'Forgot Password?'}
          </button>
        </div>
      </div>
    </div>
  );
};