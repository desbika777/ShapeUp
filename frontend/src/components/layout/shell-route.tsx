import { Outlet } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';

export function ShellRoute() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
