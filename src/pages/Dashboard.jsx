import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setBookings(data || []);
    setLoading(false);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'status--confirmed';
      case 'completed': return 'status--completed';
      case 'cancelled': return 'status--cancelled';
      default: return 'status--pending';
    }
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
              <h3>No Bookings Yet</h3>
              <p>You haven't booked any services yet. Start by browsing our services!</p>
              <a href="/services" className="btn btn-primary">Browse Services</a>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card glass-card">
                  <div className="booking-card__header">
                    <h4>{booking.service}</h4>
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
                  {booking.notes && (
                    <p className="booking-card__notes">{booking.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
