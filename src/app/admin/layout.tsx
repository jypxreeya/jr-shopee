'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, LayoutDashboard, ShoppingBag, Tags } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>JR SHOPEE ADMIN</div>
        <nav className={styles.nav}>
          <Link href="/admin" className={pathname === '/admin' ? styles.active : ''}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/products" className={pathname.includes('/products') ? styles.active : ''}>
            <ShoppingBag size={20} /> Products
          </Link>
          <Link href="/admin/categories" className={pathname.includes('/categories') ? styles.active : ''}>
            <Tags size={20} /> Categories
          </Link>
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} /> Logout
        </button>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
