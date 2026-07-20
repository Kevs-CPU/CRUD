import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Floating "toast" notification shown after a successful registration
  const [toast, setToast] = useState({ visible: false, message: '' });

  const { login, register, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Auto-hide the toast after a few seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const resetFields = () => {
    setUsername('');
    setGmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isResetting) {
        await resetPassword(gmail);
        setSuccessMessage('Password reset email sent! Check your inbox.');
        resetFields();
        setIsResetting(false);
        return;
      }

      if (isRegistering) {
        await register(username, gmail, password);

        // 1. Show the "you are registered" notification
        setToast({ visible: true, message: 'You are registered! Please log in.' });

        // 2. Reset the form and switch back to the login view
        resetFields();
        setIsRegistering(false);
        setLocalError('');
        setSuccessMessage('');

        // 3. Make sure the user lands on the /login route
        navigate('/login');
      } else {
        await login(username, password);
      }

    } catch (error) {
      setLocalError(error.message);
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setIsResetting(false);
    setLocalError('');
    setSuccessMessage('');
    resetFields();
  };

  const toggleReset = () => {
    setIsResetting(!isResetting);
    setIsRegistering(false);
    setLocalError('');
    setSuccessMessage('');
    resetFields();
  };

  return (
    <div className="login-container">
      {/* Notification: plain green text, no box/background */}
      {toast.visible && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">
            <ClipboardCheck size={24} strokeWidth={2} />
          </span>
          <h2>{isResetting ? 'Reset Password' : isRegistering ? 'Create Account' : 'Log in now'}</h2>
          <p>
            {isResetting
              ? 'Reset your password'
              : isRegistering
                ? 'Create your account'
                : 'Sign in to continue'}
          </p>
        </div>

        <div className="message-slot">
          {localError && (
            <div className="login-error">
              <AlertTriangle size={16} />
              <span>{localError}</span>
            </div>
          )}

          {successMessage && (
            <div className="login-success">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isResetting && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                  minLength={3}
                  maxLength={20}
                />
              </div>
            </div>
          )}

          {(isRegistering || isResetting) && (
            <div className="form-group">
              <label htmlFor="gmail">Gmail address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="gmail"
                  name="gmail"
                  type="email"
                  autoComplete="email"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  placeholder="example@gmail.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {!isResetting && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="has-toggle"
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
                ? 'Send reset email'
                : isRegistering
                  ? 'Create account'
                  : 'Sign in'}
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
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          )}
          <br />
          <button
            className="toggle-btn"
            onClick={toggleReset}
            disabled={loading}
          >
            {isResetting
              ? 'Back to sign in'
              : 'Forgot password?'}
          </button>
        </div>
      </div>
    </div>
  );
};