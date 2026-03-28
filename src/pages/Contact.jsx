import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('contacts').insert([form]);
      if (error) throw error;
      showToast('success', 'Message sent successfully! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      showToast('error', err.message || 'Failed to send message. Please try again.');
    }
    setLoading(false);
  };

  const contactInfo = [
    { icon: <FaPhoneAlt />, label: 'Phone', value: '+92 300 1234567' },
    { icon: <FaEnvelope />, label: 'Email', value: 'info@kaarigar.com' },
    { icon: <FaMapMarkerAlt />, label: 'Address', value: 'Lahore, Pakistan' },
  ];

  return (
    <div className="contact-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <section className="page-hero">
        <div className="container">
          <div className="section-badge">Get In Touch</div>
          <h1 className="page-hero__title">Contact <span>Us</span></h1>
          <p className="page-hero__subtitle">
            Have a question or need help? Reach out — we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <form className="contact-form glass-card" onSubmit={handleSubmit}>
              <h3>Send Us a Message</h3>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  className="form-control"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  className="form-control"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  placeholder="Tell us more..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
              </button>
            </form>

            <div className="contact-info">
              <h3>Contact Information</h3>
              <p>Feel free to reach out through any of these channels. We typically respond within 24 hours.</p>
              <div className="contact-info__cards">
                {contactInfo.map((info, i) => (
                  <div key={i} className="contact-info-card glass-card">
                    <div className="contact-info-card__icon">{info.icon}</div>
                    <div>
                      <span className="contact-info-card__label">{info.label}</span>
                      <p>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
