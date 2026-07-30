import { useMemo, useState } from 'react';
import { Shield, UserCog } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import {
  getAdminUsers,
  updateUserRole,
} from '../../services/adminService';
import { getErrorMessage, labelize } from '../../utils/format';
import { cn } from '../../utils/cn';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { data, loading, error, reload, setData } = useFetch(getAdminUsers, []);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const users = useMemo(() => {
    let list = Array.isArray(data) ? data : [];
    if (roleFilter !== 'ALL') {
      list = list.filter((u) => u.role === roleFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.roll_number?.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) =>
      String(a.full_name).localeCompare(String(b.full_name))
    );
  }, [data, query, roleFilter]);

  const onRoleChange = async (userId, role) => {
    setUpdatingId(userId);
    setMessage('');
    setActionError('');
    try {
      const updated = await updateUserRole(userId, role);
      setData((prev) =>
        Array.isArray(prev)
          ? prev.map((u) => (u.id === userId ? { ...u, ...updated } : u))
          : prev
      );
      setMessage(`Updated ${updated.full_name} to ${labelize(updated.role)}.`);
    } catch (err) {
      setActionError(getErrorMessage(err, 'Could not update role'));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Admin"
        title="Users"
        description="Promote students to admin or demote admins back to student."
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search name, email, or roll…"
          className="flex-1"
        />
        <div className="flex gap-2">
          {['ALL', 'student', 'admin'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold',
                roleFilter === role
                  ? 'bg-primary text-white'
                  : 'border border-line bg-white text-muted'
              )}
            >
              {role === 'ALL' ? 'All' : labelize(role)}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl bg-success-soft px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}
      {actionError && (
        <div className="mb-4 rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
          {actionError}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && users.length === 0 && (
        <EmptyState icon={UserCog} title="No users found" />
      )}

      {!loading && !error && users.length > 0 && (
        <Card hover={false} className="!p-0 overflow-hidden">
          <div className="hidden border-b border-line bg-cream px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted md:grid md:grid-cols-[1.4fr_1fr_0.7fr_1fr]">
            <span>User</span>
            <span>Branch</span>
            <span>Role</span>
            <span>Change role</span>
          </div>
          <ul className="divide-y divide-line">
            {users.map((user) => {
              const isSelf = user.id === currentUser?.id;
              return (
                <li
                  key={user.id}
                  className="grid gap-3 px-5 py-4 md:grid-cols-[1.4fr_1fr_0.7fr_1fr] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-ink">
                        {user.full_name}
                      </p>
                      {isSelf && <Badge tone="accent">You</Badge>}
                      {user.role === 'admin' && (
                        <Shield className="h-3.5 w-3.5 text-accent" />
                      )}
                    </div>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                    <p className="text-xs text-muted md:hidden">
                      {user.roll_number}
                    </p>
                  </div>
                  <div className="text-sm text-muted">
                    <p>
                      {user.branch} · Year {user.year}
                    </p>
                    <p className="hidden text-xs md:block">{user.roll_number}</p>
                  </div>
                  <div>
                    <Badge tone={user.role === 'admin' ? 'accent' : 'neutral'}>
                      {labelize(user.role)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      disabled={isSelf || updatingId === user.id}
                      onChange={(e) => onRoleChange(user.id, e.target.value)}
                      options={[
                        { value: 'student', label: 'Student' },
                        { value: 'admin', label: 'Admin' },
                      ]}
                      className="min-w-0"
                    />
                    {updatingId === user.id && (
                      <span className="text-xs text-muted">Saving…</span>
                    )}
                  </div>
                  {isSelf && (
                    <p className="text-xs text-muted md:col-span-4">
                      You can’t change your own role here.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <div className="mt-4">
        <Button variant="secondary" onClick={reload}>
          Refresh list
        </Button>
      </div>
    </div>
  );
}
