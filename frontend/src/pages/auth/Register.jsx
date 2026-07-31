import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import { BRANCHES, YEARS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/format';
import { needsProfileSetup } from '../../utils/profile';

const initial = {
  full_name: '',
  email: '',
  password: '',
  roll_number: '',
  branch: 'CSE',
  year: 1,
};

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value,
    }));
  };

  const onGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setError('Google sign-in did not return a credential.');
      return;
    }

    setGoogleLoading(true);
    setError('');
    try {
      const profile = await loginWithGoogle(credentialResponse.credential);
      navigate(
        needsProfileSetup(profile) ? '/app/complete-profile' : '/app/dashboard',
        { replace: true }
      );
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
      await register(form);
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create account'));
    } finally {
      setLoading(false);
    }
  };

  const busy = loading || googleLoading;

  return (
    <LoadingOverlay
      show={busy}
      label={googleLoading ? 'Signing in with Google…' : 'Creating your account…'}
      className="w-full max-w-xl"
    >
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-4xl border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Join InCampus
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">
        Create your campus profile
      </h1>
      <p className="mt-2 text-sm text-muted">
        One account for marketplace, clubs, PYQs, placements, and your resume.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          name="full_name"
          required
          value={form.full_name}
          onChange={onChange}
          containerClassName="sm:col-span-2"
          disabled={busy}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={onChange}
          containerClassName="sm:col-span-2"
          disabled={busy}
        />
        <Input
          label="Roll number"
          name="roll_number"
          required
          value={form.roll_number}
          onChange={onChange}
          disabled={busy}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={form.password}
          onChange={onChange}
          disabled={busy}
        />
        <Select
          label="Branch"
          name="branch"
          value={form.branch}
          onChange={onChange}
          options={BRANCHES}
          disabled={busy}
        />
        <Select
          label="Year"
          name="year"
          value={form.year}
          onChange={onChange}
          options={YEARS.map((y) => ({ value: y, label: `Year ${y}` }))}
          disabled={busy}
        />

        {error && (
          <div className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary sm:col-span-2">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="sm:col-span-2"
          loading={loading}
          disabled={busy}
        >
          Create account
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
        text="signup_with"
      />

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </motion.div>
    </LoadingOverlay>
  );
}
