import {
  LayoutDashboard,
  Users,
  Building,
  FactoryIcon,
  Cog,
} from 'lucide-react';
import { Roles } from './rolesEnum';

export const RESEND_EMAIL_COOLDOWN = 60;
export const PAGINATION_LIMIT = 10;
export const DEBOUNCE_DELAY = 500;

export const navItems = [
  { name: 'Dashboard', path: '/super-admin', icon: LayoutDashboard },
  { name: 'Tenants', path: '/super-admin/tenants', icon: Building },
  { name: 'Users', path: '/super-admin/users', icon: Users },
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
  { name: 'Jobs', path: '/platform/jobs', icon: Cog, role: [Roles.MACHINIST] },
];
