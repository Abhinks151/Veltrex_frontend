import { LayoutDashboard, Users, Building } from "lucide-react";


export const RESEND_EMAIL_COOLDOWN = 60;
export const PAGINATION_LIMIT = 10;
export const DEBOUNCE_DELAY = 500;


export const navItems = [
  { name: "Dashboard", path: "/super-admin", icon: LayoutDashboard },
  { name: "Tenants", path: "/super-admin/tenants", icon: Building },
  { name: "Users", path: "/super-admin/users", icon: Users },
];

export const UserNavItems = [
  { name: "Dashboard", path: "/platform", icon: LayoutDashboard },
  { name: "Employees", path: "/platform/employees", icon: Users },
];