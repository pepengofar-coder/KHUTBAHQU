import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Loader2 } from 'lucide-react';

/**
 * ProtectedRoute — guards routes that require authentication.
 * - loading → spinner
 * - not logged in → redirect to /login
 * - logged in but email not confirmed → confirmation required card
 * - logged in + confirmed → render children
 */
export default function ProtectedRoute({ children }) {
  const { user, loading, isEmailConfirmed, isSupabaseReady } = useAuth();
  const location = useLocation();

  // Supabase not configured — don't block, just show children with guest state
  if (!isSupabaseReady) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Still loading auth state
  if (loading) {
    return (
      <div className="auth-callback container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but email not confirmed
  if (!isEmailConfirmed) {
    return (
      <div className="auth-page container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <Mail size={48} style={{ color: 'var(--color-primary)', marginBottom: 'var(--sp-4)' }} />
          <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, marginBottom: 'var(--sp-3)' }}>
            Konfirmasi Email Diperlukan
          </h2>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--lh-relaxed)', marginBottom: 'var(--sp-4)' }}>
            Silakan cek email Anda dan klik link konfirmasi untuk mengakses Ruang User.
            Periksa juga folder spam.
          </p>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', padding: 'var(--sp-3)', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-md)' }}>
            Email terdaftar: <strong>{user.email}</strong>
          </p>
        </div>
      </div>
    );
  }

  // All good — render protected content
  return children;
}
