'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

function Item({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link className={`${styles.item} ${active ? styles.active : ''}`} href={href}>
      {label}
    </Link>
  );
}

export function BottomNav() {
  return (
    <div className={styles.wrap}>
      <nav className={styles.nav}>
        <Item href="/search" label="Search" />
        <Item href="/dm" label="DM" />
        <Item href="/profile" label="Profile" />
      </nav>
    </div>
  );
}