import { Link } from 'react-router-dom';
import {
  FaBolt, FaWrench, FaSnowflake, FaCar, FaPaintBrush, FaHammer,
  FaArrowRight, FaCheckCircle, FaStar, FaQuoteLeft
} from 'react-icons/fa';
import { HiCursorClick, HiCalendar, HiThumbUp } from 'react-icons/hi';
import './Home.css';

const services = [
  { icon: <FaBolt />, title: 'Electrician', desc: 'Wiring, installations, repairs & emergency fixes', color: '#f59e0b' },
  { icon: <FaWrench />, title: 'Plumber', desc: 'Pipe fitting, leak repairs & drain cleaning', color: '#3b82f6' },
  { icon: <FaSnowflake />, title: 'AC Service', desc: 'Installation, maintenance & gas refill', color: '#06b6d4' },
  { icon: <FaCar />, title: 'Mechanic', desc: 'Vehicle repair, tuning & maintenance', color: '#ef4444' },
  { icon: <FaPaintBrush />, title: 'Painter', desc: 'Interior, exterior & decorative painting', color: '#8b5cf6' },
  { icon: <FaHammer />, title: 'Carpenter', desc: 'Furniture, doors, cabinets & repairs', color: '#f97316' },
];

const steps = [
  { icon: <HiCursorClick />, title: 'Select a Service', desc: 'Browse our services and pick what you need' },
  { icon: <HiCalendar />, title: 'Book an Appointment', desc: 'Pick a date and time that suits you best' },
  { icon: <HiThumbUp />, title: 'Get It Done', desc: 'Our expert arrives and gets the job done right' },
];

const testimonials = [
  { name: 'Ahmed Khan', role: 'Homeowner', text: 'Kaarigar sent an electrician within 2 hours. Extremely professional work and fair pricing!', stars: 5 },
  { name: 'Fatima Noor', role: 'Business Owner', text: 'The AC service team was thorough and cleaned up after themselves. Will definitely use again.', stars: 5 },
  { name: 'Usman Ali', role: 'Apartment Resident', text: 'Best plumbing service in Lahore. Fixed a leak that 3 other plumbers couldn\'t. Highly recommended!', stars: 5 },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg-glow" />
        <div className="container hero__container">
          <div className="hero__content">
            <div className="hero__badge">⚡ Trusted Home Service Platform</div>
            <h1 className="hero__title">
              Expert Home Services,
              <span> At Your Doorstep</span>
            </h1>
            <p className="hero__subtitle">
              From electrical work to plumbing, AC repair to carpentry — Kaarigar connects you with 
              skilled professionals for every home need. Fast, reliable, and affordable.
            </p>
            <div className="hero__actions">
              <Link to="/book" className="btn btn-primary btn-lg">
                Book a Service <FaArrowRight />
              </Link>
              <Link to="/services" className="btn btn-secondary btn-lg">
                Explore Services
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <strong>500+</strong>
                <span>Skilled Workers</span>
              </div>
              <div className="hero__stat">
                <strong>10K+</strong>
                <span>Jobs Completed</span>
              </div>
              <div className="hero__stat">
                <strong>4.9</strong>
                <span>Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Services</div>
            <h2 className="section-title">What We <span>Offer</span></h2>
            <p className="section-subtitle">Professional services for every corner of your home</p>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <div key={i} className="service-card glass-card" style={{ '--accent': service.color }}>
                <div className="service-card__icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <Link to="/book" state={{ service: service.title }} className="service-card__link">
                  Book Now <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Simple Process</div>
            <h2 className="section-title">How It <span>Works</span></h2>
            <p className="section-subtitle">Get your service done in 3 easy steps</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-card__number">{i + 1}</div>
                <div className="step-card__icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Why Kaarigar?</div>
            <h2 className="section-title">Why Choose <span>Us</span></h2>
          </div>
          <div className="features-grid">
            {[
              { title: 'Verified Professionals', desc: 'Every worker is background-checked and skill-verified' },
              { title: 'Affordable Pricing', desc: 'Transparent rates with no hidden charges' },
              { title: 'On-Time Service', desc: 'Punctual arrivals with real-time tracking' },
              { title: 'Satisfaction Guaranteed', desc: 'Not happy? We\'ll make it right, guaranteed' },
            ].map((f, i) => (
              <div key={i} className="feature-card glass-card">
                <FaCheckCircle className="feature-card__icon" />
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Testimonials</div>
            <h2 className="section-title">What Our <span>Customers Say</span></h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card glass-card">
                <FaQuoteLeft className="testimonial-card__quote" />
                <p>{t.text}</p>
                <div className="testimonial-card__stars">
                  {[...Array(t.stars)].map((_, j) => <FaStar key={j} />)}
                </div>
                <div className="testimonial-card__author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container cta__container">
          <h2>Ready to Get Things Fixed?</h2>
          <p>Book a service today and experience the Kaarigar difference. Professional, reliable, affordable.</p>
          <Link to="/book" className="btn btn-primary btn-lg">
            Book a Service Now <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
