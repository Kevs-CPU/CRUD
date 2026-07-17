import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, CheckCircle2, ClipboardCheck } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
                disabled={loading}
              />
            </div>
          </div>

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