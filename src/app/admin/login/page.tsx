'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mail, password }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Access Denied');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--color-background)' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '3rem', borderRadius: '8px', boxShadow: 'var(--shadow-soft)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Admin Login</h1>
        
        {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Mail</label>
          <input 
            type="email" 
            value={mail} 
            onChange={e => setMail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}
            required
          />
        </div>
        
        <button type="submit" style={{ width: '100%', background: 'var(--color-primary)', color: 'white', padding: '1rem', borderRadius: '4px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}
