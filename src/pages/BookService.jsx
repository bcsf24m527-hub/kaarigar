import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { FaCalendarCheck } from 'react-icons/fa';
import { serviceOptions } from '../utils/constants';
import './BookService.css';

export default function BookService() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    service: '',
    user_name: '',
    user_email: user?.email || '',
    user_phone: '',
    address: '',
    date: '',
    time: '',
    notes: '',
  });
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
      const { error } = await supabase.from('bookings').insert([{
        ...form,
        user_id: user.id,
        status: 'Pending',
      }]);
      if (error) throw error;
      showToast('success', 'Booking submitted successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      showToast('error', err.message || 'Failed to submit booking. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="book-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <section className="page-hero">
        <div className="container">
          <div className="section-badge">Book a Service</div>
          <h1 className="page-hero__title">Schedule Your <span>Service</span></h1>
          <p className="page-hero__subtitle">
            Fill in the details below and we'll connect you with the right professional.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <form className="book-form glass-card" onSubmit={handleSubmit}>
            <div className="book-form__grid">
              <div className="form-group">
                <label htmlFor="service">Service Type *</label>
                <select
                  id="service"
                  name="service"
                  className="form-control"
                  value={form.service}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="user_name">Full Name *</label>
                <input
                  id="user_name"
                  name="user_name"
                  className="form-control"
                  placeholder="Your full name"
                  value={form.user_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_email">Email *</label>
                <input
                  id="user_email"
                  name="user_email"
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={form.user_email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_phone">Phone Number *</label>
                <input
                  id="user_phone"
                  name="user_phone"
                  type="tel"
                  className="form-control"
                  placeholder="+92 300 1234567"
                  value={form.user_phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group book-form__full">
                <label htmlFor="address">Address *</label>
                <input
                  id="address"
                  name="address"
                  className="form-control"
                  placeholder="Full service address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Preferred Date *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Preferred Time *</label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  className="form-control"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group book-form__full">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-control"
                  placeholder="Any specific requirements or details..."
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Submitting...' : <><FaCalendarCheck /> Confirm Booking</>}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
