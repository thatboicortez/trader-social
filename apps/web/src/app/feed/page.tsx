'use client';

import { useEffect, useState } from 'react';

type Post = {
  id: string;
  title?: string | null;
  content?: string | null;
  createdAt?: string;
  authorId?: string | null;
};

export default function FeedPage() {
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const base = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      setToken(window.localStorage.getItem('token'));
    } catch {
      setToken(null);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!base) {
        setErr('NEXT_PUBLIC_API_URL is not set');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErr(null);

      try {
        const res = await fetch(`${base}/posts`, {
          headers: token ? { Authorization: Bearer ${token} } : {},
          cache: 'no-store',
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} ${res.statusText}${text ? : ${text} : ''}`);
        }

        const data = (await res.json().catch(() => null)) as any;

        // поддержим разные форматы ответа
        const items: Post[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setPosts(items);
      } catch (e: any) {
        setErr(e?.message ?? 'Failed to load feed');
      } finally {
        setLoading(false);
      }
    };

    // не делаем запрос до того, как определили token (иначе SSR/CSR гонки)
    run();
  }, [base, token]);

  return (
    <main style={{ maxWidth: 840, margin: '0 auto', padding: '32px 16px' }}>
      <header style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Feed</h1>
        <span style={{ opacity: 0.7, fontSize: 14 }}>
          {token ? 'authorized' : 'no token (public)'}
        </span>
      </header>

      {loading && <p style={{ opacity: 0.75 }}>Loading…</p>}

      {!loading && err && (
        <div
          style={{
            border: '1px solid rgba(255,0,0,0.35)',
            background: 'rgba(255,0,0,0.06)',
            padding: 12,
            borderRadius: 10,
            marginBottom: 16,
          }}
        >
          <b style={{ display: 'block', marginBottom: 6 }}>Error</b>
          <div style={{ whiteSpace: 'pre-wrap' }}>{err}</div>
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
            Check env var <code>NEXT_PUBLIC_API_URL</code> in Koyeb and that your API has a{' '}
            <code>GET /posts</code> endpoint.
          </div>
        </div>
      )}

      {!loading && !err && posts.length === 0 && <p style={{ opacity: 0.75 }}>No posts yet.</p>}

      <section style={{ display: 'grid', gap: 12 }}>
        {posts.map((p) => (
          <article
            key={p.id}
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 650 }}>
                {p.title ?? `Post ${p.id.slice(0, 8)}`}
              </h3>
              {p.createdAt && (
                <time style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(p.createdAt).toLocaleString()}
                </time>
              )}
            </div>

            {p.content && (
              <p style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>
                {p.content}
              </p>
            )}

            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
              id: <code>{p.id}</code>
              {p.authorId ? (
                <>
                  {' '}
                  • author: <code>{p.authorId}</code>
                </>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}