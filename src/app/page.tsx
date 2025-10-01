export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Little Bird</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Political Intelligence Platform for Colorado Lobbying
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✅ Next.js is running</p>
          <p>✅ TypeScript is working</p>
          <p>✅ Tailwind CSS is loaded</p>
          <p>✅ Vercel deployment is successful</p>
        </div>
        <div className="mt-8 space-x-4">
          <a href="/bills" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            View Bills
          </a>
          <a href="/legislators" className="inline-block px-4 py-2 border border-border rounded-md hover:bg-muted">
            View Legislators
          </a>
        </div>
      </div>
    </div>
  );
}
