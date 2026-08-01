import { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2, UserRound } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ContactModal from '../../components/ui/ContactModal';
import ImageUploadField from '../../components/ui/ImageUploadField';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import { getUserContact } from '../../services/authService';
import {
  claimLostFoundItem,
  createLostFoundItem,
  deleteLostFoundItem,
  getLostFoundItems,
  updateLostFoundItem,
  uploadLostFoundImage,
} from '../../services/lostFoundService';
import { getErrorMessage, labelize, timeAgo } from '../../utils/format';
import { resolveUploadUrl, uploadPathForStorage } from '../../utils/media';
import { cn } from '../../utils/cn';

export default function LostFound() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(getLostFoundItems, []);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [formError, setFormError] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contact, setContact] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'LOST',
    location: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [storedImage, setStoredImage] = useState(null);

  const items = useMemo(() => {
    let list = Array.isArray(data) ? data : [];
    if (type !== 'ALL') list = list.filter((i) => i.type === type);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }
    return [...list].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [data, type, query]);

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview(null);
    setStoredImage(null);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      description: '',
      type: 'LOST',
      location: '',
    });
    resetImageState();
    setFormError('');
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'LOST',
      location: item.location || '',
    });
    setImageFile(null);
    setStoredImage(uploadPathForStorage(item.image_url));
    setImagePreview(item.image_url ? resolveUploadUrl(item.image_url) : null);
    setFormError('');
    setOpen(true);
  };

  const canManage = (item) =>
    user?.id === item.user_id || user?.role === 'admin';

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      let imageUrl = uploadPathForStorage(storedImage);
      if (imageFile) {
        const uploaded = await uploadLostFoundImage(imageFile);
        imageUrl = uploaded.filename;
      }

      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        location: form.location,
        image_url: imageUrl || null,
      };
      if (editing) {
        await updateLostFoundItem(editing.id, payload);
      } else {
        await createLostFoundItem(payload);
      }
      setOpen(false);
      setEditing(null);
      setForm({
        title: '',
        description: '',
        type: 'LOST',
        location: '',
      });
      resetImageState();
      await reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setActionId(`delete-${item.id}`);
    try {
      await deleteLostFoundItem(item.id);
      await reload();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const onClaim = async (id) => {
    setActionId(`claim-${id}`);
    try {
      await claimLostFoundItem(id);
      await reload();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const openContact = async (userId) => {
    setContactOpen(true);
    setContactLoading(true);
    setContactError('');
    setContact(null);
    try {
      const data = await getUserContact(userId);
      setContact(data);
    } catch (err) {
      setContactError(getErrorMessage(err, 'Could not load contact details'));
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Campus help"
        title="Lost & Found"
        description="Report lost items or help reunite found ones with their owners."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New report
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by item or location…"
          className="flex-1"
        />
        <div className="flex gap-2">
          {['ALL', 'LOST', 'FOUND'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold',
                type === t
                  ? 'bg-primary text-white'
                  : 'border border-line bg-white text-muted'
              )}
            >
              {t === 'ALL' ? 'All' : labelize(t)}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={Search}
          title="Nothing reported yet"
          description="Post a lost or found item to get started."
          actionLabel="New report"
          onAction={openCreate}
        />
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const photo = resolveUploadUrl(item.image_url);
            return (
            <Card key={item.id} className="flex flex-col">
              {photo && (
                <img
                  src={photo}
                  alt={item.title}
                  className="mb-4 h-40 w-full rounded-2xl object-cover"
                />
              )}
              <div className="flex items-center justify-between gap-2">
                <Badge tone={item.type === 'LOST' ? 'primary' : 'success'}>
                  {item.type}
                </Badge>
                <Badge tone={item.status === 'OPEN' ? 'accent' : 'neutral'}>
                  {item.status}
                </Badge>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted">
                {item.description}
              </p>
              <p className="mt-3 text-xs text-muted">
                {item.location} · {timeAgo(item.created_at)}
              </p>
              {user?.id !== item.user_id && item.status === 'OPEN' && (
                <Button
                  variant="soft"
                  size="sm"
                  className="mt-4"
                  onClick={() => openContact(item.user_id)}
                >
                  <UserRound className="h-4 w-4" />
                  Contact poster
                </Button>
              )}
              {canManage(item) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.status === 'OPEN' && user?.id === item.user_id && (
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={actionId === `claim-${item.id}`}
                      onClick={() => onClaim(item.id)}
                    >
                      Mark claimed
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={actionId === `delete-${item.id}`}
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit report' : 'New report'}
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[
              { value: 'LOST', label: 'Lost' },
              { value: 'FOUND', label: 'Found' },
            ]}
          />
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            label="Description"
            required
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <Input
            label="Location"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <ImageUploadField
            preview={imagePreview}
            onPreviewChange={(url) => {
              setImagePreview(url);
              if (!url) setStoredImage(null);
            }}
            onFileChange={setImageFile}
          />
          {formError && (
            <p className="rounded-2xl bg-primary-soft px-3 py-2 text-sm text-primary">
              {formError}
            </p>
          )}
          <Button type="submit" className="w-full" loading={saving}>
            {editing ? 'Save changes' : 'Submit report'}
          </Button>
        </form>
      </Modal>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Poster contact"
        contact={contact}
        loading={contactLoading}
        error={contactError}
      />
    </div>
  );
}
