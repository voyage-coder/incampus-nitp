import { useMemo, useState } from 'react';
import { Briefcase, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import {
  createPlacementExperience,
  deletePlacementExperience,
  getPlacementExperiences,
  updatePlacementExperience,
} from '../../services/placementService';
import { getErrorMessage, labelize } from '../../utils/format';

const emptyForm = {
  company: '',
  role: '',
  job_type: 'FULL_TIME',
  cgpa: '',
  ctc: '',
  stipend: '',
  year: new Date().getFullYear(),
  interview_rounds: '',
  preparation: '',
  experience: '',
};

export default function Placements() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(
    getPlacementExperiences,
    []
  );
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState('');

  const items = useMemo(() => {
    let list = Array.isArray(data) ? data : [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.company?.toLowerCase().includes(q) ||
          i.role?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, query]);

  const stats = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const companies = new Set(list.map((i) => i.company)).size;
    const interns = list.filter((i) => i.job_type === 'INTERNSHIP').length;
    const full = list.filter((i) => i.job_type === 'FULL_TIME').length;
    return { total: list.length, companies, interns, full };
  }, [data]);

  const canManage = (item) =>
    user?.id === item.user_id || user?.role === 'admin';

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      company: item.company || '',
      role: item.role || '',
      job_type: item.job_type || 'FULL_TIME',
      cgpa: String(item.cgpa ?? ''),
      ctc: item.ctc != null ? String(item.ctc) : '',
      stipend: item.stipend != null ? String(item.stipend) : '',
      year: item.year || new Date().getFullYear(),
      interview_rounds: item.interview_rounds || '',
      preparation: item.preparation || '',
      experience: item.experience || '',
    });
    setFormError('');
    setOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        company: form.company,
        role: form.role,
        job_type: form.job_type,
        cgpa: Number(form.cgpa),
        ctc: form.ctc ? Number(form.ctc) : null,
        stipend: form.stipend ? Number(form.stipend) : null,
        year: Number(form.year),
        interview_rounds: form.interview_rounds,
        preparation: form.preparation,
        experience: form.experience,
      };
      if (editing) {
        await updatePlacementExperience(editing.id, payload);
      } else {
        await createPlacementExperience(payload);
      }
      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Delete experience for ${item.company}?`)) return;
    setDeletingId(item.id);
    try {
      await deletePlacementExperience(item.id);
      if (selected?.id === item.id) setSelected(null);
      await reload();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Placements"
        title="Interview experiences"
        description="Company cards, prep notes, and real stories from campus."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Share experience
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Experiences', value: stats.total },
          { label: 'Companies', value: stats.companies },
          { label: 'Internships', value: stats.interns },
          { label: 'Full-time', value: stats.full },
        ].map((stat) => (
          <Card key={stat.label} hover={false} className="!p-4">
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-1 font-display text-3xl font-bold text-ink">
              {loading ? '—' : stat.value}
            </p>
          </Card>
        ))}
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search company or role…"
        className="mb-6 max-w-xl"
      />

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      )}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="No experiences yet"
          description="Be the first senior to share your interview story."
          actionLabel="Share experience"
          onAction={openCreate}
        />
      )}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl font-bold text-ink">
                    {item.company}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    {item.role}
                  </p>
                </div>
                <Badge tone="accent">{labelize(item.job_type)}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                <Badge>CGPA {item.cgpa}</Badge>
                <Badge tone="neutral">Year {item.year}</Badge>
                {item.ctc != null && <Badge tone="success">CTC {item.ctc}</Badge>}
                {item.stipend != null && (
                  <Badge tone="success">Stipend {item.stipend}</Badge>
                )}
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-muted">
                {item.experience}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelected(item)}
                >
                  Read full story
                </Button>
                {canManage(item) && (
                  <>
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
                      loading={deletingId === item.id}
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.company} · ${selected.role}` : 'Story'}
        size="lg"
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <section>
              <h4 className="font-semibold text-ink">Interview rounds</h4>
              <p className="mt-1 whitespace-pre-wrap text-muted">
                {selected.interview_rounds}
              </p>
            </section>
            <section>
              <h4 className="font-semibold text-ink">Preparation</h4>
              <p className="mt-1 whitespace-pre-wrap text-muted">
                {selected.preparation}
              </p>
            </section>
            <section>
              <h4 className="font-semibold text-ink">Experience</h4>
              <p className="mt-1 whitespace-pre-wrap text-muted">
                {selected.experience}
              </p>
            </section>
            {canManage(selected) && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelected(null);
                    openEdit(selected);
                  }}
                >
                  Edit story
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deletingId === selected.id}
                  onClick={() => onDelete(selected)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          editing ? 'Edit placement experience' : 'Share placement experience'
        }
        size="lg"
      >
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Company"
            required
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <Input
            label="Role"
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <Select
            label="Job type"
            value={form.job_type}
            onChange={(e) => setForm({ ...form, job_type: e.target.value })}
            options={[
              { value: 'FULL_TIME', label: 'Full-time' },
              { value: 'INTERNSHIP', label: 'Internship' },
            ]}
          />
          <Input
            label="CGPA"
            type="number"
            step="0.01"
            required
            value={form.cgpa}
            onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
          />
          <Input
            label="CTC (optional)"
            type="number"
            value={form.ctc}
            onChange={(e) => setForm({ ...form, ctc: e.target.value })}
          />
          <Input
            label="Stipend (optional)"
            type="number"
            value={form.stipend}
            onChange={(e) => setForm({ ...form, stipend: e.target.value })}
          />
          <Input
            label="Year"
            type="number"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            containerClassName="sm:col-span-2"
          />
          <Textarea
            label="Interview rounds"
            required
            value={form.interview_rounds}
            onChange={(e) =>
              setForm({ ...form, interview_rounds: e.target.value })
            }
            containerClassName="sm:col-span-2"
          />
          <Textarea
            label="Preparation"
            required
            value={form.preparation}
            onChange={(e) => setForm({ ...form, preparation: e.target.value })}
            containerClassName="sm:col-span-2"
          />
          <Textarea
            label="Experience"
            required
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            containerClassName="sm:col-span-2"
          />
          {formError && (
            <p className="rounded-2xl bg-primary-soft px-3 py-2 text-sm text-primary sm:col-span-2">
              {formError}
            </p>
          )}
          <Button type="submit" className="sm:col-span-2" loading={saving}>
            {editing ? 'Save changes' : 'Publish story'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
