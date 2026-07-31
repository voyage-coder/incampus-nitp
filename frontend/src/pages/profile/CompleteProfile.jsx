import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { BRANCHES, YEARS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/authService';
import { getErrorMessage } from '../../utils/format';
import { needsProfileSetup } from '../../utils/profile';

export default function CompleteProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    roll_number: '',
    branch: 'CSE',
    year: 1,
  });

  useEffect(() => {
    if (user && !needsProfileSetup(user)) {
      navigate('/app/dashboard', { replace: true });
      return;
    }
    if (user) {
      setForm({
        full_name: user.full_name || '',
        roll_number: user.roll_number?.startsWith('G-') ? '' : user.roll_number || '',
        branch: user.branch === 'TBD' ? 'CSE' : user.branch || 'CSE',
        year: user.year || 1,
      });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile({
        full_name: form.full_name.trim(),
        roll_number: form.roll_number.trim().toUpperCase(),
        branch: form.branch,
        year: Number(form.year),
      });
      await refreshUser();
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not save profile'));
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        eyebrow="One more step"
        title="Complete your profile"
        description="Google sign-in created your account. Add your campus details so classmates and features work correctly."
      />

      <Card hover={false} className="mt-6">
        <p className="mb-4 text-sm text-muted">
          Signed in as <span className="font-medium text-ink">{user.email}</span>
        </p>

        <form onSubmit={onSubmit} className="grid gap-4">
          <Input
            label="Full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <Input
            label="Roll number"
            value={form.roll_number}
            onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
            placeholder="e.g. 2201CS001"
            required
          />
          <Select
            label="Branch"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
            options={BRANCHES}
          />
          <Select
            label="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            options={YEARS.map((y) => ({ value: y, label: `Year ${y}` }))}
          />

          {error && (
            <div className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" loading={saving}>
            Continue to dashboard
          </Button>
        </form>
      </Card>
    </div>
  );
}
