"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken(); // localStorage
    router.replace(token ? "/feed" : "/auth");
  }, [router]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
        Loading…
      </div>
    </main>
  );
}