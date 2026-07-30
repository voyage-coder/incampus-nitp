import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user, logout, isAdmin } = useAuth();
  const [prefs, setPrefs] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('incampus_prefs') ||
          '{"compact":false,"emailDigest":true}'
      );
    } catch {
      return { compact: false, emailDigest: true };
    }
  });

  const updatePref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    localStorage.setItem('incampus_prefs', JSON.stringify(next));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage preferences for your InCampus workspace."
      />

      <div className="space-y-4">
        <Card hover={false}>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg font-bold">Account</h2>
            {isAdmin && <Badge tone="accent">Admin</Badge>}
          </div>
          <p className="mt-2 text-sm text-muted">
            Signed in as{' '}
            <span className="font-semibold text-ink">{user?.email}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/app/profile">
              <Button variant="secondary">Edit profile</Button>
            </Link>
            {isAdmin && (
              <Link to="/app/admin">
                <Button variant="soft">Open admin panel</Button>
              </Link>
            )}
            <Button variant="danger" onClick={logout}>
              Sign out
            </Button>
          </div>
        </Card>

        <Card hover={false}>
          <h2 className="font-display text-lg font-bold">Preferences</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between gap-4 rounded-2xl bg-cream px-4 py-3">
              <span className="text-sm font-medium text-ink">
                Compact dashboard spacing
              </span>
              <input
                type="checkbox"
                checked={prefs.compact}
                onChange={(e) => updatePref('compact', e.target.checked)}
                className="h-4 w-4 accent-[#F46173]"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-2xl bg-cream px-4 py-3">
              <span className="text-sm font-medium text-ink">
                Weekly campus digest reminder
              </span>
              <input
                type="checkbox"
                checked={prefs.emailDigest}
                onChange={(e) => updatePref('emailDigest', e.target.checked)}
                className="h-4 w-4 accent-[#F46173]"
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-muted">
            Preferences are stored locally on this device.
          </p>
        </Card>
      </div>
    </div>
  );
}
