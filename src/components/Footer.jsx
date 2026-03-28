import { Link } from 'react-router-dom';
import { FaBolt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__gradient-border" />
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <FaBolt className="footer__logo-icon" />
              <span>Kaarigar</span>
            </Link>
            <p className="footer__desc">
              Your trusted partner for all home services. Professional, reliable, and just a click away.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/services">Electrician</Link></li>
              <li><Link to="/services">Plumber</Link></li>
              <li><Link to="/services">AC Service</Link></li>
              <li><Link to="/services">Mechanic</Link></li>
              <li><Link to="/services">Painter</Link></li>
              <li><Link to="/services">Carpenter</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact Info</h4>
            <ul className="footer__contact">
              <li><FaPhoneAlt /> +92 300 1234567</li>
              <li><FaEnvelope /> info@kaarigar.com</li>
              <li><FaMapMarkerAlt /> Lahore, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Kaarigar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
