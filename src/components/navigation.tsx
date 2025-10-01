'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Activity,
  TrendingUp,
  Bell,
  User,
  Building,
  Shield,
  AlertTriangle,
  BarChart3,
  Database,
  Globe,
  Cog
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bills', href: '/bills', icon: FileText },
  { name: 'Legislators', href: '/legislators', icon: Users },
  { name: 'Clients', href: '/clients', icon: Building },
  { name: 'Contacts', href: '/contacts', icon: User },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
];

const toolsNavigation = [
  { name: 'Data Sync', href: '/dashboard/admin', icon: Database },
  { name: 'Sources', href: '/sources', icon: Globe },
  { name: 'Settings', href: '/settings', icon: Cog },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 min-h-screen bg-slate-800 text-white">
      <div className="p-6">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">LITTLEBIRD</h1>
        </div>
        
        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Tools Section */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            TOOLS
          </h3>
          <div className="space-y-1">
            {toolsNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Version */}
        <div className="absolute bottom-6 left-6">
          <p className="text-xs text-slate-400">Little Bird v1.0</p>
        </div>
      </div>
    </nav>
  );
}
