export default function HealthCheck() {
  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ color: 'green' }}>System Health Check</h1>
      <p>If you can see this message, basic page rendering is working correctly.</p>
      <div style={{ 
        marginTop: '20px', 
        padding: '15px',
        background: '#e6f7ff',
        border: '1px solid #91d5ff',
        borderRadius: '4px' 
      }}>
        <strong>Status:</strong> OK
      </div>
    </div>
  );
}