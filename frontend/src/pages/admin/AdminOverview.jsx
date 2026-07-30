import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  UserCog,
  Users,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useFetch } from '../../hooks/useFetch';
import { getAdminUsers } from '../../services/adminService';
import { getClubs } from '../../services/clubService';

const tools = [
  {
    to: '/app/admin/users',
    title: 'Manage users',
    description: 'View every account and promote or demote roles.',
    icon: UserCog,
  },
  {
    to: '/app/admin/clubs',
    title: 'Manage clubs',
    description: 'Create, edit, or remove campus clubs.',
    icon: Users,
  },
];

export default function AdminOverview() {
  const { user } = useAuth();
  const usersQ = useFetch(getAdminUsers, []);
  const clubsQ = useFetch(getClubs, []);

  const users = Array.isArray(usersQ.data) ? usersQ.data : [];
  const clubs = Array.isArray(clubsQ.data) ? clubsQ.data : [];
  const admins = users.filter((u) => u.role === 'admin').length;
  const students = users.filter((u) => u.role === 'student').length;

  return (
    <div className="mx-auto max-w-wide space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Control center"
        description={`Signed in as ${user?.full_name}. Manage users and campus clubs.`}
        actions={<Badge tone="accent">Admin access</Badge>}
      />

      {(usersQ.error || clubsQ.error) && (
        <ErrorState message={usersQ.error || clubsQ.error} />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total users', value: users.length, loading: usersQ.loading },
          { label: 'Students', value: students, loading: usersQ.loading },
          { label: 'Admins', value: admins, loading: usersQ.loading },
        ].map((stat) => (
          <Card key={stat.label} hover={false} className="!p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {stat.label}
            </p>
            {stat.loading ? (
              <Skeleton className="mt-3 h-9 w-16" />
            ) : (
              <p className="mt-2 font-display text-3xl font-bold text-ink">
                {stat.value}
              </p>
            )}
          </Card>
        ))}
      </div>

      <Card hover={false} surface="primary">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Shield className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-bold">
                {clubsQ.loading ? '…' : clubs.length} clubs on platform
              </p>
              <p className="mt-1 text-sm text-white/80">
                Create new societies or clean up inactive ones from the clubs
                console.
              </p>
            </div>
          </div>
          <Link to="/app/admin/clubs">
            <Button variant="secondary" size="sm">
              Open clubs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={tool.to}>
              <Card className="h-full">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <tool.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">
                  {tool.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{tool.description}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Open
                  <ArrowRight className="h-4 w-4" />
                </p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
