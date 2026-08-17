'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  // Basic client-side check just to avoid flash if possible, 
  // though middleware is better. Since we don't have middleware yet, we'll check via an API or just show content.
  
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: 'var(--color-text-light)' }}>Total Products</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>-</p>
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: 'var(--color-text-light)' }}>Total Categories</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>-</p>
        </div>
      </div>
    </div>
  );
}
