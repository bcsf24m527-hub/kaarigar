import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSignOutAlt,
  FaUser, FaPhone, FaEnvelope, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import './ProviderDashboard.css';

export default function ProviderDashboard() {
  const { user, profile, signOut } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [user, profile]);

  const fetchJobs = async () => {
    if (!user || !profile?.service_type) {
      setLoading(false);
      return;
    }
    setLoading(true);
    // Providers see bookings matching their service expertise
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('service', profile.service_type)
      .order('created_at', { ascending: false });
    if (!error) setJobs(data || []);
    setLoading(false);
  };

  const updateJobStatus = async (jobId, status) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status, provider_id: user.id, provider_name: profile?.full_name || user.email })
      .eq('id', jobId);
    if (!error) {
      showToast('success', `Job ${status.toLowerCase()} successfully!`);
      fetchJobs();
    } else {
      showToast('error', 'Failed to update job status.');
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'status--confirmed';
      case 'completed': return 'status--completed';
      case 'cancelled': return 'status--cancelled';
      default: return 'status--pending';
    }
  };

  const filteredJobs = filter === 'all'
    ? jobs
    : filter === 'my_jobs'
      ? jobs.filter(j => j.provider_id === user.id)
      : jobs.filter(j => j.status?.toLowerCase() === filter);

  const myJobsCount = jobs.filter(j => j.provider_id === user.id).length;
  const pendingCount = jobs.filter(j => j.status === 'Pending').length;

  return (
    <div className="provider-dashboard">
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <section className="page-hero">
        <div className="container">
          <div className="section-badge">Provider Dashboard</div>
          <h1 className="page-hero__title">Service <span>Requests</span></h1>
          <p className="page-hero__subtitle">
            View and manage incoming service requests from customers.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="dashboard-header">
            <div className="dashboard-user">
              <div className="dashboard-user__avatar dashboard-user__avatar--provider">
                {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="dashboard-user__email">{profile?.full_name || user?.email}</p>
                <span className="dashboard-user__label">Service Provider</span>
              </div>
            </div>
            <button onClick={signOut} className="btn btn-sm btn-secondary">
              <FaSignOutAlt /> Logout
            </button>
          </div>

          {/* Stats Row */}
          <div className="provider-stats">
            <div className="provider-stat glass-card">
              <strong>{jobs.length}</strong>
              <span>Total Requests</span>
            </div>
            <div className="provider-stat glass-card">
              <strong>{pendingCount}</strong>
              <span>Pending</span>
            </div>
            <div className="provider-stat glass-card">
              <strong>{myJobsCount}</strong>
              <span>My Jobs</span>
            </div>
          </div>

          {/* Filters */}
          <div className="provider-filters">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'my_jobs', label: 'My Jobs' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'completed', label: 'Completed' },
            ].map(f => (
              <button
                key={f.key}
                className={`provider-filter ${filter === f.key ? 'provider-filter--active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="dashboard-loading">Loading service requests...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="dashboard-empty glass-card">
              <h3>No Requests Found</h3>
              <p>No service requests match the current filter.</p>
            </div>
          ) : (
            <div className="provider-jobs-grid">
              {filteredJobs.map((job) => (
                <div key={job.id} className="provider-job-card glass-card">
                  <div className="provider-job-card__header">
                    <h4>{job.service}</h4>
                    <span className={`booking-card__status ${getStatusClass(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="provider-job-card__customer">
                    <div className="provider-job-detail">
                      <FaUser /> <span>{job.user_name || 'N/A'}</span>
                    </div>
                    <div className="provider-job-detail">
                      <FaEnvelope /> <span>{job.user_email || 'N/A'}</span>
                    </div>
                    <div className="provider-job-detail">
                      <FaPhone /> <span>{job.user_phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="provider-job-card__details">
                    <div className="provider-job-detail">
                      <FaCalendarAlt /> <span>{job.date || 'N/A'}</span>
                    </div>
                    <div className="provider-job-detail">
                      <FaClock /> <span>{job.time || 'N/A'}</span>
                    </div>
                    <div className="provider-job-detail">
                      <FaMapMarkerAlt /> <span>{job.address || 'N/A'}</span>
                    </div>
                  </div>

                  {job.notes && (
                    <p className="provider-job-card__notes">{job.notes}</p>
                  )}

                  {job.status === 'Pending' && (
                    <div className="provider-job-card__actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => updateJobStatus(job.id, 'Confirmed')}
                      >
                        <FaCheckCircle /> Accept Job
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => updateJobStatus(job.id, 'Cancelled')}
                      >
                        <FaTimesCircle /> Decline
                      </button>
                    </div>
                  )}

                  {job.status === 'Confirmed' && job.provider_id === user.id && (
                    <div className="provider-job-card__actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => updateJobStatus(job.id, 'Completed')}
                      >
                        <FaCheckCircle /> Mark Completed
                      </button>
                    </div>
                  )}

                  {job.provider_name && job.status !== 'Pending' && (
                    <div className="provider-job-card__assigned">
                      Assigned to: <strong>{job.provider_name}</strong>
                    </div>
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
