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
} from 'lucide-react';
import { Roles } from './rolesEnum';

export const RESEND_EMAIL_COOLDOWN = 60;
export const PAGINATION_LIMIT = 10;
export const DEBOUNCE_DELAY = 500;

export const navItems = [
  { name: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
  { name: 'Tenants', path: '/super-admin/tenants', icon: Building },
  { name: 'Users', path: '/super-admin/users', icon: Users },
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
