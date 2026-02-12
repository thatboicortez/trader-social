"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

type Me = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  isEmailVerified: boolean;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/auth");
      return;
    }

    (async () => {
      try {
        const data = await apiFetch<Me>("/auth/me", { method: "GET" });
        setMe(data);
      } catch (e: any) {
        setErr(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  function onLogout() {
    clearToken();
    router.replace("/auth");
  }

  if (loading) return <main style={{ padding: 16 }}>Loading...</main>;
  if (err) return <main style={{ padding: 16, color: "crimson" }}>{err}</main>;
  if (!me) return null;

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 12px" }}>Profile</h2>

      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <div><b>Username:</b> @{me.username}</div>
        <div><b>Email:</b> {me.email}</div>
        <div><b>Verified:</b> {me.isEmailVerified ? "yes" : "no"}</div>
      </div>

      <button onClick={onLogout} style={{ padding: "10px 14px" }}>
        Logout
      </button>
    </main>
  );
}