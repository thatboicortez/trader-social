"use client";

import { api } from "@/lib/api";
import { isAuthed } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

type Post = {
  id?: string | number;
  content?: string;
  text?: string;
  createdAt?: string;
  author?: { email?: string; name?: string };
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const data = await api<Post[]>("/posts", { method: "GET" });
        setPosts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setErr(e.message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!isAuthed()) {
    return (
      <div>
        <h2>Feed</h2>
        <p>You are not logged in.</p>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Feed</h2>

      {loading && <div>Loading...</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {posts.map((p, i) => (
          <article
            key={String(p.id ?? i)}
            style={{ border: "1px solid #222", borderRadius: 10, padding: 12 }}
          >
            <div style={{ opacity: 0.7, fontSize: 12 }}>
              {p.author?.name || p.author?.email || "unknown"} •{" "}
              {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
            </div>
            <div style={{ marginTop: 8, fontSize: 16 }}>
              {p.content || p.text || JSON.stringify(p)}
            </div>
          </article>
        ))}
        {!loading && !err && posts.length === 0 && (
          <div style={{ opacity: 0.7 }}>No posts yet.</div>
        )}
      </div>
    </div>
  );
}