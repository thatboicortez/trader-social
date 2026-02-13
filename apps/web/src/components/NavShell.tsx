"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import styles from "./navShell.module.css";
import { clearToken } from "@/lib/auth";

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // На странице логина/регистрации нав вообще не нужен
  if (pathname?.startsWith("/auth")) {
    return <>{children}</>;
  }

  const isActive = (path: string) => (pathname === path ? styles.active : "");

  function onLogout() {
    clearToken();
    router.replace("/auth");
  }

  return (
    <div className={styles.shell}>
      {/* DESKTOP SIDEBAR (виден только на >=980px по CSS) */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}></div>

        <nav className={styles.menu}>
          <Link className={`${styles.navItem} ${isActive("/feed")}`} href="/feed">
            <span className={styles.dot} />
            Home
          </Link>

          <Link
            className={`${styles.navItem} ${isActive("/search")}`}
            href="/search"
          >
            <span className={styles.dot} />
            Search
          </Link>

          <Link className={`${styles.navItem} ${isActive("/dm")}`} href="/dm">
            <span className={styles.dot} />
            DM
          </Link>

          <Link
            className={`${styles.navItem} ${isActive("/profile")}`}
            href="/profile"
          >
            <span className={styles.dot} />
            Profile
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          {/* Create channel на ПК — в сайдбаре */}
          <button className={styles.primary} type="button" disabled>
            Create channel
          </button>

          <button className={styles.logout} type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className={styles.main}>{children}</main>

      {/* MOBILE BOTTOM NAV (виден только <980px по CSS) */}
      <nav className={styles.bottomNav}>
        <Link
          className={`${styles.bottomItem} ${
            pathname === "/feed" ? styles.activeB : ""
          }`}
          href="/feed"
        >
          Home
        </Link>

        <Link
          className={`${styles.bottomItem} ${
            pathname === "/search" ? styles.activeB : ""
          }`}
          href="/search"
        >
          Search
        </Link>

        <Link
          className={`${styles.bottomItem} ${
            pathname === "/dm" ? styles.activeB : ""
          }`}
          href="/dm"
        >
          DM
        </Link>

        <Link
          className={`${styles.bottomItem} ${
            pathname === "/profile" ? styles.activeB : ""
          }`}
          href="/profile"
        >
          Profile
        </Link>
      </nav>
    </div>
  );
}