'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const ROUTE_ROLES: Record<string, string[]> = {
  '/packages': ['admin'],
  '/staff-management': ['admin'],
  '/hr': ['admin'],
  '/branches': ['admin'],
  '/settings': ['admin'],
  '/alerts-configuration': ['admin'],
  '/team-performance': ['admin', 'branch_manager'],
  '/reports': ['admin', 'branch_manager'],
  '/audit-log': ['admin', 'branch_manager'],
  '/leads': ['admin', 'sales_staff'],
  '/messages': ['admin', 'sales_staff'],
};

function requiredRoles(path: string) {
  const match = Object.keys(ROUTE_ROLES).find(
    (route) => path === route || path.startsWith(route + '/')
  );
  return match ? ROUTE_ROLES[match] : null;
}

export default function RoleGuard({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const { loading, user, role } = useAuth();
  const router = useRouter();
  const roles = requiredRoles(path);

  useEffect(() => {
    if (loading || !user || !roles) return;
    if (!roles.includes(role)) {
      router.replace('/');
    }
  }, [loading, user, role, roles, router]);

  if (loading || !user) return null;
  if (roles && !roles.includes(role)) return null;

  return <>{children}</>;
}
