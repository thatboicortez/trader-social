'use client';

import { useEffect, useState } from 'react';

type Author = {
  username?: string;
};

type Post = {
  id: string;
  content: string;
  author?: Author;
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);

        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) throw new Error('NEXT_PUBLIC_API_URL is not set');

        const token =
          typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;

        const url = base.replace(/\/+$/, '') + '/posts';

        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const res = await fetch(url, {
          headers: Object.keys(headers).length ? headers : undefined,
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch posts (' + res.status + ')');
        }

        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading feed…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Feed</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 0, listStyle: 'none' }}>
          {posts.map((p) => (
            <li key={p.id} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                {p.author?.username ?? 'Unknown'}
              </div>
              <div>{p.content}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}