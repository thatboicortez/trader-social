"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isAuthed, logout } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthed());
  }, [pathname]);

  return (
    <header style={{ padding: 16, borderBottom: "1px solid #222" }}>
      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link href="/">Home</Link>
        <Link href="/feed">Feed</Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {!authed ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                setAuthed(false);
                router.push("/login");
              }}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}