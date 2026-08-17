'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount: '',
    categoryId: '',
    merchant: '',
    affiliate_url: '',
    tags: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    if (res.ok) setProducts(await res.json());
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    if (res.ok) setCategories(await res.json());
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = '';
    
    // Upload image first if exists
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('file', imageFile);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      if (uploadRes.ok) {
        const { url } = await uploadRes.json();
        imageUrl = url;
      }
    }

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, image: imageUrl }),
    });

    if (res.ok) {
      setShowAddForm(false);
      setFormData({
        name: '', description: '', price: '', original_price: '', 
        discount: '', categoryId: '', merchant: '', affiliate_url: '', tags: ''
      });
      setImageFile(null);
      fetchProducts();
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Products</h1>
        <button className={styles.btnPrimary} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3>Add New Product</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className={styles.formGroup}>
              <label>Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Category *</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Price (₹) *</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Original Price (₹)</label>
              <input type="number" step="0.01" name="original_price" value={formData.original_price} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label>Merchant (e.g. Amazon, Myntra) *</label>
              <input type="text" name="merchant" value={formData.merchant} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Affiliate URL *</label>
              <input type="url" name="affiliate_url" value={formData.affiliate_url} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Product Image *</label>
              <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} required />
            </div>
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
            </div>
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      )}

      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Image</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Merchant</th>
              <th style={{ padding: '1rem' }}>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>
                  {p.image && <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />}
                </td>
                <td style={{ padding: '1rem' }}>{p.name}</td>
                <td style={{ padding: '1rem' }}>₹{p.price}</td>
                <td style={{ padding: '1rem' }}>{p.merchant}</td>
                <td style={{ padding: '1rem' }}>{p.category?.name}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
