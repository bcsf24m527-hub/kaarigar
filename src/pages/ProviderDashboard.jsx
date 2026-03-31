import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import {
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaSignOutAlt,
  FaUser, FaPhone, FaEnvelope, FaCheckCircle, FaTimesCircle, FaInbox
} from 'react-icons/fa';
import './ProviderDashboard.css';

export default function ProviderDashboard() {
  const { user, profile, signOut } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);
  const [hourlyRate, setHourlyRate] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (profile?.hourly_rate) {
      setHourlyRate(profile.hourly_rate);
    }
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [user, profile]);

  const fetchJobs = async () => {
    if (!user || !profile?.service_type) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Providers only see bookings directly assigned to them
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) {
        setJobs(data || []);
      } else {
        console.error('Jobs fetch error:', error);
        setJobs([]);
      }
    } catch (err) {
      console.error('Exception fetching jobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId, status) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', jobId);
    if (!error) {
      showToast('success', `Job ${status.toLowerCase()} successfully!`);
      fetchJobs();
    } else {
      showToast('error', 'Failed to update job status.');
    }
  };

  const saveProfile = async () => {
    setIsUpdatingProfile(true);
    const { error } = await supabase
      .from('profiles')
      .update({ hourly_rate: Number(hourlyRate) })
      .eq('id', user.id);
    if (!error) {
      showToast('success', 'Profile updated successfully!');
    } else {
      showToast('error', 'Failed to update profile.');
    }
    setIsUpdatingProfile(false);
  };

  const uploadAvatar = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setIsUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      showToast('success', 'Avatar updated successfully!');
    } catch (error) {
      showToast('error', 'Error uploading avatar!');
    } finally {
      setIsUploading(false);
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
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="dashboard-user__avatar dashboard-user__avatar--provider dashboard-user__avatar--img" />
              ) : (
                <div className="dashboard-user__avatar dashboard-user__avatar--provider">
                  {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
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
              { key: 'all', label: 'All Jobs' },
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

          <div className="provider-settings glass-card">
            <h3>Profile Settings</h3>
            <div className="provider-settings__grid">
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="avatar-upload-container">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="avatar-preview" />
                  ) : (
                    <div className="avatar-preview avatar-preview--empty">
                      <FaUser />
                    </div>
                  )}
                  <label className="btn btn-sm btn-secondary" htmlFor="avatar-upload">
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={isUploading}
                    style={{ position: 'absolute', visibility: 'hidden' }}
                  />
                </div>
              </div>

              <div className="form-group row-align">
                <div>
                  <label htmlFor="hourlyRate">Hourly Rate (Rs)</label>
                  <input
                    id="hourlyRate"
                    type="number"
                    className="form-control"
                    placeholder="e.g. 500"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={saveProfile}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Rate'}
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-loading">Loading service requests...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="dashboard-empty glass-card">
              <div className="dashboard-empty__icon">
                <FaInbox />
              </div>
              <h3>No Requests Found</h3>
              <p>{filter === 'all' ? 'You have no service requests yet. Once customers book your service, they will appear here.' : `No service requests with "${filter}" status found.`}</p>
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

                  {job.status === 'Confirmed' && (
                    <div className="provider-job-card__actions">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => updateJobStatus(job.id, 'Completed')}
                      >
                        <FaCheckCircle /> Mark Completed
                      </button>
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
