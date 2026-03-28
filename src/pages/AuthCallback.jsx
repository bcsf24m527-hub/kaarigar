import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase handles the token exchange automatically via the URL hash
      // We just need to check if a profile exists for social login users
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (!existingProfile) {
          // Create profile for social login user (defaults to service_taker)
          await supabase.from('profiles').insert([{
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            role: 'service_taker',
          }]);
        }

        navigate('/dashboard');
      } else {
        navigate('/login');
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
