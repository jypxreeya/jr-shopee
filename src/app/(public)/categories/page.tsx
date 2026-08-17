'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from '../home.module.css';

function CategoriesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCat, setSelectedCat] = useState('');

  const fetchProducts = async () => {
    let url = '/api/products?';
    if (search) url += `search=${search}&`;
    if (selectedCat) url += `category=${selectedCat}&`;
    
    const res = await fetch(url);
    if (res.ok) setProducts(await res.json());
  };

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCat]);

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '4rem' }} className="container">
      <h1 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '2rem' }}>
        Discover
      </h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search products, brands, or merchants..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: '1', minWidth: '250px', padding: '1rem', borderRadius: '50px', border: '1px solid var(--color-border)', outline: 'none' }}
        />
        <select 
          value={selectedCat} 
          onChange={e => setSelectedCat(e.target.value)}
          style={{ padding: '1rem', borderRadius: '50px', border: '1px solid var(--color-border)', outline: 'none', background: 'white' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className={styles.productGrid}>
        {products.map(product => (
          <div key={product.id} className={styles.productCard}>
            <Link href={`/product/${product.slug}`} className={styles.productLink}>
              <div className={styles.imageContainer}>
                {(() => {
                  let thumb = '';
                  try {
                    const parsed = JSON.parse(product.image);
                    thumb = Array.isArray(parsed) ? parsed[0] : product.image;
                  } catch {
                    thumb = product.image;
                  }
                  return thumb ? (
                    <img src={thumb} alt={product.name} className={styles.productImage} />
                  ) : (
                    <div className={styles.placeholderImage}>No Image</div>
                  );
                })()}
              </div>
              <div className={styles.productInfo}>
                <p className={styles.categoryLabel}>{product.category?.name}</p>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productPrice}>₹{product.price}</p>
                <p className={styles.merchantLabel}>{product.merchant}</p>
                <span className={styles.ctaText}>VIEW PRODUCT →</span>
              </div>
            </Link>
          </div>
        ))}
        {products.length === 0 && (
          <p style={{ gridColumn: '1 / -1', padding: '4rem', color: 'var(--color-text-light)', textAlign: 'center' }}>
            No products match your search.
          </p>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: '8rem', textAlign: 'center' }}>Loading...</div>}>
      <CategoriesContent />
    </Suspense>
  );
}
