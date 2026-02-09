"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  author?: { username: string };
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setErr(null);

        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

        let token: string | null = null;
        if (typeof window !== "undefined") {
          token = localStorage.getItem("token");
        }

        const res = await fetch(`${base}/posts`, {
          headers: token ? { Authorization: Bearer ${token} } : {},
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load feed");

        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setErr(e?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;
  if (err) return <div style={{ padding: 20, color: "red" }}>Error: {err}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Feed</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul style={{ display: "flex", flexDirection: "column", gap: 12, padding: 0, listStyle: "none" }}>
          {posts.map((p) => (
            <li key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                {p.author?.username ?? "Unknown"}
              </div>
              <div>{p.content}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}