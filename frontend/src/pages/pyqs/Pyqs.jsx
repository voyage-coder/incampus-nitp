import { useMemo, useState } from 'react';
import { BookOpen, Download, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { BRANCHES, SEMESTERS } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import { createPyq, deletePyq, getPyqs } from '../../services/pyqService';
import { getErrorMessage, labelize } from '../../utils/format';
import { cn } from '../../utils/cn';

export default function Pyqs() {
  const { user } = useAuth();
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    subject: '',
    course_code: '',
    branch: 'CSE',
    semester: 'SEM1',
    year: new Date().getFullYear(),
    pdf_url: '',
  });

  const { data, loading, error, reload } = useFetch(
    () =>
      getPyqs({
        ...(branch ? { branch } : {}),
        ...(semester ? { semester } : {}),
      }),
    [branch, semester]
  );

  const items = useMemo(() => {
    let list = Array.isArray(data) ? data : [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.subject?.toLowerCase().includes(q) ||
          i.course_code?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, query]);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await createPyq({
        ...form,
        year: Number(form.year),
      });
      setOpen(false);
      await reload();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (pyq) => {
    if (!window.confirm(`Delete PYQ for ${pyq.subject}?`)) return;
    try {
      await deletePyq(pyq.id);
      await reload();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const canManage = (pyq) =>
    user?.id === pyq.user_id || user?.role === 'admin';

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Academics"
        title="Previous year questions"
        description="Filter by branch and semester, then download what you need."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            Upload PYQ
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search subject or course code…"
        />
        <Select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          options={[{ value: '', label: 'All branches' }, ...BRANCHES]}
          className="min-w-[160px]"
        />
        <Select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          options={[
            { value: '', label: 'All semesters' },
            ...SEMESTERS.map((s) => ({ value: s, label: labelize(s) })),
          ]}
          className="min-w-[160px]"
        />
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {['', ...SEMESTERS].map((sem) => (
          <button
            key={sem || 'all'}
            type="button"
            onClick={() => setSemester(sem)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold',
              semester === sem
                ? 'bg-primary text-white'
                : 'border border-line bg-white text-muted'
            )}
          >
            {sem ? labelize(sem) : 'All'}
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
          icon={BookOpen}
          title="No PYQs found"
          description="Upload a paper to help your batchmates."
          actionLabel="Upload PYQ"
          onAction={() => setOpen(true)}
        />
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((pyq) => (
            <Card key={pyq.id} className="flex flex-col">
              <Badge tone="primary">{labelize(pyq.semester)}</Badge>
              <h3 className="mt-3 font-display text-xl font-bold text-ink">
                {pyq.subject}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {pyq.course_code} · {pyq.branch} · {pyq.year}
              </p>
              <div className="mt-auto flex gap-2 pt-4">
                <a
                  href={pyq.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1"
                >
                  <Button variant="secondary" className="w-full">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </a>
                {canManage(pyq) && (
                  <Button
                    variant="danger"
                    size="icon"
                    onClick={() => onDelete(pyq)}
                    aria-label="Delete PYQ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Upload PYQ">
        <form onSubmit={onCreate} className="space-y-4">
          <Input
            label="Subject"
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <Input
            label="Course code"
            required
            value={form.course_code}
            onChange={(e) => setForm({ ...form, course_code: e.target.value })}
          />
          <Select
            label="Branch"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
            options={BRANCHES}
          />
          <Select
            label="Semester"
            value={form.semester}
            onChange={(e) => setForm({ ...form, semester: e.target.value })}
            options={SEMESTERS.map((s) => ({
              value: s,
              label: labelize(s),
            }))}
          />
          <Input
            label="Year"
            type="number"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
          <Input
            label="PDF URL"
            required
            value={form.pdf_url}
            onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
          />
          {formError && (
            <p className="rounded-2xl bg-primary-soft px-3 py-2 text-sm text-primary">
              {formError}
            </p>
          )}
          <Button type="submit" className="w-full" loading={saving}>
            Upload
          </Button>
        </form>
      </Modal>
    </div>
  );
}
