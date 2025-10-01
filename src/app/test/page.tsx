export default function TestPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Little Bird Test Page</h1>
        <p className="text-lg text-muted-foreground mb-8">
          If you can see this, the deployment is working!
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✅ Next.js is running</p>
          <p>✅ TypeScript is working</p>
          <p>✅ Tailwind CSS is loaded</p>
          <p>✅ Vercel deployment is successful</p>
        </div>
      </div>
    </div>
  );
}
