'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import styles from './public.module.css';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={`container ${styles.navContainer}`}>
          <Link href="/" className={styles.logo}>JR SHOPEE</Link>
          <div className={styles.navLinks}>
            <Link href="/categories">Categories</Link>
            <button className={styles.searchBtn} aria-label="Search">
              <Search size={20} />
            </button>
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <p>© {new Date().getFullYear()} JR SHOPEE. Discover beautiful things.</p>
          <div className={styles.footerLinks}>
            <Link href="/disclosure">Affiliate Disclosure</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
