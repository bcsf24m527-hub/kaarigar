import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBolt, FaGoogle, FaGithub } from 'react-icons/fa';
import './Auth.css';

export default function Login() {
  const { signIn, signInWithProvider } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    const { error: err } = await signInWithProvider(provider);
    if (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-card__header">
          <FaBolt className="auth-card__logo" />
          <h2>Welcome Back</h2>
          <p>Sign in to your Kaarigar account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {/* Social Login Buttons */}
        <div className="social-login">
          <button
            className="social-btn social-btn--google"
            onClick={() => handleSocialLogin('google')}
            type="button"
          >
            <FaGoogle /> Continue with Google
          </button>
          <button
            className="social-btn social-btn--github"
            onClick={() => handleSocialLogin('github')}
            type="button"
          >
            <FaGithub /> Continue with GitHub
          </button>
        </div>

        <div className="auth-divider">
          <span>or sign in with email</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password">Password</label>
              <Link to="/forgot-password" className="form-link">Forgot password?</Link>
            </div>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
