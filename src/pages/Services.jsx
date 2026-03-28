import { Link } from 'react-router-dom';
import {
  FaBolt, FaWrench, FaSnowflake, FaCar, FaPaintBrush, FaHammer,
  FaArrowRight, FaTools, FaShower, FaPlug
} from 'react-icons/fa';
import './Services.css';

const services = [
  {
    icon: <FaBolt />,
    title: 'Electrician',
    desc: 'Complete electrical solutions including wiring, panel upgrades, fixture installations, fault detection, and emergency repairs. Our certified electricians ensure safe and code-compliant work.',
    features: ['Wiring & Rewiring', 'Switch & Socket Repair', 'Panel Upgrades', 'Emergency Fixes'],
    color: '#f59e0b',
  },
  {
    icon: <FaWrench />,
    title: 'Plumber',
    desc: 'Expert plumbing services from leak detection to complete bathroom renovations. We handle pipe fitting, drain cleaning, water heater installations, and all plumbing emergencies.',
    features: ['Leak Detection', 'Pipe Fitting', 'Drain Cleaning', 'Water Heater Service'],
    color: '#3b82f6',
  },
  {
    icon: <FaSnowflake />,
    title: 'AC Service',
    desc: 'Keep cool with our comprehensive AC services. We offer installation, routine maintenance, gas refilling, duct cleaning, and 24/7 emergency repair for all AC brands and types.',
    features: ['Installation', 'Gas Refill', 'Routine Maintenance', 'Duct Cleaning'],
    color: '#06b6d4',
  },
  {
    icon: <FaCar />,
    title: 'Mechanic',
    desc: 'Reliable vehicle maintenance and repair services. From engine diagnostics to oil changes, brake repairs to transmission service — we keep your vehicle running smoothly.',
    features: ['Engine Repair', 'Oil Change', 'Brake Service', 'Diagnostics'],
    color: '#ef4444',
  },
  {
    icon: <FaPaintBrush />,
    title: 'Painter',
    desc: 'Transform your space with professional painting services. We handle interior and exterior painting, texture finishes, waterproofing, and decorative wall treatments.',
    features: ['Interior Painting', 'Exterior Painting', 'Texture Finish', 'Waterproofing'],
    color: '#8b5cf6',
  },
  {
    icon: <FaHammer />,
    title: 'Carpenter',
    desc: 'Custom carpentry and woodwork for your home. We build furniture, install cabinets, repair doors, and create bespoke wooden solutions tailored to your needs.',
    features: ['Custom Furniture', 'Cabinet Installation', 'Door Repair', 'Wood Polishing'],
    color: '#f97316',
  },
  {
    icon: <FaTools />,
    title: 'Handyman',
    desc: 'General maintenance and repair services for your home. From mounting shelves to assembling furniture, our handymen handle all the small jobs that matter.',
    features: ['Furniture Assembly', 'Wall Mounting', 'Minor Repairs', 'Home Maintenance'],
    color: '#10b981',
  },
  {
    icon: <FaShower />,
    title: 'Bathroom Renovation',
    desc: 'Complete bathroom makeover services. We handle tiling, fixture installation, vanity setup, and full renovation projects to create your dream bathroom.',
    features: ['Tiling', 'Fixture Install', 'Vanity Setup', 'Full Renovation'],
    color: '#ec4899',
  },
  {
    icon: <FaPlug />,
    title: 'Appliance Repair',
    desc: 'Expert repair services for all home appliances. Washing machines, refrigerators, microwaves, dishwashers — we fix them all with genuine spare parts.',
    features: ['Washing Machine', 'Refrigerator', 'Microwave', 'Dishwasher'],
    color: '#14b8a6',
  },
];

export default function Services() {
  return (
    <div className="services-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-badge">What We Do</div>
          <h1 className="page-hero__title">Our <span>Services</span></h1>
          <p className="page-hero__subtitle">
            Professional home services delivered by verified experts. Browse our full range of services below.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-page__grid">
            {services.map((service, i) => (
              <div key={i} className="service-detail-card glass-card" style={{ '--accent': service.color }}>
                <div className="service-detail-card__header">
                  <div className="service-detail-card__icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                </div>
                <p className="service-detail-card__desc">{service.desc}</p>
                <ul className="service-detail-card__features">
                  {service.features.map((f, j) => (
                    <li key={j}>{f}</li>
                  ))}
                </ul>
                <Link to="/book" className="btn btn-sm btn-outline service-detail-card__btn">
                  Book Now <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
