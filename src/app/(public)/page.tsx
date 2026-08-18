'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThreeHero from '@/components/ThreeHero';
import styles from './home.module.css';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data)); // Show all products on homepage
  }, []);

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <section className={styles.heroSection}>
        <ThreeHero />
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>Discover something beautiful.</h1>
          <p className={styles.heroSubtitle}>Curated finds from brands and stores you love.</p>
          <button onClick={scrollToProducts} className={styles.exploreBtn}>EXPLORE</button>
        </div>
      </section>

      <section id="products-section" className={styles.productsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Featured Collection</h2>
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
                    <p className={styles.categoryLabel}>{product.category?.name || 'Uncategorized'}</p>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>₹{product.price}</p>
                    <p className={styles.merchantLabel}>{product.merchant}</p>
                    <span className={styles.ctaText}>VIEW PRODUCT →</span>
                  </div>
                </Link>
              </div>
            ))}
            {products.length === 0 && (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '4rem', color: 'var(--color-text-light)' }}>
                No products discovered yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
