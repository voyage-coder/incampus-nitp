import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/format';
import { needsProfileSetup } from '../../utils/profile';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError('Google sign-in did not return a credential.');
      return;
    }

    setGoogleLoading(true);
    setError('');
    try {
      const profile = await loginWithGoogle(credentialResponse.credential);
      const redirectTo = needsProfileSetup(profile)
        ? '/app/complete-profile'
        : location.state?.from?.pathname || '/app/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Google sign-in failed'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/app/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || googleLoading;

  return (
    <LoadingOverlay
      show={busy}
      label={googleLoading ? 'Signing in with Google…' : 'Signing in…'}
      className="w-full max-w-md"
    >
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-4xl border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Welcome back
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">
        Sign in to InCampus
      </h1>
      <p className="mt-2 text-sm text-muted">
        Your marketplace, events, resume, and placements — one workspace.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <Input
          label="College email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@nitp.ac.in"
          value={form.email}
          onChange={onChange}
          disabled={busy}
        />
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            disabled={busy}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-muted"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" loading={loading} disabled={busy}>
          Continue
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          or
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <GoogleSignInButton
        onSuccess={onGoogleSuccess}
        onError={() => setError('Google sign-in was cancelled or failed.')}
        disabled={busy}
        loading={googleLoading}
      />

      <p className="mt-6 text-center text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </motion.div>
    </LoadingOverlay>
  );
}
