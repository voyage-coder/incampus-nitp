import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Pencil, Plus, ShoppingBag, Trash2, UserRound } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ContactModal from '../../components/ui/ContactModal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { MARKETPLACE_CATEGORIES } from '../../constants/navigation';
import { CATEGORY_COLORS } from '../../constants/colors';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../features/marketplace/useWishlist';
import ImageUploadField from '../../components/ui/ImageUploadField';
import {
  createMarketplaceItem,
  deleteMarketplaceItem,
  getMarketplaceItems,
  getMarketplaceItemContact,
  markItemSold,
  recordMarketplaceView,
  updateMarketplaceItem,
  uploadMarketplaceImage,
} from '../../services/marketplaceService';
import { formatPrice, getErrorMessage, labelize } from '../../utils/format';
import { resolveUploadUrl, uploadPathForStorage } from '../../utils/media';
import { cn } from '../../utils/cn';

export default function Marketplace() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(getMarketplaceItems, []);
  const { wishlist, isWished, toggle, count: wishlistCount } = useWishlist();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [wishlistOnly, setWishlistOnly] = useState(false);
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
    category: 'BOOKS',
    price: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [storedImage, setStoredImage] = useState(null);
  const viewedItemsRef = useRef(new Set());

  const isOwnListing = (item) =>
    String(user?.id) === String(item.seller_id);

  const trackListingView = async (itemId) => {
    const key = String(itemId);
    if (viewedItemsRef.current.has(key)) return;
    viewedItemsRef.current.add(key);
    try {
      await recordMarketplaceView(itemId);
    } catch {
      viewedItemsRef.current.delete(key);
    }
  };

  const items = useMemo(() => {
    let list = Array.isArray(data) ? data : [];
    if (category !== 'ALL') list = list.filter((i) => i.category === category);
    if (wishlistOnly) {
      const wished = new Set(wishlist.map(String));
      list = list.filter((i) => wished.has(String(i.id)));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q)
      );
    }
    return [...list].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [data, category, query, wishlist, wishlistOnly]);

  useEffect(() => {
    if (!user?.id || loading) return;
    items.forEach((item) => {
      if (!isOwnListing(item) && item.status === 'AVAILABLE') {
        trackListingView(item.id);
      }
    });
  }, [items, user?.id, loading]);

  const toggleWish = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  const openContact = async (itemId) => {
    setContactOpen(true);
    setContactLoading(true);
    setContactError('');
    setContact(null);
    try {
      const data = await getMarketplaceItemContact(itemId);
      setContact(data);
    } catch (err) {
      setContactError(getErrorMessage(err, 'Could not load contact details'));
    } finally {
      setContactLoading(false);
    }
  };

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
      category: 'BOOKS',
      price: '',
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
      category: item.category || 'BOOKS',
      price: String(item.price ?? ''),
    });
    setImageFile(null);
    setStoredImage(uploadPathForStorage(item.image_url));
    setImagePreview(item.image_url ? resolveUploadUrl(item.image_url) : null);
    setFormError('');
    setOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      let imageUrl = uploadPathForStorage(storedImage);
      if (imageFile) {
        const uploaded = await uploadMarketplaceImage(imageFile);
        imageUrl = uploaded.filename;
      }

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        image_url: imageUrl || null,
      };
      if (editing) {
        await updateMarketplaceItem(editing.id, payload);
      } else {
        await createMarketplaceItem(payload);
      }
      setOpen(false);
      setEditing(null);
      setForm({
        title: '',
        description: '',
        category: 'BOOKS',
        price: '',
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
      await deleteMarketplaceItem(item.id);
      await reload();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  const onSold = async (id) => {
    setActionId(`sold-${id}`);
    try {
      await markItemSold(id);
      await reload();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Marketplace"
        title="Campus finds"
        description="Buy, sell, and wishlist essentials from people on campus."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New listing
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search listings…"
          className="flex-1"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setWishlistOnly((v) => !v)}
            className={cn(
              'inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition',
              wishlistOnly
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-line bg-white text-muted hover:text-ink'
            )}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition',
                wishlistOnly ? 'text-primary' : 'text-muted'
              )}
              fill={wishlistOnly ? 'currentColor' : 'none'}
            />
            Wishlist
            {wishlistCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                {wishlistCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {['ALL', ...MARKETPLACE_CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
              category === cat
                ? 'bg-primary text-white'
                : 'bg-white text-muted border border-line hover:text-ink'
            )}
          >
            {cat === 'ALL' ? 'All' : labelize(cat)}
          </button>
        ))}
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
          icon={ShoppingBag}
          title={wishlistOnly ? 'Wishlist is empty' : 'No listings found'}
          description={
            wishlistOnly
              ? 'Tap the heart on listings you want to save for later.'
              : 'Try another filter, or create the first listing.'
          }
          actionLabel={wishlistOnly ? undefined : 'New listing'}
          onAction={wishlistOnly ? undefined : openCreate}
        />
      )}
      {!loading && !error && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const tone = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.OTHERS;
            const wished = isWished(item.id);
            const photo = resolveUploadUrl(item.image_url);
            return (
              <Card key={item.id} className="flex h-full flex-col" hover={false}>
                <div
                  className="relative mb-4 flex h-36 items-end overflow-hidden rounded-2xl p-4"
                  style={!photo ? { background: tone.bg } : undefined}
                >
                  {photo && (
                    <img
                      src={photo}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <Badge
                    className="relative z-10 !bg-white"
                    style={{ color: tone.text }}
                  >
                    {labelize(item.category)}
                  </Badge>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {item.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={wished}
                    onClick={(e) => toggleWish(e, item.id)}
                    className="relative z-10 shrink-0 rounded-xl p-2 text-muted hover:bg-cream"
                  >
                    <Heart
                      className={cn(
                        'h-5 w-5 transition',
                        wished ? 'text-primary' : 'text-muted'
                      )}
                      fill={wished ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <p className="font-display text-xl font-bold text-primary">
                    {formatPrice(item.price)}
                  </p>
                  <Badge tone={item.status === 'SOLD' ? 'neutral' : 'success'}>
                    {item.status}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {user?.id && !isOwnListing(item) && item.status === 'AVAILABLE' && (
                    <Button
                      variant="soft"
                      size="sm"
                      className="flex-1"
                      onClick={() => openContact(item.id)}
                    >
                      <UserRound className="h-4 w-4" />
                      Contact seller
                    </Button>
                  )}
                {(isOwnListing(item) || user?.role === 'admin') && (
                  <div className="flex w-full flex-wrap gap-2">
                    {item.status === 'AVAILABLE' && isOwnListing(item) && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        loading={actionId === `sold-${item.id}`}
                        onClick={() => onSold(item.id)}
                      >
                        Mark sold
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
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
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit listing' : 'New listing'}
      >
        <form onSubmit={onSubmit} className="space-y-4">
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
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={MARKETPLACE_CATEGORIES.map((c) => ({
              value: c,
              label: labelize(c),
            }))}
          />
          <Input
            label="Price (INR)"
            type="number"
            min="0"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
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
            {editing ? 'Save changes' : 'Publish listing'}
          </Button>
        </form>
      </Modal>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Seller contact"
        contact={contact}
        loading={contactLoading}
        error={contactError}
      />
    </div>
  );
}
