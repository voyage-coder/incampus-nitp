import { useEffect, useState } from 'react';
import {
  Code2,
  Globe,
  Link as LinkIcon,
  Pencil,
  Upload,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import ErrorState from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { BRANCHES, YEARS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  updateProfile,
  uploadProfileImage,
} from '../../services/authService';
import { getErrorMessage } from '../../utils/format';

export default function Profile() {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    branch: 'CSE',
    year: 1,
    bio: '',
    phone: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        branch: user.branch || 'CSE',
        year: user.year || 1,
        bio: user.bio || '',
        phone: user.phone || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || '',
      });
    }
  }, [user]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        full_name: form.full_name,
        branch: form.branch,
        year: Number(form.year),
        bio: form.bio || null,
        phone: form.phone?.trim() || null,
      };
      if (form.github?.trim()) payload.github = form.github.trim();
      if (form.linkedin?.trim()) payload.linkedin = form.linkedin.trim();
      if (form.portfolio?.trim()) payload.portfolio = form.portfolio.trim();

      await updateProfile(payload);
      await refreshUser();
      setEditing(false);
      setMessage('Profile updated.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError('');
    try {
      await uploadProfileImage(file);
      await refreshUser();
      setMessage('Photo updated.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return <ErrorState message="Could not load profile" onRetry={refreshUser} />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Profile"
        title={user.full_name}
        description="Your public campus identity across InCampus."
        actions={
          !editing && (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" />
              Edit profile
            </Button>
          )
        }
      />

      {message && (
        <div className="mb-4 rounded-2xl bg-success-soft px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card hover={false} className="text-center">
          <div className="mx-auto w-fit">
            <Avatar
              name={user.full_name}
              src={user.profile_image}
              size="xl"
            />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold">{user.full_name}</h2>
          <p className="text-sm text-muted">{user.email}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge tone="primary">{user.branch}</Badge>
            <Badge>Year {user.year}</Badge>
            <Badge tone="accent">{user.roll_number}</Badge>
          </div>
          <label className="mt-5 inline-flex cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            <span className="inline-flex h-11 items-center gap-2 rounded-2xl border border-line bg-cream px-4 text-sm font-semibold text-ink">
              <Upload className="h-4 w-4" />
              Upload photo
            </span>
          </label>
        </Card>

        <div className="space-y-4">
          {editing ? (
            <Card hover={false}>
              <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  containerClassName="sm:col-span-2"
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
                  onChange={(e) =>
                    setForm({ ...form, year: Number(e.target.value) })
                  }
                  options={YEARS.map((y) => ({
                    value: y,
                    label: `Year ${y}`,
                  }))}
                />
                <Textarea
                  label="Bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  containerClassName="sm:col-span-2"
                />
                <Input
                  label="Phone (optional)"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  containerClassName="sm:col-span-2"
                />
                <Input
                  label="GitHub"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
                <Input
                  label="LinkedIn"
                  value={form.linkedin}
                  onChange={(e) =>
                    setForm({ ...form, linkedin: e.target.value })
                  }
                />
                <Input
                  label="Portfolio"
                  value={form.portfolio}
                  onChange={(e) =>
                    setForm({ ...form, portfolio: e.target.value })
                  }
                  containerClassName="sm:col-span-2"
                />
                <div className="flex gap-2 sm:col-span-2">
                  <Button type="submit" loading={saving}>
                    Save changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <>
              <Card hover={false}>
                <h3 className="font-display text-lg font-bold">Contact</h3>
                <p className="mt-2 text-sm text-muted">
                  {user.email}
                  {user.phone ? ` · ${user.phone}` : ''}
                </p>
              </Card>
              <Card hover={false}>
                <h3 className="font-display text-lg font-bold">About</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {user.bio || 'Add a short bio to introduce yourself.'}
                </p>
              </Card>
              <Card hover={false}>
                <h3 className="font-display text-lg font-bold">Links</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <a
                    href={user.github || '#'}
                    className="flex items-center gap-2 text-muted hover:text-ink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Code2 className="h-4 w-4" />
                    {user.github || 'Add GitHub'}
                  </a>
                  <a
                    href={user.linkedin || '#'}
                    className="flex items-center gap-2 text-muted hover:text-ink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe className="h-4 w-4" />
                    {user.linkedin || 'Add LinkedIn'}
                  </a>
                  <a
                    href={user.portfolio || '#'}
                    className="flex items-center gap-2 text-muted hover:text-ink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {user.portfolio || 'Add portfolio'}
                  </a>
                </div>
              </Card>
              <Card hover={false}>
                <h3 className="font-display text-lg font-bold">Timeline</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  <li className="rounded-2xl bg-cream px-4 py-3">
                    Joined InCampus as {user.role}
                  </li>
                  <li className="rounded-2xl bg-cream px-4 py-3">
                    Studying {user.branch}, Year {user.year}
                  </li>
                  <li className="rounded-2xl bg-cream px-4 py-3">
                    Roll number {user.roll_number}
                  </li>
                </ul>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
