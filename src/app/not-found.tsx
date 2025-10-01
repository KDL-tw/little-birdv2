import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="gov-card max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold text-primary mb-4">404</CardTitle>
            <CardDescription className="text-lg">
              Page Not Found
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild className="gov-button-primary">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="gov-button-secondary">
                <Link href="/bills">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  View Bills
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
