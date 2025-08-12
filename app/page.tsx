'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    if (!email) {
      alert('Please enter an email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to test API' });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '600px' }}>
      <h1>Email Validation API Tester</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to test (e.g., test@gmail.com)"
          style={{ 
            padding: '12px', 
            width: '300px', 
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={testAPI}
          disabled={loading}
          style={{ 
            padding: '12px 20px', 
            background: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            marginLeft: '10px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Email'}
        </button>
      </div>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '4px'
        }}>
          <h3>Result:</h3>
          <pre style={{ 
            background: '#fff', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>Your API Endpoint:</h3>
        <code style={{ background: '#f1f1f1', padding: '5px' }}>
          POST /api/validate
        </code>
        <br/><br/>
        <strong>Request Body:</strong>
        <pre style={{ background: '#f1f1f1', padding: '10px', fontSize: '12px' }}>
{`{
  "email": "user@example.com"
}`}
        </pre>
      </div>
    </div>
  );
}
