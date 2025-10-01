export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#4f46e5', fontSize: '2rem', marginBottom: '1rem' }}>
        Little Bird
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
        Political Intelligence Platform for Colorado Lobbying
      </p>
      <div style={{ marginBottom: '2rem' }}>
        <p>✅ Next.js is running</p>
        <p>✅ TypeScript is working</p>
        <p>✅ Vercel deployment is successful</p>
      </div>
      <div>
        <a 
          href="/bills" 
          style={{ 
            display: 'inline-block', 
            padding: '10px 20px', 
            backgroundColor: '#4f46e5', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          View Bills
        </a>
        <a 
          href="/legislators" 
          style={{ 
            display: 'inline-block', 
            padding: '10px 20px', 
            border: '1px solid #ccc', 
            color: '#333', 
            textDecoration: 'none', 
            borderRadius: '5px'
          }}
        >
          View Legislators
        </a>
      </div>
    </div>
  );
}
