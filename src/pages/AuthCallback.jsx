import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session?.user) {
          // Check if profile exists
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) console.warn('Profile lookup error:', profileError);

          if (!existingProfile) {
            // Create profile for social login user (defaults to service_taker)
            await supabase.from('profiles').insert([{
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              role: 'service_taker',
            }]);
          }
          navigate('/dashboard', { replace: true });
        } else {
          // Sometimes the URL hash is processed slightly later, give it a tiny delay
          setTimeout(() => navigate('/login', { replace: true }), 1500);
        }
      } catch (err) {
        console.error("Auth Callback Error:", err);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, user]);

  return (
    <div className="auth-page">
      <div style={{
        textAlign: 'center',
        color: 'var(--text-secondary)',
        padding: '40px',
      }}>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}
