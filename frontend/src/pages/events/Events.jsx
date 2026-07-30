import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, List, MapPin, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useFetch } from '../../hooks/useFetch';
import { getEvents, registerForEvent } from '../../services/eventService';
import {
  formatDate,
  formatDateTime,
  getCountdown,
  getErrorMessage,
  labelize,
} from '../../utils/format';
import { cn } from '../../utils/cn';

export default function Events() {
  const { data, loading, error, reload } = useFetch(getEvents, []);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const [registering, setRegistering] = useState(null);
  const [message, setMessage] = useState('');

  const events = useMemo(() => {
    let list = Array.isArray(data) ? data : [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }
    return [...list].sort(
      (a, b) => new Date(a.start_time) - new Date(b.start_time)
    );
  }, [data, query]);

  const calendarBuckets = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      const key = formatDate(event.start_time, {
        month: 'long',
        year: 'numeric',
      });
      if (!map[key]) map[key] = [];
      map[key].push(event);
    });
    return map;
  }, [events]);

  const onRegister = async (id) => {
    setRegistering(id);
    setMessage('');
    try {
      await registerForEvent(id);
      setMessage('Registered successfully.');
    } catch (err) {
      setMessage(getErrorMessage(err, 'Could not register'));
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Events"
        title="What’s happening"
        description="Fests, workshops, and club gatherings — with countdown and one-tap registration."
        actions={
          <div className="flex rounded-2xl border border-line bg-white p-1">
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
                view === 'list' ? 'bg-primary text-white' : 'text-muted'
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold',
                view === 'calendar' ? 'bg-primary text-white' : 'text-muted'
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </button>
          </div>
        }
      />

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search events…"
        className="mb-6 max-w-xl"
      />

      {message && (
        <div className="mb-4 rounded-2xl bg-success-soft px-4 py-3 text-sm text-success">
          {message}
        </div>
      )}

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      )}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && events.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Published campus events will appear here."
        />
      )}

      {!loading && !error && view === 'list' && (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => {
            const countdown = getCountdown(event.start_time);
            return (
              <Card key={event.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Badge tone="primary">{labelize(event.status || 'EVENT')}</Badge>
                  <p className="text-xs font-semibold text-accent">
                    {countdown.expired
                      ? 'Started / past'
                      : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`}
                  </p>
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink">
                  {event.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">
                  {event.description}
                </p>
                <div className="mt-4 space-y-2 text-sm text-muted">
                  <p className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {event.venue}
                  </p>
                  <p>{formatDateTime(event.start_time)}</p>
                  <p className="text-xs">
                    Register by {formatDate(event.registration_deadline)}
                  </p>
                  {event.club_id && (
                    <Link
                      to={`/app/clubs/${event.club_id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <Users className="h-3.5 w-3.5" />
                      View hosting club
                    </Link>
                  )}
                </div>
                {event.status === 'PUBLISHED' ? (
                  <Button
                    className="mt-5"
                    loading={registering === event.id}
                    onClick={() => onRegister(event.id)}
                  >
                    Register
                  </Button>
                ) : (
                  <p className="mt-5 rounded-2xl bg-cream px-4 py-3 text-center text-sm text-muted">
                    Registration opens when this event is published.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {!loading && !error && view === 'calendar' && (
        <div className="space-y-6">
          {Object.entries(calendarBuckets).map(([month, list]) => (
            <section key={month}>
              <h2 className="mb-3 font-display text-xl font-bold">{month}</h2>
              <div className="space-y-3">
                {list.map((event) => (
                  <Card key={event.id} className="!p-4" hover={false}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold text-primary">
                          {formatDate(event.start_time, {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        <p className="font-semibold text-ink">{event.title}</p>
                        <p className="text-sm text-muted">{event.venue}</p>
                        {event.club_id && (
                          <Link
                            to={`/app/clubs/${event.club_id}`}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            <Users className="h-3 w-3" />
                            View club
                          </Link>
                        )}
                      </div>
                      {event.status === 'PUBLISHED' ? (
                        <Button
                          size="sm"
                          loading={registering === event.id}
                          onClick={() => onRegister(event.id)}
                        >
                          Register
                        </Button>
                      ) : (
                        <Badge tone="neutral">Draft</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
