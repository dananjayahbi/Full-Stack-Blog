'use client';

export default function TestPage() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      color: 'black',
      textAlign: 'center',
      margin: '50px auto',
      maxWidth: '500px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h1>Test Page</h1>
      <p>If you can see this, the basic rendering is working!</p>
    </div>
  );
}