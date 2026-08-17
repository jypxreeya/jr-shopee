'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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

    let imageString = '[]';
    
    // Upload images first if exist
    if (imageFiles.length > 0) {
      const uploadData = new FormData();
      imageFiles.forEach(f => uploadData.append('files', f));
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });
      if (uploadRes.ok) {
        const { urls, url } = await uploadRes.json();
        imageString = JSON.stringify(urls || [url]);
      } else {
        const err = await uploadRes.json().catch(() => ({}));
        alert(`Image upload failed: ${err.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }
    }

    const method = editProductId ? 'PATCH' : 'POST';
    const url = editProductId ? `/api/products/${editProductId}` : '/api/products';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, image: imageString }),
    });

    if (res.ok) {
      setShowAddForm(false);
      setEditProductId(null);
      setFormData({
        name: '', description: '', price: '', original_price: '', 
        discount: '', categoryId: '', merchant: '', affiliate_url: '', tags: ''
      });
      setImageFiles([]);
      fetchProducts();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || `Failed to ${editProductId ? 'update' : 'add'} product. Please check your inputs and try again.`);
    }
    setLoading(false);
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ? product.price.toString() : '',
      original_price: product.original_price ? product.original_price.toString() : '',
      discount: product.discount || '',
      categoryId: product.categoryId ? product.categoryId.toString() : '',
      merchant: product.merchant || '',
      affiliate_url: product.affiliate_url || '',
      tags: product.tags || '',
    });
    setEditProductId(product.id);
    setImageFiles([]);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchProducts();
    } else {
      alert('Failed to delete product.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Products</h1>
        <button className={styles.btnPrimary} onClick={() => {
          setShowAddForm(!showAddForm);
          if (!showAddForm) {
            setEditProductId(null);
            setFormData({ name: '', description: '', price: '', original_price: '', discount: '', categoryId: '', merchant: '', affiliate_url: '', tags: '' });
          }
        }}>
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h3>{editProductId ? 'Edit Product' : 'Add New Product'}</h3>
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
              <label>Product Images (Select multiple) *</label>
              <input type="file" accept="image/*" multiple onChange={e => e.target.files && setImageFiles(Array.from(e.target.files))} {...(!editProductId ? { required: true } : {})} />
              {imageFiles.length > 0 && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--color-primary-dark)' }}>{imageFiles.length} files selected.</p>}
              {editProductId && imageFiles.length === 0 && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#6b7280' }}>Leave empty to keep existing images.</p>}
            </div>
            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
            </div>
          </div>
          <button type="submit" className={styles.btnPrimary} disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Saving...' : editProductId ? 'Update Product' : 'Save Product'}
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
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>
                  {(() => {
                    let thumb = '';
                    try {
                      const parsed = JSON.parse(p.image);
                      thumb = Array.isArray(parsed) ? parsed[0] : p.image;
                    } catch {
                      thumb = p.image;
                    }
                    return thumb ? <img src={thumb} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> : null;
                  })()}
                </td>
                <td style={{ padding: '1rem' }}>{p.name}</td>
                <td style={{ padding: '1rem' }}>{p.price}</td>
                <td style={{ padding: '1rem' }}>{p.merchant}</td>
                <td style={{ padding: '1rem' }}>{p.category?.name}</td>
                <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleEdit(p)} style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
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
