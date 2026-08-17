'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    if (res.ok) {
      setCategories(await res.json());
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      setName('');
      fetchCategories();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Failed to add category. Please try again.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? This will fail if there are products using it.')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchCategories();
    } else {
      alert('Failed to delete. Make sure no products are using this category.');
    }
  };

  const handleEdit = async (id: number, currentName: string) => {
    const newName = prompt('Enter new category name:', currentName);
    if (!newName || newName === currentName) return;

    const res = await fetch(`/api/categories/${id}`, { 
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });
    
    if (res.ok) {
      fetchCategories();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Failed to update category.');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Categories</h1>
      
      <form onSubmit={handleCreate} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3>Add New Category</h3>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Category Name" 
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}
            required
          />
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>

      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Products Count</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>{cat.name}</td>
                <td style={{ padding: '1rem' }}>{cat._count?.products || 0}</td>
                <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleEdit(cat.id, cat.name)} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
