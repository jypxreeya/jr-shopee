'use client';

import { useState } from 'react';
import styles from '@/app/(public)/product/[slug]/product.module.css';

export default function ImageGallery({ images, alt }: { images: string[], alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.imageWrapper}>
        <div className={styles.placeholder}>No Image</div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.imageWrapper} style={{ marginBottom: '1rem' }}>
        <img src={images[currentIndex]} alt={alt} className={styles.mainImage} />
      </div>
      
      {images.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem' }}>
          {images.map((img, index) => (
            <div 
              key={index} 
              onClick={() => setCurrentIndex(index)}
              style={{ 
                cursor: 'pointer', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                aspectRatio: '1',
                border: currentIndex === index ? '2px solid var(--color-primary)' : '2px solid transparent',
                opacity: currentIndex === index ? 1 : 0.6,
                transition: 'all 0.3s ease'
              }}
            >
              <img src={img} alt={`${alt} thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
