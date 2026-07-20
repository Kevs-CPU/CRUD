import React, { useState } from 'react';
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

  const { login, register, resetPassword } = useAuth();

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
        // Register needs username + gmail + password
        await register(username, gmail, password);
      } else {
        // Login only needs username + password
        await login(username, password);
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
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">
            <ClipboardCheck size={24} strokeWidth={2} />
          </span>
          <h2>Log in now</h2>
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
          {/* Username: shown for both login and register, not for password reset */}
          {!isResetting && (
            <div className="form-group">
              <label>Username</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="text"
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

          {/* Gmail: only needed at registration (to create the Firebase account)
              and at password reset (Firebase needs the real email to send the link) */}
          {(isRegistering || isResetting) && (
            <div className="form-group">
              <label>Gmail address</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
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
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="has-toggle"
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