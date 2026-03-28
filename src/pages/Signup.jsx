import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBolt, FaGoogle, FaGithub, FaUser, FaTools } from 'react-icons/fa';
import { serviceOptions } from '../utils/constants';
import './Auth.css';

export default function Signup() {
  const { signUp, signInWithProvider } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!role) {
      setError('Please select a role.');
      return;
    }

    if (role === 'service_provider' && !serviceType) {
      setError('Please select the service you provide.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { data, error: err } = await signUp(email, password, role, fullName, serviceType);
    if (err) {
      setError(err.message);
    } else if (data?.user?.identities?.length === 0) {
      setError('An account with this email already exists.');
    } else {
      setSuccess('Account created! Check your email for a verification link before logging in.');
      setTimeout(() => navigate('/login'), 4000);
    }
    setLoading(false);
  };

  const handleSocialSignup = async (provider) => {
    setError('');
    // Social signups create basic Taker profiles. Providers must currently sign up via email
    // or set their service type post-signup (handled separately if needed).
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
          <h2>Create Account</h2>
          <p>Join Kaarigar and get started</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {/* Social Login Buttons */}
        <div className="social-login">
          <button
            className="social-btn social-btn--google"
            onClick={() => handleSocialSignup('google')}
            type="button"
          >
            <FaGoogle /> Sign up with Google
          </button>
          <button
            className="social-btn social-btn--github"
            onClick={() => handleSocialSignup('github')}
            type="button"
          >
            <FaGithub /> Sign up with GitHub
          </button>
        </div>

        <div className="auth-divider">
          <span>or sign up with email</span>
        </div>

        {/* Role Selection */}
        <div className="role-selector">
          <label className="role-selector__label">I am a</label>
          <div className="role-selector__options">
            <button
              type="button"
              className={`role-option ${role === 'service_taker' ? 'role-option--active' : ''}`}
              onClick={() => setRole('service_taker')}
            >
              <FaUser className="role-option__icon" />
              <span className="role-option__title">Service Taker</span>
              <span className="role-option__desc">I need home services</span>
            </button>
            <button
              type="button"
              className={`role-option ${role === 'service_provider' ? 'role-option--active role-option--provider' : ''}`}
              onClick={() => setRole('service_provider')}
            >
              <FaTools className="role-option__icon" />
              <span className="role-option__title">Service Provider</span>
              <span className="role-option__desc">I offer my skills</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {role === 'service_provider' && (
            <div className="form-group" style={{ animation: 'fadeIn 0.3s ease' }}>
              <label htmlFor="signup-service">Service Specialization</label>
              <select
                id="signup-service"
                className="form-control"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required={role === 'service_provider'}
              >
                <option value="">Select your service...</option>
                {serviceOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              className="form-control"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              type="email"
              className="form-control"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="form-control"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm"
              type="password"
              className="form-control"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
