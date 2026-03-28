import { FaUsers, FaBullseye, FaEye, FaAward, FaHandshake, FaClock } from 'react-icons/fa';
import './About.css';

const stats = [
  { value: '500+', label: 'Skilled Workers' },
  { value: '10,000+', label: 'Jobs Completed' },
  { value: '50+', label: 'Service Areas' },
  { value: '4.9★', label: 'Average Rating' },
];

const values = [
  { icon: <FaAward />, title: 'Quality First', desc: 'We never compromise on the quality of work delivered to our customers.' },
  { icon: <FaHandshake />, title: 'Trust & Transparency', desc: 'Upfront pricing, verified workers, and honest communication always.' },
  { icon: <FaClock />, title: 'Reliability', desc: 'On-time service with professional follow-through on every job.' },
];

export default function About() {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-badge">Who We Are</div>
          <h1 className="page-hero__title">About <span>Kaarigar</span></h1>
          <p className="page-hero__subtitle">
            Building trust, one service at a time. We connect skilled professionals with homeowners who need them.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-story">
            <div className="about-story__content">
              <h2>Our <span>Story</span></h2>
              <p>
                Kaarigar was born from a simple realization — finding a reliable electrician, plumber, or mechanic 
                in Pakistan shouldn't be a headache. Founded in Lahore, we set out to create a platform that 
                connects homeowners with verified, skilled professionals.
              </p>
              <p>
                The word <strong>"Kaarigar"</strong> means <em>craftsman</em> in Urdu — a tribute to the skilled 
                workers who keep our homes running. We believe every worker deserves respect, fair pay, and a 
                platform to showcase their expertise.
              </p>
              <p>
                Today, we serve thousands of customers and have a growing network of professionals covering 
                electricians, plumbers, AC technicians, mechanics, painters, carpenters, and more.
              </p>
            </div>
            <div className="about-story__visual">
              <div className="about-visual-card glass-card">
                <FaUsers className="about-visual-card__icon" />
                <h3>Community Driven</h3>
                <p>Built for workers and homeowners alike</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card glass-card">
              <FaBullseye className="mv-card__icon" />
              <h3>Our Mission</h3>
              <p>
                To provide accessible, affordable, and high-quality home services to every household — 
                while empowering skilled workers with steady income and professional growth.
              </p>
            </div>
            <div className="mv-card glass-card">
              <FaEye className="mv-card__icon" />
              <h3>Our Vision</h3>
              <p>
                To become Pakistan's most trusted home services platform — known for quality, reliability, 
                and the best customer experience in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats__grid">
            {stats.map((stat, i) => (
              <div key={i} className="about-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Values</div>
            <h2 className="section-title">What Drives <span>Us</span></h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card glass-card">
                <div className="value-card__icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
