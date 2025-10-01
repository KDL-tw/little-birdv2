'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  BarChart3,
  ChevronLeft,
  ChevronRight
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={cn(
      "bg-indigo-950/95 backdrop-blur-md text-white h-screen flex flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-indigo-900/50">
          <div className="flex items-center space-x-3">
            {!isCollapsed && (
              <span className="font-bold text-lg whitespace-nowrap">
                <span className="text-gray-400">LITTLE</span>
                <span className="text-white">BIRD</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-indigo-900/50 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-2 py-6">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-indigo-600/80 text-white shadow-sm"
                        : "text-indigo-200 hover:text-white hover:bg-indigo-900/50"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 whitespace-nowrap">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Tools Section */}
          <div className="mt-8">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-3">
                TOOLS
              </h3>
            )}
            <ul className="space-y-1">
              {tools.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-indigo-600/80 text-white shadow-sm"
                          : "text-indigo-200 hover:text-white hover:bg-indigo-900/50"
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3 whitespace-nowrap">{item.name}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-indigo-900/50">
          {!isCollapsed && (
            <div className="text-indigo-300 text-xs">
              LITTLEBIRD v1.0
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
