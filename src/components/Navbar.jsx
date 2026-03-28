import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaBolt } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, isProvider, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const dashboardPath = isProvider ? '/provider-dashboard' : '/dashboard';
  const dashboardLabel = isProvider ? 'Provider Panel' : 'Dashboard';

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container container">
        <Link to="/" className="navbar__logo">
          <FaBolt className="navbar__logo-icon" />
          <span>Kaarigar</span>
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="navbar__links-divider" />
          {user ? (
            <>
              <li>
                <Link
                  to={dashboardPath}
                  className={`navbar__link ${location.pathname === dashboardPath ? 'navbar__link--active' : ''}`}
                >
                  {dashboardLabel}
                </Link>
              </li>
              {!isProvider && (
                <li>
                  <Link to="/book" className="btn btn-sm btn-primary navbar__auth-btn">
                    Book Now
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleSignOut} className="btn btn-sm btn-secondary navbar__auth-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-sm btn-secondary navbar__auth-btn">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="btn btn-sm btn-primary navbar__auth-btn">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {menuOpen && <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}
