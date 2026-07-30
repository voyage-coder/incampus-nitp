import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/format';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-4xl border border-line bg-surface p-6 shadow-card sm:p-8"
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

        <Button type="submit" className="w-full" loading={loading}>
          Continue
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </motion.div>
  );
}
