"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    router.replace(token ? "/feed" : "/login");
  }, [router]);

  // можно показать лоадер, чтобы не мигало
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ opacity: 0.7 }}>Loading…</div>
    </main>
  );
}