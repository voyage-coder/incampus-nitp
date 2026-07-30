import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { CLUB_CATEGORIES } from '../../constants/navigation';
import { useFetch } from '../../hooks/useFetch';
import { getClubs } from '../../services/clubService';
import { getAdminUsers } from '../../services/adminService';
import {
  createClub,
  deleteClub,
  updateClub,
} from '../../services/adminService';
import { getErrorMessage, labelize } from '../../utils/format';

const emptyForm = {
  name: '',
  description: '',
  category: 'TECHNICAL',
  logo: '',
  founder_id: '',
};

export default function AdminClubs() {
  const clubsQ = useFetch(getClubs, []);
  const usersQ = useFetch(getAdminUsers, []);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  const clubs = useMemo(() => {
    let list = Array.isArray(clubsQ.data) ? clubsQ.data : [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [clubsQ.data, query]);

  const founderOptions = useMemo(() => {
    const users = Array.isArray(usersQ.data) ? usersQ.data : [];
    return users.map((u) => ({
      value: u.id,
      label: `${u.full_name} (${u.email})`,
    }));
  }, [usersQ.data]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      founder_id: founderOptions[0]?.value || '',
    });
    setFormError('');
    setOpen(true);
  };

  const openEdit = (club) => {
    setEditing(club);
    setForm({
      name: club.name || '',
      description: club.description || '',
      category: club.category || 'TECHNICAL',
      logo: club.logo || '',
      founder_id: '',
    });
    setFormError('');
    setOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setMessage('');
    try {
      if (editing) {
        const payload = {
          name: form.name,
          description: form.description,
          category: form.category,
          ...(form.logo?.trim() ? { logo: form.logo.trim() } : {}),
        };
        await updateClub(editing.id, payload);
        setMessage(`Updated ${form.name}.`);
      } else {
        if (!form.founder_id) {
          setFormError('Select a founder for the new club.');
          setSaving(false);
          return;
        }
        await createClub({
          name: form.name,
          description: form.description,
          category: form.category,
          founder_id: form.founder_id,
          ...(form.logo?.trim() ? { logo: form.logo.trim() } : { logo: null }),
        });
        setMessage(`Created ${form.name}.`);
      }
      setOpen(false);
      await clubsQ.reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (club) => {
    const ok = window.confirm(
      `Delete “${club.name}”? This cannot be undone.`
    );
    if (!ok) return;
    setMessage('');
    try {
      await deleteClub(club.id);
      setMessage(`Deleted ${club.name}.`);
      await clubsQ.reload();
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not delete club'));
    }
  };

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Admin"
        title="Clubs"
        description="Create campus clubs and assign a founding president."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New club
          </Button>
        }
      />

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search clubs…"
        className="mb-6 max-w-xl"
      />

      {message && (
        <div className="mb-4 rounded-2xl bg-success-soft px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}
      {formError && !open && (
        <div className="mb-4 rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
          {formError}
        </div>
      )}

      {clubsQ.loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      {clubsQ.error && (
        <ErrorState message={clubsQ.error} onRetry={clubsQ.reload} />
      )}
      {!clubsQ.loading && !clubsQ.error && clubs.length === 0 && (
        <EmptyState
          icon={Users}
          title="No clubs yet"
          description="Create the first campus club."
          actionLabel="New club"
          onAction={openCreate}
        />
      )}

      {!clubsQ.loading && !clubsQ.error && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clubs.map((club) => (
            <Card key={club.id} className="flex flex-col">
              <Badge tone="primary">{labelize(club.category)}</Badge>
              <h3 className="mt-3 font-display text-xl font-bold text-ink">
                {club.name}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
                {club.description}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEdit(club)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(club)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit club' : 'Create club'}
        size="lg"
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Name"
            required
            minLength={3}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            label="Description"
            required
            minLength={10}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={CLUB_CATEGORIES.map((c) => ({
              value: c,
              label: labelize(c),
            }))}
          />
          {!editing && (
            <Select
              label="Founder (becomes president)"
              value={form.founder_id}
              onChange={(e) =>
                setForm({ ...form, founder_id: e.target.value })
              }
              options={founderOptions}
              placeholder={
                usersQ.loading ? 'Loading users…' : 'Select founder'
              }
            />
          )}
          <Input
            label="Logo URL (optional)"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
            placeholder="https://…"
          />
          {formError && (
            <p className="rounded-2xl bg-primary-soft px-3 py-2 text-sm text-primary">
              {formError}
            </p>
          )}
          <Button type="submit" className="w-full" loading={saving}>
            {editing ? 'Save changes' : 'Create club'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
