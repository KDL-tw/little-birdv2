'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Building2,
  UserCheck,
  Shield,
  TrendingUp, 
  Bell,
  Database,
  Settings,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bills', href: '/bills', icon: FileText },
  { name: 'Legislators', href: '/legislators', icon: Users },
  { name: 'Clients', href: '/clients', icon: Building2 },
  { name: 'Contacts', href: '/contacts', icon: UserCheck },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

const tools = [
  { name: 'Data Sync', href: '/dashboard/admin', icon: Database },
  { name: 'Sources', href: '/sources', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-slate-800 text-white h-full flex flex-col">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LB</span>
            </div>
            <span className="text-white font-bold text-lg">
              LITTLEBIRD
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-300 hover:text-white hover:bg-slate-700"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Tools Section */}
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              TOOLS
            </h3>
            <ul className="space-y-1">
              {tools.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-300 hover:text-white hover:bg-slate-700"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700">
          <div className="text-slate-400 text-xs">
            Little Bird v1.0
          </div>
        </div>
      </div>
    </nav>
  );
}
