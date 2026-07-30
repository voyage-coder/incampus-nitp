import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  FileText,
  ShoppingBag,
  Users,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import { getEvents } from '../../services/eventService';
import { getMarketplaceItems } from '../../services/marketplaceService';
import { getClubs } from '../../services/clubService';
import { getPyqs } from '../../services/pyqService';
import { getPlacementExperiences } from '../../services/placementService';
import { getMyResume } from '../../services/resumeService';
import { formatDate, formatPrice, timeAgo } from '../../utils/format';

const quickActions = [
  { to: '/app/marketplace', label: 'Sell an item', icon: ShoppingBag },
  { to: '/app/events', label: 'Browse events', icon: CalendarDays },
  { to: '/app/resume', label: 'Edit resume', icon: FileText },
  { to: '/app/pyqs', label: 'Find PYQs', icon: BookOpen },
  { to: '/app/clubs', label: 'Explore clubs', icon: Users },
  { to: '/app/placements', label: 'Placement prep', icon: Briefcase },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function resumeProgress(resume) {
  if (!resume) return 0;
  const checks = [
    resume.headline,
    resume.summary,
    resume.educations?.length,
    resume.experiences?.length,
    resume.projects?.length,
    resume.skills?.length,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

export default function DashboardHome() {
  const { user } = useAuth();
  const eventsQ = useFetch(getEvents, []);
  const marketQ = useFetch(getMarketplaceItems, []);
  const clubsQ = useFetch(getClubs, []);
  const pyqsQ = useFetch(() => getPyqs({ branch: user?.branch }), [user?.branch], {
    enabled: Boolean(user?.branch),
  });
  const placementsQ = useFetch(getPlacementExperiences, []);
  const resumeQ = useFetch(
    async () => {
      try {
        return await getMyResume();
      } catch (err) {
        if (err?.response?.status === 404) return null;
        throw err;
      }
    },
    []
  );

  const upcomingEvents = useMemo(() => {
    const list = Array.isArray(eventsQ.data) ? eventsQ.data : [];
    return [...list]
      .filter((e) => e.status === 'PUBLISHED' || !e.status)
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      .slice(0, 3);
  }, [eventsQ.data]);

  const recentMarket = useMemo(() => {
    const list = Array.isArray(marketQ.data) ? marketQ.data : [];
    return [...list]
      .filter((i) => i.status === 'AVAILABLE')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 4);
  }, [marketQ.data]);

  const clubs = (Array.isArray(clubsQ.data) ? clubsQ.data : []).slice(0, 4);
  const pyqs = (Array.isArray(pyqsQ.data) ? pyqsQ.data : []).slice(0, 4);
  const placements = (Array.isArray(placementsQ.data) ? placementsQ.data : []).slice(0, 3);
  const progress = resumeProgress(resumeQ.data);

  const activity = useMemo(() => {
    const feed = [];
    recentMarket.forEach((item) =>
      feed.push({
        id: `m-${item.id}`,
        title: item.title,
        meta: `Marketplace · ${formatPrice(item.price)}`,
        at: item.created_at,
      })
    );
    upcomingEvents.forEach((event) =>
      feed.push({
        id: `e-${event.id}`,
        title: event.title,
        meta: `Event · ${formatDate(event.start_time)}`,
        at: event.created_at || event.start_time,
      })
    );
    placements.forEach((p) =>
      feed.push({
        id: `p-${p.id}`,
        title: `${p.company} · ${p.role}`,
        meta: 'Placement experience',
        at: p.created_at,
      })
    );
    return feed
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 6);
  }, [recentMarket, upcomingEvents, placements]);

  const anyError =
    eventsQ.error || marketQ.error || clubsQ.error || placementsQ.error;

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title={`${greeting()}, ${user?.full_name?.split(' ')[0] || 'there'}`}
        description={`${user?.branch || 'Campus'} · Year ${user?.year || '—'} · Your day on InCampus`}
        actions={
          <Link to="/app/notifications">
            <Button variant="secondary">View activity</Button>
          </Link>
        }
      />

      {anyError && (
        <ErrorState
          message="Some dashboard sections failed to load. You can still browse each module."
        />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" hover={false}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">Resume progress</p>
              <p className="mt-1 font-display text-3xl font-bold text-ink">
                {resumeQ.loading ? '…' : `${progress}%`}
              </p>
            </div>
            <Link to="/app/resume">
              <Button size="sm">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-primary"
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            Keep your resume fresh for placements and internships.
          </p>
        </Card>

        <Card hover={false} surface="primary">
          <p className="text-sm text-white/80">Quick tip</p>
          <p className="mt-2 font-display text-2xl font-bold">
            Wishlist marketplace finds before fest week.
          </p>
          <Link to="/app/marketplace" className="mt-5 inline-block">
            <Button variant="secondary" size="sm">
              Open marketplace
            </Button>
          </Link>
        </Card>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Quick actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <Card className="h-full">
                <action.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold text-ink">
                  {action.label}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Upcoming events</h2>
              <Link to="/app/events" className="text-sm font-semibold text-primary">
                View all
              </Link>
            </div>
            {eventsQ.loading ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
                <Skeleton className="h-36" />
              </div>
            ) : upcomingEvents.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No upcoming events"
                description="When clubs publish events, they’ll show up here."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <Badge tone="primary">{event.venue || 'Campus'}</Badge>
                    <h3 className="mt-3 font-semibold text-ink">{event.title}</h3>
                    <p className="mt-2 text-xs text-muted">
                      {formatDate(event.start_time)}
                    </p>
                    {event.club_id && (
                      <Link
                        to={`/app/clubs/${event.club_id}`}
                        className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
                      >
                        View club
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Recent marketplace</h2>
              <Link
                to="/app/marketplace"
                className="text-sm font-semibold text-primary"
              >
                Browse
              </Link>
            </div>
            {marketQ.loading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
              </div>
            ) : recentMarket.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="Marketplace is quiet"
                description="Be the first to list something useful."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {recentMarket.map((item) => (
                  <Card key={item.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted">{item.category}</p>
                        <h3 className="mt-1 font-semibold text-ink">
                          {item.title}
                        </h3>
                      </div>
                      <p className="font-display font-bold text-primary">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Recent PYQs</h2>
              <Link to="/app/pyqs" className="text-sm font-semibold text-primary">
                Library
              </Link>
            </div>
            {pyqsQ.loading ? (
              <Skeleton className="h-28" />
            ) : pyqs.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No PYQs for your branch yet"
                description="Upload papers to help your juniors."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {pyqs.map((pyq) => (
                  <Card key={pyq.id}>
                    <h3 className="font-semibold text-ink">{pyq.subject}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {pyq.course_code} · {pyq.semester} · {pyq.year}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Club picks</h2>
              <Link to="/app/clubs" className="text-sm font-semibold text-primary">
                All clubs
              </Link>
            </div>
            {clubsQ.loading ? (
              <Skeleton className="h-40" />
            ) : clubs.length === 0 ? (
              <EmptyState icon={Users} title="No clubs yet" />
            ) : (
              <div className="space-y-3">
                {clubs.map((club) => (
                  <Link key={club.id} to={`/app/clubs/${club.id}`}>
                    <Card padding className="!p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-ink">{club.name}</p>
                          <p className="text-xs text-muted">{club.category}</p>
                        </div>
                        <Badge>{club.category?.split('_')[0]}</Badge>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Placement updates</h2>
              <Link
                to="/app/placements"
                className="text-sm font-semibold text-primary"
              >
                Stories
              </Link>
            </div>
            {placementsQ.loading ? (
              <Skeleton className="h-40" />
            ) : placements.length === 0 ? (
              <EmptyState icon={Briefcase} title="No experiences yet" />
            ) : (
              <div className="space-y-3">
                {placements.map((item) => (
                  <Card key={item.id} className="!p-4">
                    <p className="font-semibold text-ink">{item.company}</p>
                    <p className="text-sm text-muted">
                      {item.role} · {item.job_type}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold">Activity feed</h2>
            {activity.length === 0 ? (
              <EmptyState title="No recent activity" />
            ) : (
              <Card hover={false} className="space-y-4">
                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted">{item.meta}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted">
                      {timeAgo(item.at)}
                    </span>
                  </div>
                ))}
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
