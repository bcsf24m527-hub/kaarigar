import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSignOutAlt, FaRegCalendarTimes, FaTimes, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import './Dashboard.css';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [providerRate, setProviderRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let subscription = null;

    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);

      // Timeout safeguard: force loading off after 10 seconds
      const timeout = setTimeout(() => {
        if (!cancelled) {
          console.warn('Bookings fetch timed out after 10s');
          setLoading(false);
        }
      }, 10000);

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        clearTimeout(timeout);
        if (cancelled) return;

        if (!error) {
          setBookings(data || []);
        } else {
          console.error('Bookings fetch error:', error);
          setBookings([]);
        }
      } catch (err) {
        clearTimeout(timeout);
        if (cancelled) return;
        console.error('Exception fetching bookings:', err);
        setBookings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBookings();

    if (user) {
      subscription = supabase
        .channel('dashboard-bookings')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setBookings((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setBookings((prev) => prev.map(b => b.id === payload.new.id ? payload.new : b));
            } else if (payload.eventType === 'DELETE') {
              setBookings((prev) => prev.filter(b => b.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    }

    return () => { 
      cancelled = true; 
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [user]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'status--confirmed';
      case 'completed': return 'status--completed';
      case 'cancelled': return 'status--cancelled';
      default: return 'status--pending';
    }
  };

  const handleBookingClick = async (booking) => {
    setSelectedBooking(booking);
    setLoadingRate(true);
    setProviderRate(null);
    try {
      if (booking.provider_id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('hourly_rate')
          .eq('id', booking.provider_id)
          .single();
          
        if (!error && data) {
          setProviderRate(data.hourly_rate);
        }
      }
    } catch (err) {
      console.error('Error fetching rate:', err);
    } finally {
      setLoadingRate(false);
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="dashboard-page">
      <section className="page-hero">
        <div className="container">
          <div className="section-badge">Your Dashboard</div>
          <h1 className="page-hero__title">My <span>Bookings</span></h1>
          <p className="page-hero__subtitle">
            Track and manage all your service bookings in one place.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="dashboard-header">
            <div className="dashboard-user">
              <div className="dashboard-user__avatar">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="dashboard-user__email">{user?.email}</p>
                <span className="dashboard-user__label">Account</span>
              </div>
            </div>
            <button onClick={signOut} className="btn btn-sm btn-secondary">
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {loading ? (
            <div className="dashboard-loading">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="dashboard-empty glass-card">
              <div className="dashboard-empty__icon">
                <FaRegCalendarTimes />
              </div>
              <h3>No Bookings Yet</h3>
              <p>You haven't booked any services yet. Browse our services and book your first appointment!</p>
              <a href="/services" className="btn btn-primary">Browse Services</a>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="booking-card glass-card"
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="booking-card__header">
                    <h4>{booking.service || 'Service Booking'}</h4>
                    <span className={`booking-card__status ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-card__details">
                    <div className="booking-detail">
                      <FaCalendarAlt />
                      <span>{booking.date || 'N/A'}</span>
                    </div>
                    <div className="booking-detail">
                      <FaClock />
                      <span>{booking.time || 'N/A'}</span>
                    </div>
                    <div className="booking-detail">
                      <FaMapMarkerAlt />
                      <span>{booking.address || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="booking-card__hint">Click to view full details</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            <h3 className="modal-title">Booking Details</h3>
            
            <div className="modal-details">
              <div className="modal-detail-row">
                <span className="modal-detail-label">Service</span>
                <span className="modal-detail-value">{selectedBooking.service || 'N/A'}</span>
              </div>
              
              <div className="modal-detail-row">
                <span className="modal-detail-label">Status</span>
                <span className={`booking-card__status ${getStatusClass(selectedBooking.status)}`}>
                  {selectedBooking.status || 'Pending'}
                </span>
              </div>

              <div className="modal-detail-row">
                <span className="modal-detail-label">Provider</span>
                <span className="modal-detail-value d-flex-align">
                  <FaUser style={{marginRight: '6px', color: 'var(--primary)'}}/> 
                  {selectedBooking.provider_name || 'N/A'}
                </span>
              </div>

              <div className="modal-detail-row">
                <span className="modal-detail-label">Rate</span>
                <span className="modal-detail-value d-flex-align">
                  <FaMoneyBillWave style={{marginRight: '6px', color: 'var(--primary)'}}/> 
                  {loadingRate ? 'Loading...' : providerRate ? `Rs ${providerRate} / hr` : 'Not specified'}
                </span>
              </div>

              <div className="modal-detail-row">
                <span className="modal-detail-label">Date & Time</span>
                <span className="modal-detail-value">
                  {selectedBooking.date || 'N/A'} at {selectedBooking.time || 'N/A'}
                </span>
              </div>

              <div className="modal-detail-row">
                <span className="modal-detail-label">Location</span>
                <span className="modal-detail-value">{selectedBooking.address || 'N/A'}</span>
              </div>

              {selectedBooking.notes && (
                <div className="modal-detail-column">
                  <span className="modal-detail-label">Notes</span>
                  <p className="modal-detail-text">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
