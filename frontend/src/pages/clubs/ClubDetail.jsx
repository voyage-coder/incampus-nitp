import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
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
import {
  EVENT_STATUSES,
  MEMBERSHIP_ROLES,
  RECRUITMENT_STATUSES,
} from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import {
  approveApplication,
  applyToRecruitment,
  createRecruitment,
  deleteRecruitment,
  getClub,
  getClubMembers,
  getClubRecruitments,
  getRecruitmentApplications,
  rejectApplication,
  removeMember,
  updateMemberRole,
  updateRecruitment,
} from '../../services/clubService';
import {
  createClubEvent,
  deleteEvent,
  getEventRegistrations,
  getClubEvents,
  registerForEvent,
  updateEvent,
} from '../../services/eventService';
import {
  formatDate,
  formatDateTime,
  getErrorMessage,
  labelize,
} from '../../utils/format';
import { cn } from '../../utils/cn';

const TABS = [
  { id: 'inductions', label: 'Inductions' },
  { id: 'events', label: 'Events' },
  { id: 'members', label: 'Members' },
];

function toLocalInput(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value) {
  return new Date(value).toISOString();
}

export default function ClubDetail() {
  const { clubId } = useParams();
  const { user } = useAuth();
  const [tab, setTab] = useState('inductions');
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const clubQ = useFetch(() => getClub(clubId), [clubId]);
  const membersQ = useFetch(() => getClubMembers(clubId), [clubId]);
  const recruitmentsQ = useFetch(() => getClubRecruitments(clubId), [clubId]);
  const eventsQ = useFetch(() => getClubEvents(clubId), [clubId]);

  const myMembership = useMemo(() => {
    const list = Array.isArray(membersQ.data) ? membersQ.data : [];
    return list.find((m) => m.user_id === user?.id) || null;
  }, [membersQ.data, user?.id]);

  const isPresident = myMembership?.role === 'PRESIDENT';

  const clubEvents = useMemo(() => {
    const list = Array.isArray(eventsQ.data) ? eventsQ.data : [];
    return [...list].sort(
      (a, b) => new Date(a.start_time) - new Date(b.start_time)
    );
  }, [eventsQ.data]);

  const recruitments = Array.isArray(recruitmentsQ.data)
    ? [...recruitmentsQ.data].sort(
        (a, b) => new Date(b.application_start) - new Date(a.application_start)
      )
    : [];
  const members = Array.isArray(membersQ.data) ? membersQ.data : [];

  // Recruitment modal
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [editingRecruit, setEditingRecruit] = useState(null);
  const [recruitForm, setRecruitForm] = useState({
    title: '',
    description: '',
    application_start: '',
    application_end: '',
    status: 'OPEN',
  });
  const [saving, setSaving] = useState(false);

  // Applications modal
  const [appsOpen, setAppsOpen] = useState(false);
  const [appsRecruitment, setAppsRecruitment] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Event modal
  const [eventOpen, setEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    venue: '',
    start_time: '',
    end_time: '',
    registration_deadline: '',
    max_participants: 50,
    banner_url: '',
    status: 'PUBLISHED',
  });

  // Registrations modal
  const [regsOpen, setRegsOpen] = useState(false);
  const [regsEvent, setRegsEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);

  const flash = (ok, err) => {
    setMessage(ok || '');
    setActionError(err || '');
  };

  const openCreateRecruitment = () => {
    setEditingRecruit(null);
    setRecruitForm({
      title: '',
      description: '',
      application_start: '',
      application_end: '',
      status: 'OPEN',
    });
    setRecruitOpen(true);
  };

  const openEditRecruitment = (drive) => {
    setEditingRecruit(drive);
    setRecruitForm({
      title: drive.title || '',
      description: drive.description || '',
      application_start: toLocalInput(drive.application_start),
      application_end: toLocalInput(drive.application_end),
      status: drive.status || 'OPEN',
    });
    setRecruitOpen(true);
  };

  const saveRecruitment = async (e) => {
    e.preventDefault();
    setSaving(true);
    flash('', '');
    try {
      const payload = {
        title: recruitForm.title,
        description: recruitForm.description || null,
        application_start: fromLocalInput(recruitForm.application_start),
        application_end: fromLocalInput(recruitForm.application_end),
      };
      if (editingRecruit) {
        await updateRecruitment(editingRecruit.id, {
          ...payload,
          status: recruitForm.status,
        });
        flash('Induction updated.');
      } else {
        await createRecruitment(clubId, {
          ...payload,
          status: recruitForm.status,
        });
        flash('Induction created.');
      }
      setRecruitOpen(false);
      await recruitmentsQ.reload();
    } catch (err) {
      flash('', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDeleteRecruitment = async (drive) => {
    if (!window.confirm(`Delete induction “${drive.title}”?`)) return;
    try {
      await deleteRecruitment(drive.id);
      flash('Induction deleted.');
      await recruitmentsQ.reload();
    } catch (err) {
      flash('', getErrorMessage(err));
    }
  };

  const onApply = async (recruitmentId) => {
    flash('', '');
    try {
      await applyToRecruitment(recruitmentId);
      flash('Application submitted.');
    } catch (err) {
      flash('', getErrorMessage(err, 'Could not apply'));
    }
  };

  const openApplications = async (drive) => {
    setAppsRecruitment(drive);
    setAppsOpen(true);
    setAppsLoading(true);
    try {
      const list = await getRecruitmentApplications(drive.id);
      setApplications(Array.isArray(list) ? list : []);
    } catch (err) {
      setApplications([]);
      flash('', getErrorMessage(err, 'Could not load applications'));
    } finally {
      setAppsLoading(false);
    }
  };

  const reviewApp = async (applicationId, action) => {
    try {
      if (action === 'approve') await approveApplication(applicationId);
      else await rejectApplication(applicationId);
      const list = await getRecruitmentApplications(appsRecruitment.id);
      setApplications(Array.isArray(list) ? list : []);
      await membersQ.reload();
      flash(`Application ${action}d.`);
    } catch (err) {
      flash('', getErrorMessage(err));
    }
  };

  const openCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      venue: '',
      start_time: '',
      end_time: '',
      registration_deadline: '',
      max_participants: 50,
      banner_url: '',
      status: 'PUBLISHED',
    });
    setEventOpen(true);
  };

  const openEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      venue: event.venue || '',
      start_time: toLocalInput(event.start_time),
      end_time: toLocalInput(event.end_time),
      registration_deadline: toLocalInput(event.registration_deadline),
      max_participants: event.max_participants || 50,
      banner_url: event.banner_url || '',
      status: event.status || 'PUBLISHED',
    });
    setEventOpen(true);
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    flash('', '');
    try {
      const base = {
        title: eventForm.title,
        description: eventForm.description,
        venue: eventForm.venue,
        start_time: fromLocalInput(eventForm.start_time),
        end_time: fromLocalInput(eventForm.end_time),
        registration_deadline: fromLocalInput(eventForm.registration_deadline),
        max_participants: Number(eventForm.max_participants),
        banner_url: eventForm.banner_url || null,
      };
      if (editingEvent) {
        await updateEvent(editingEvent.id, {
          ...base,
          status: eventForm.status,
        });
        flash('Event updated.');
      } else {
        await createClubEvent(clubId, {
          ...base,
          status: eventForm.status,
        });
        flash('Event created.');
      }
      setEventOpen(false);
      await eventsQ.reload();
    } catch (err) {
      flash('', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDeleteEvent = async (event) => {
    if (!window.confirm(`Delete event “${event.title}”?`)) return;
    try {
      await deleteEvent(event.id);
      flash('Event deleted.');
      await eventsQ.reload();
    } catch (err) {
      flash('', getErrorMessage(err));
    }
  };

  const onRegisterEvent = async (eventId) => {
    flash('', '');
    try {
      await registerForEvent(eventId);
      flash('Registered for event.');
    } catch (err) {
      flash('', getErrorMessage(err));
    }
  };

  const openRegistrations = async (event) => {
    setRegsEvent(event);
    setRegsOpen(true);
    setRegsLoading(true);
    try {
      const list = await getEventRegistrations(event.id);
      setRegistrations(Array.isArray(list) ? list : []);
    } catch (err) {
      setRegistrations([]);
      flash('', getErrorMessage(err));
    } finally {
      setRegsLoading(false);
    }
  };

  const onChangeRole = async (memberUserId, role) => {
    try {
      await updateMemberRole(clubId, memberUserId, role);
      await membersQ.reload();
      flash('Member role updated.');
    } catch (err) {
      flash('', getErrorMessage(err));
    }
  };

  const onRemoveMember = async (memberUserId, label) => {
    if (!window.confirm(`Remove ${label || 'this member'}?`)) return;
    try {
      await removeMember(clubId, memberUserId);
      await membersQ.reload();
      flash('Member removed.');
    } catch (err) {
      flash('', getErrorMessage(err));
    }
  };

  useEffect(() => {
    setMessage('');
    setActionError('');
  }, [clubId, tab]);

  if (clubQ.loading) {
    return (
      <div className="mx-auto max-w-wide space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (clubQ.error || !clubQ.data) {
    return (
      <div className="mx-auto max-w-wide">
        <ErrorState
          message={clubQ.error || 'Club not found'}
          onRetry={clubQ.reload}
        />
        <Link to="/app/clubs" className="mt-4 inline-block">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to clubs
          </Button>
        </Link>
      </div>
    );
  }

  const club = clubQ.data;

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <div>
        <Link
          to="/app/clubs"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All clubs
        </Link>
        <PageHeader
          eyebrow={labelize(club.category)}
          title={club.name}
          description={club.description}
          actions={
            <div className="flex flex-wrap gap-2">
              {myMembership && (
                <Badge tone="success">{labelize(myMembership.role)}</Badge>
              )}
              {isPresident && (
                <Badge tone="accent">Management access</Badge>
              )}
            </div>
          }
        />
      </div>

      {message && (
        <div className="rounded-2xl bg-success-soft px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}
      {actionError && (
        <div className="rounded-2xl bg-primary-soft px-4 py-3 text-sm text-primary">
          {actionError}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto border-b border-line pb-px">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'shrink-0 rounded-t-2xl px-4 py-2.5 text-sm font-semibold transition',
              tab === item.id
                ? 'bg-white text-primary border border-b-white border-line -mb-px'
                : 'text-muted hover:text-ink'
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'inductions' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">Inductions</h2>
              <p className="text-sm text-muted">
                Open recruitment drives for this club.
              </p>
            </div>
            {isPresident && (
              <Button onClick={openCreateRecruitment}>
                <Plus className="h-4 w-4" />
                New induction
              </Button>
            )}
          </div>

          {recruitmentsQ.loading && <Skeleton className="h-32" />}
          {recruitmentsQ.error && (
            <ErrorState
              message={recruitmentsQ.error}
              onRetry={recruitmentsQ.reload}
            />
          )}
          {!recruitmentsQ.loading && recruitments.length === 0 && (
            <EmptyState
              icon={Users}
              title="No inductions yet"
              description={
                isPresident
                  ? 'Create a recruitment drive when you’re ready to onboard members.'
                  : 'Check back when this club opens inductions.'
              }
              actionLabel={isPresident ? 'New induction' : undefined}
              onAction={isPresident ? openCreateRecruitment : undefined}
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {recruitments.map((drive) => (
              <Card key={drive.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {drive.title}
                  </h3>
                  <Badge
                    tone={
                      drive.status === 'OPEN'
                        ? 'success'
                        : drive.status === 'DRAFT'
                          ? 'neutral'
                          : 'accent'
                    }
                  >
                    {drive.status}
                  </Badge>
                </div>
                {drive.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted">
                    {drive.description}
                  </p>
                )}
                <p className="mt-3 text-xs text-muted">
                  {formatDate(drive.application_start)} –{' '}
                  {formatDate(drive.application_end)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {drive.status === 'OPEN' && (
                    <Button size="sm" onClick={() => onApply(drive.id)}>
                      Apply
                    </Button>
                  )}
                  {isPresident && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openApplications(drive)}
                      >
                        Applications
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditRecruitment(drive)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDeleteRecruitment(drive)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {tab === 'events' && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">Club events</h2>
              <p className="text-sm text-muted">
                Events hosted by {club.name}.
              </p>
            </div>
            {isPresident && (
              <Button onClick={openCreateEvent}>
                <Plus className="h-4 w-4" />
                New event
              </Button>
            )}
          </div>

          {eventsQ.loading && <Skeleton className="h-32" />}
          {!eventsQ.loading && clubEvents.length === 0 && (
            <EmptyState
              icon={CalendarDays}
              title="No events for this club"
              description={
                isPresident
                  ? 'Publish a workshop, fest, or meetup.'
                  : 'Nothing scheduled yet.'
              }
              actionLabel={isPresident ? 'New event' : undefined}
              onAction={isPresident ? openCreateEvent : undefined}
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {clubEvents.map((event) => (
              <Card key={event.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-bold">{event.title}</h3>
                  <Badge>{labelize(event.status)}</Badge>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {event.description}
                </p>
                <p className="mt-3 text-xs text-muted">
                  {event.venue} · {formatDateTime(event.start_time)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {event.status === 'PUBLISHED' ? (
                    <Button size="sm" onClick={() => onRegisterEvent(event.id)}>
                      Register
                    </Button>
                  ) : (
                    <Badge tone="neutral">Not open for registration</Badge>
                  )}
                  {isPresident && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openRegistrations(event)}
                      >
                        Registrations
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEditEvent(event)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDeleteEvent(event)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {tab === 'members' && (
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold">
              Members ({members.length})
            </h2>
            <p className="text-sm text-muted">
              {isPresident
                ? 'Update roles or remove members.'
                : 'People currently in this club.'}
            </p>
          </div>

          {membersQ.loading && <Skeleton className="h-32" />}
          {membersQ.error && (
            <ErrorState message={membersQ.error} onRetry={membersQ.reload} />
          )}
          {!membersQ.loading && members.length === 0 && (
            <EmptyState icon={Users} title="No members listed" />
          )}

          <Card hover={false} className="!p-0 overflow-hidden">
            <ul className="divide-y divide-line">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {member.user_full_name || `Member · ${String(member.user_id).slice(0, 8)}…`}
                    </p>
                    {member.user_email && (
                      <p className="text-xs text-muted">{member.user_email}</p>
                    )}
                    <p className="text-xs text-muted">
                      Joined {formatDate(member.joined_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isPresident ? (
                      <>
                        <Select
                          value={member.role}
                          onChange={(e) =>
                            onChangeRole(member.user_id, e.target.value)
                          }
                          options={MEMBERSHIP_ROLES.map((r) => ({
                            value: r,
                            label: labelize(r),
                          }))}
                          className="min-w-[160px]"
                        />
                        {member.user_id !== user?.id && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              onRemoveMember(member.user_id, member.role)
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </>
                    ) : (
                      <Badge tone="primary">{labelize(member.role)}</Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* Recruitment modal */}
      <Modal
        open={recruitOpen}
        onClose={() => setRecruitOpen(false)}
        title={editingRecruit ? 'Edit induction' : 'New induction'}
      >
        <form onSubmit={saveRecruitment} className="space-y-4">
          <Input
            label="Title"
            required
            value={recruitForm.title}
            onChange={(e) =>
              setRecruitForm({ ...recruitForm, title: e.target.value })
            }
          />
          <Textarea
            label="Description"
            value={recruitForm.description}
            onChange={(e) =>
              setRecruitForm({ ...recruitForm, description: e.target.value })
            }
          />
          <Input
            label="Application start"
            type="datetime-local"
            required
            value={recruitForm.application_start}
            onChange={(e) =>
              setRecruitForm({
                ...recruitForm,
                application_start: e.target.value,
              })
            }
          />
          <Input
            label="Application end"
            type="datetime-local"
            required
            value={recruitForm.application_end}
            onChange={(e) =>
              setRecruitForm({
                ...recruitForm,
                application_end: e.target.value,
              })
            }
          />
          {editingRecruit && (
            <Select
              label="Status"
              value={recruitForm.status}
              onChange={(e) =>
                setRecruitForm({ ...recruitForm, status: e.target.value })
              }
              options={RECRUITMENT_STATUSES.map((s) => ({
                value: s,
                label: labelize(s),
              }))}
            />
          )}
          <Button type="submit" className="w-full" loading={saving}>
            {editingRecruit ? 'Save changes' : 'Create induction'}
          </Button>
        </form>
      </Modal>

      {/* Applications modal */}
      <Modal
        open={appsOpen}
        onClose={() => setAppsOpen(false)}
        title={
          appsRecruitment
            ? `Applications · ${appsRecruitment.title}`
            : 'Applications'
        }
        size="lg"
      >
        {appsLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-muted">No applications yet.</p>
        ) : (
          <ul className="space-y-3">
            {applications.map((app) => (
              <li
                key={app.id}
                className="rounded-2xl border border-line bg-cream p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {app.user_full_name || `Applicant · ${String(app.user_id).slice(0, 8)}…`}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDateTime(app.applied_at)} · {app.status}
                    </p>
                  </div>
                  {app.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => reviewApp(app.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => reviewApp(app.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Event modal */}
      <Modal
        open={eventOpen}
        onClose={() => setEventOpen(false)}
        title={editingEvent ? 'Edit event' : 'New event'}
        size="lg"
      >
        <form onSubmit={saveEvent} className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Title"
            required
            value={eventForm.title}
            onChange={(e) =>
              setEventForm({ ...eventForm, title: e.target.value })
            }
            containerClassName="sm:col-span-2"
          />
          <Textarea
            label="Description"
            required
            value={eventForm.description}
            onChange={(e) =>
              setEventForm({ ...eventForm, description: e.target.value })
            }
            containerClassName="sm:col-span-2"
          />
          <Input
            label="Venue"
            required
            value={eventForm.venue}
            onChange={(e) =>
              setEventForm({ ...eventForm, venue: e.target.value })
            }
            containerClassName="sm:col-span-2"
          />
          <Input
            label="Start"
            type="datetime-local"
            required
            value={eventForm.start_time}
            onChange={(e) =>
              setEventForm({ ...eventForm, start_time: e.target.value })
            }
          />
          <Input
            label="End"
            type="datetime-local"
            required
            value={eventForm.end_time}
            onChange={(e) =>
              setEventForm({ ...eventForm, end_time: e.target.value })
            }
          />
          <Input
            label="Registration deadline"
            type="datetime-local"
            required
            value={eventForm.registration_deadline}
            onChange={(e) =>
              setEventForm({
                ...eventForm,
                registration_deadline: e.target.value,
              })
            }
          />
          <Input
            label="Max participants"
            type="number"
            min="1"
            required
            value={eventForm.max_participants}
            onChange={(e) =>
              setEventForm({
                ...eventForm,
                max_participants: e.target.value,
              })
            }
          />
          <Input
            label="Banner URL (optional)"
            value={eventForm.banner_url}
            onChange={(e) =>
              setEventForm({ ...eventForm, banner_url: e.target.value })
            }
            containerClassName="sm:col-span-2"
          />
          {editingEvent && (
            <Select
              label="Status"
              value={eventForm.status}
              onChange={(e) =>
                setEventForm({ ...eventForm, status: e.target.value })
              }
              options={EVENT_STATUSES.map((s) => ({
                value: s,
                label: labelize(s),
              }))}
              containerClassName="sm:col-span-2"
            />
          )}
          <Button type="submit" className="sm:col-span-2" loading={saving}>
            {editingEvent ? 'Save changes' : 'Create event'}
          </Button>
        </form>
      </Modal>

      {/* Registrations modal */}
      <Modal
        open={regsOpen}
        onClose={() => setRegsOpen(false)}
        title={
          regsEvent ? `Registrations · ${regsEvent.title}` : 'Registrations'
        }
      >
        {regsLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : registrations.length === 0 ? (
          <p className="text-sm text-muted">No registrations yet.</p>
        ) : (
          <ul className="space-y-2">
            {registrations.map((reg) => (
              <li
                key={reg.id}
                className="rounded-2xl border border-line bg-cream px-4 py-3 text-sm"
              >
                User {String(reg.user_id).slice(0, 8)}… ·{' '}
                {formatDateTime(reg.registered_at)}
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  );
}
