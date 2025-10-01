import { Navigation } from './navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 min-h-screen overflow-x-auto">
        {children}
      </main>
    </div>
  );
}
