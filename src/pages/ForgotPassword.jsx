import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBolt, FaEnvelope } from 'react-icons/fa';
import './Auth.css';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await resetPassword(email);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-card__header">
          <FaBolt className="auth-card__logo" />
          <h2>Forgot Password?</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {sent ? (
          <div className="auth-message">
            <div className="auth-message__icon">
              <FaEnvelope />
            </div>
            <h3>Check Your Email</h3>
            <p>
              We've sent a password reset link to <strong>{email}</strong>.
              Click the link in the email to set a new password.
            </p>
            <p className="auth-message__note">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button
              className="btn btn-secondary auth-btn"
              onClick={() => setSent(false)}
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                className="form-control"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
