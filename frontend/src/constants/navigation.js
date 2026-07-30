import {
  BookOpen,
  Briefcase,
  CalendarDays,
  FileText,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  UserCog,
  UserRound,
  Users,
} from 'lucide-react';

export const APP_NAV = [
  { to: '/app/dashboard', label: 'Home', icon: Home },
  { to: '/app/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/app/events', label: 'Events', icon: CalendarDays },
  { to: '/app/clubs', label: 'Clubs', icon: Users },
  { to: '/app/placements', label: 'Placements', icon: Briefcase },
  { to: '/app/pyqs', label: 'PYQs', icon: BookOpen },
  { to: '/app/lost-found', label: 'Lost & Found', icon: Search },
  { to: '/app/resume', label: 'Resume', icon: FileText },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export const ADMIN_NAV = [
  { to: '/app/admin', label: 'Admin home', icon: LayoutDashboard, end: true },
  { to: '/app/admin/users', label: 'Manage users', icon: UserCog },
  { to: '/app/admin/clubs', label: 'Manage clubs', icon: Shield },
];

export const LANDING_NAV = [
  { href: '#features', label: 'Features' },
  { href: '#campus', label: 'About' },
  { href: '#marketplace', label: 'Marketplace' },
  { href: '#placements', label: 'Placements' },
  { href: '#resume', label: 'Resume' },
  { href: '#faq', label: 'FAQ' },
];

export const MARKETPLACE_CATEGORIES = [
  'BOOKS',
  'ELECTRONICS',
  'FURNITURE',
  'STATIONERY',
  'CLOTHING',
  'SPORTS',
  'OTHERS',
];

export const BRANCHES = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'CHE'];
export const SEMESTERS = [
  'SEM1',
  'SEM2',
  'SEM3',
  'SEM4',
  'SEM5',
  'SEM6',
  'SEM7',
  'SEM8',
];
export const YEARS = [1, 2, 3, 4];

export const SKILL_CATEGORIES = [
  'PROGRAMMING_LANGUAGE',
  'FRAMEWORK',
  'DATABASE',
  'TOOL',
  'CLOUD',
  'OTHER',
];

export const MEMBERSHIP_ROLES = [
  'MEMBER',
  'PRESIDENT',
  'VICE_PRESIDENT',
  'SECRETARY',
  'TREASURER',
  'COORDINATOR',
];

export const RECRUITMENT_STATUSES = ['DRAFT', 'OPEN', 'CLOSED'];

export const EVENT_STATUSES = ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'];

export const CLUB_CATEGORIES = [
  'TECHNICAL',
  'CULTURAL',
  'SPORTS',
  'LITERARY',
  'SOCIAL_SERVICE',
  'ENTREPRENEURSHIP',
];
