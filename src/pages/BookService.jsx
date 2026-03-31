import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { FaCalendarCheck } from 'react-icons/fa';
import { serviceOptions } from '../utils/constants';
import './BookService.css';

export default function BookService() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    service: location.state?.service || '',
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
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [fetchingProviders, setFetchingProviders] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!form.service) {
        setProviders([]);
        setSelectedProvider(null);
        return;
      }
      setFetchingProviders(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'service_provider')
          .eq('service_type', form.service);

        if (!error) {
          setProviders(data || []);
        } else {
          console.error("Provider fetch error:", error);
          setProviders([]);
        }
      } catch (err) {
        console.error("Exception fetching providers:", err);
        setProviders([]);
      } finally {
        setFetchingProviders(false);
        setSelectedProvider(null);
      }
    };

    fetchProviders();
  }, [form.service]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProvider) {
      showToast('error', 'Please select a service provider first.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert([{
        ...form,
        user_id: user.id,
        provider_id: selectedProvider.id,
        provider_name: selectedProvider.full_name || selectedProvider.email,
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

              {form.service && (
                <div className="form-group book-form__full">
                  <label>Available Providers *</label>
                  {fetchingProviders ? (
                    <p className="providers-loading">Finding the best professionals for you...</p>
                  ) : providers.length === 0 ? (
                    <p className="providers-empty">No providers currently available for this service. Please try another.</p>
                  ) : (
                    <div className="providers-grid">
                      {providers.map(p => (
                        <div 
                          key={p.id}
                          className={`provider-card ${selectedProvider?.id === p.id ? 'active' : ''}`}
                          onClick={() => setSelectedProvider(p)}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={`provider-card__avatar ${p.avatar_url ? 'provider-card__avatar--has-img' : ''}`}>
                            {p.avatar_url ? (
                              <img src={p.avatar_url} alt={p.full_name || 'Provider'} className="provider-card__avatar-img" />
                            ) : (
                              p.full_name?.charAt(0).toUpperCase() || p.email?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="provider-card__info">
                            <h4>{p.full_name || p.email}</h4>
                            <span className="provider-rate">Rs {p.hourly_rate || 0} / hr</span>
                            {p.bio && <p className="provider-bio">{p.bio}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
