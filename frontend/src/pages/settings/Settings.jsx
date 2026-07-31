import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';

export default function Settings() {
  const { user, logout, isAdmin } = useAuth();
  const { prefs, updatePref } = usePreferences();

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
              <div>
                <span className="text-sm font-medium text-ink">
                  Compact dashboard spacing
                </span>
                <p className="mt-0.5 text-xs text-muted">
                  Tighter layout on the dashboard and workspace pages.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefs.compact}
                onChange={(e) => updatePref('compact', e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[#F46173]"
              />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-2xl bg-cream px-4 py-3">
              <div>
                <span className="text-sm font-medium text-ink">
                  Weekly campus digest reminder
                </span>
                <p className="mt-0.5 text-xs text-muted">
                  Show a weekly summary card on your dashboard.
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefs.emailDigest}
                onChange={(e) => updatePref('emailDigest', e.target.checked)}
                className="h-4 w-4 shrink-0 accent-[#F46173]"
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
