"use client";

import { useEffect, useState } from "react";

type Post = {
  id?: string;
  content?: string;
  text?: string;
  createdAt?: string;
  author?: { name?: string; email?: string };
};

export default function FeedPage() {
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // ✅ localStorage только на клиенте
    const t = window.localStorage.getItem("token");
    setToken(t);

    const run = async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
          headers: t ? { Authorization: Bearer ${t} } : {},
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setPosts(Array.isArray(data) ? data : data?.items ?? []);
      } catch (e: any) {
        setErr(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Feed</h1>

      {!token && (
        <div style={{ marginTop: 12, opacity: 0.8 }}>
          No token found. Please login first.
        </div>
      )}

      {loading && <div style={{ marginTop: 12 }}>Loading...</div>}
      {err && (
        <div style={{ marginTop: 12, color: "crimson" }}>Error: {err}</div>
      )}

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {posts.map((p, idx) => (
          <article
            key={p.id ?? idx}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ opacity: 0.7, fontSize: 12 }}>
              {(p.author?.name  p.author?.email  "unknown") + " · "}
              {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
            </div>

            <div style={{ marginTop: 8, fontSize: 16 }}>
              {p.content  p.text  JSON.stringify(p)}
            </div>
          </article>
        ))}

        {!loading && !err && posts.length === 0 && (
          <div style={{ opacity: 0.7 }}>No posts yet.</div>
        )}
      </div>
    </main>
  );
}