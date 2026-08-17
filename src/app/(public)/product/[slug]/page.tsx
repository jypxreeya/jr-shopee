import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import styles from './product.module.css';

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  // Await params here as per Next.js 15
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className={`container ${styles.productPage}`}>
      <div className={styles.productLayout}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            {product.image ? (
              <img src={product.image} alt={product.name} className={styles.mainImage} />
            ) : (
              <div className={styles.placeholder}>No Image</div>
            )}
          </div>
        </div>
        
        <div className={styles.infoColumn}>
          <p className={styles.category}>{product.category?.name}</p>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.priceContainer}>
            <span className={styles.price}>₹{product.price}</span>
            {product.original_price && (
              <span className={styles.originalPrice}>₹{product.original_price}</span>
            )}
            {product.discount && (
              <span className={styles.discount}>{product.discount} OFF</span>
            )}
          </div>
          
          <div className={styles.description}>
            <p>{product.description || 'No description available for this beautiful piece.'}</p>
          </div>
          
          <div className={styles.merchantInfo}>
            <p>Available on <strong>{product.merchant}</strong></p>
          </div>

          <a 
            href={product.affiliate_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.ctaButton}
          >
            VIEW PRODUCT →
          </a>
          
          <p className={styles.affiliateNote}>
            Clicking this button will securely redirect you to the {product.merchant} website to view and purchase this item.
          </p>
        </div>
      </div>
    </div>
  );
}
