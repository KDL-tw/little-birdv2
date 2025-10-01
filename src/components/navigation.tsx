'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Activity,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bills', href: '/bills', icon: FileText },
  { name: 'Legislators', href: '/legislators', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Admin', href: '/dashboard/admin', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="gov-sidebar w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-sidebar-foreground">Little Bird</h2>
        <p className="text-sm text-sidebar-foreground/70">Political Intelligence</p>
      </div>
      
      <ul className="space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'gov-nav-item w-full justify-start',
                    isActive && 'gov-nav-item active'
                  )}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Button>
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-8 pt-8 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
          <Activity className="h-4 w-4" />
          <span>System Status</span>
        </div>
        <p className="text-xs text-sidebar-foreground/50 mt-1">
          Ready for data sync
        </p>
      </div>
    </nav>
  );
}
