import {
  LayoutDashboard,
  Users,
  Building,
  FactoryIcon,
  Cog,
  CreditCard,
  Package,
  Component,
  Briefcase,
  Ticket,
  CalendarClock,
  ClipboardList,
  FileCode,
  Coins,
} from 'lucide-react';
import { Roles } from './rolesEnum';

export const RESEND_EMAIL_COOLDOWN = 60;
export const PAGINATION_LIMIT = 10;
export const DEBOUNCE_DELAY = 500;

export const navItems = [
  { name: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
  { name: 'Tenants', path: '/super-admin/tenants', icon: Building },
  { name: 'Users', path: '/super-admin/users', icon: Users },
  { name: 'Revenue', path: '/super-admin/revenue', icon: Coins },
  { name: 'Plans', path: '/super-admin/plans', icon: CreditCard },
];

export const UserNavItems = [
  {
    name: 'Dashboard',
    path: '/platform',
    icon: LayoutDashboard,
    role: [Roles.ADMIN, Roles.MACHINIST, Roles.MAINTENANCE],
  },
  {
    name: 'Employees',
    path: '/platform/employees',
    icon: Users,
    role: [Roles.ADMIN],
  },
  {
    name: 'Machines',
    path: '/platform/machines',
    icon: FactoryIcon,
    role: [Roles.ADMIN],
  },
  {
    name: 'Fixtures',
    path: '/platform/fixtures',
    icon: Cog,
    role: [Roles.ADMIN],
  },
  {
    name: 'Raw Materials',
    path: '/platform/raw-materials',
    icon: Package,
    role: [Roles.ADMIN],
  },
  {
    name: 'NC Programs',
    path: '/platform/nc-programs',
    icon: FileCode,
    role: [Roles.ADMIN],
  },
  {
    name: 'Parts',
    path: '/platform/parts',
    icon: Component,
    role: [Roles.ADMIN],
  },
  {
    name: 'Jobs',
    path: '/platform/jobs',
    icon: Briefcase,
    role: [Roles.ADMIN],
  },
  {
    name: 'Shift Structures',
    path: '/platform/shift-templates',
    icon: CalendarClock,
    role: [Roles.ADMIN],
  },
  {
    name: 'Daily Shifts',
    path: '/platform/shifts',
    icon: ClipboardList,
    role: [Roles.ADMIN, Roles.MACHINIST],
  },
  {
    name: 'Tickets',
    path: '/platform/tickets',
    icon: Ticket,
    role: [Roles.MAINTENANCE],
  },
];

export const DocumentationNavLinks = [
  { href: '#overview', label: 'Overview' },
  { href: '#problem', label: 'Problem' },
  { href: '#demo', label: 'Demo' },
  // { href: '#tech-stack', label: 'Tech Stack' },
  // { href: '#architecture', label: 'Architecture' },
  { href: '#features', label: 'Features' },
];

export const flowSteps = ['Inquiry', 'Work Order', 'Production', 'Delivery'];

export const Features = [
  {
    icon: '📊',
    title: 'Interactive Dashboard',
    desc: 'A daily overview of operations, production activity, and current work status at a glance.',
  },
  {
    icon: '👥',
    title: 'Customer Management',
    desc: 'Organized records — contacts, job history, and ongoing projects.',
  },
  {
    icon: '📋',
    title: 'Work Order Management',
    desc: 'Track orders from initiation to completion in one place.',
  },
  {
    icon: '🏭',
    title: 'Production Tracking',
    desc: 'Full visibility into every stage of the machining lifecycle.',
  },
  {
    icon: '🧑‍🔧',
    title: 'Employee Management',
    desc: 'Role-based access, tuned to each person\u2019s responsibilities.',
  },
  {
    icon: '🗄️',
    title: 'Centralized Records',
    desc: 'One secure system, no more scattered paperwork.',
  },
];

export const YOUTUBE_VIDEO_ID = 'KtBefDeECVU';
