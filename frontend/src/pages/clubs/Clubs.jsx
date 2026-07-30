import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import SearchBar from '../../components/ui/SearchBar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { CLUB_CATEGORIES } from '../../constants/navigation';
import { CLUB_CATEGORY_COLORS } from '../../constants/colors';
import { useFetch } from '../../hooks/useFetch';
import { getClubRecruitments, getClubs } from '../../services/clubService';
import { labelize } from '../../utils/format';
import { cn } from '../../utils/cn';

export default function Clubs() {
  const { data, loading, error, reload } = useFetch(getClubs, []);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [openInductions, setOpenInductions] = useState({});

  const clubs = useMemo(() => {
    let list = Array.isArray(data) ? data : [];
    if (category !== 'ALL') list = list.filter((c) => c.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, category, query]);

  useEffect(() => {
    if (!clubs.length) {
      setOpenInductions({});
      return;
    }

    let active = true;
    (async () => {
      const entries = await Promise.all(
        clubs.map(async (club) => {
          try {
            const drives = await getClubRecruitments(club.id);
            const open = (Array.isArray(drives) ? drives : []).filter(
              (d) => d.status === 'OPEN'
            ).length;
            return [club.id, open];
          } catch {
            return [club.id, 0];
          }
        })
      );
      if (active) setOpenInductions(Object.fromEntries(entries));
    })();

    return () => {
      active = false;
    };
  }, [clubs]);

  return (
    <div className="mx-auto max-w-wide">
      <PageHeader
        eyebrow="Clubs"
        title="Find your circle"
        description="Open a club page to see inductions, events, and members."
      />

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search clubs…"
        className="mb-4 max-w-xl"
      />

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {['ALL', ...CLUB_CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold',
              category === cat
                ? 'bg-primary text-white'
                : 'border border-line bg-white text-muted'
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
      {!loading && !error && clubs.length === 0 && (
        <EmptyState icon={Users} title="No clubs found" />
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {clubs.map((club) => {
            const tone =
              CLUB_CATEGORY_COLORS[club.category] ||
              CLUB_CATEGORY_COLORS.TECHNICAL;
            const openCount = openInductions[club.id] || 0;
            return (
              <Card key={club.id} className="flex flex-col">
                <div
                  className="mb-4 flex h-28 items-end justify-between rounded-2xl p-4"
                  style={{ background: tone.bg }}
                >
                  <Badge className="!bg-white" style={{ color: tone.text }}>
                    {labelize(club.category)}
                  </Badge>
                  {openCount > 0 && (
                    <Badge tone="success" className="!bg-white">
                      {openCount} open induction{openCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold text-ink">
                  {club.name}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
                  {club.description}
                </p>
                <Link to={`/app/clubs/${club.id}`} className="mt-4">
                  <Button variant="secondary" className="w-full">
                    View club
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
