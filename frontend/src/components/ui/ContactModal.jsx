import Modal from './Modal';
import Button from './Button';
import { Skeleton } from './Skeleton';

export default function ContactModal({
  open,
  onClose,
  title = 'Contact details',
  contact,
  loading,
  error,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-40" />
        </div>
      )}
      {!loading && error && (
        <p className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}
      {!loading && !error && contact && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Name
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {contact.full_name}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Email
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-1 block text-sm font-semibold text-primary hover:underline"
            >
              {contact.email}
            </a>
          </div>
          {contact.phone && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Phone
              </p>
              <a
                href={`tel:${contact.phone}`}
                className="mt-1 block text-sm font-semibold text-ink"
              >
                {contact.phone}
              </a>
            </div>
          )}
        </div>
      )}
      <Button variant="secondary" className="mt-5 w-full" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
}
