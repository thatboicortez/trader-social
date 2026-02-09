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
    const loadPosts = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) {
          throw new Error('NEXT_PUBLIC_API_URL is not set');
        }

        let token: string | null = null;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem('token');
        }

        const res = await fetch(`${base}/posts`, {
          headers: token
            ? { Authorization: Bearer ${token} }
            : undefined,
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch posts (${res.status})`);
        }

        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return <p>Loading feed…</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>Feed</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {posts.map((p) => (
            <li
              key={p.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
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