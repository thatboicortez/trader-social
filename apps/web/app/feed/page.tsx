import { FeedTabs } from '@/components/FeedTabs';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types/post';

async function getFeed(): Promise<Post[]> {
  const res = await fetch('http://localhost:3001/posts', {
    // если /posts защищён — сюда надо будет добавить токен через cookies/route handler
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Feed request failed: ${res.status}`);
  }

  return res.json();
}

export default async function FeedPage() {
  const posts = await getFeed();

  return (
   <main className="feedPage">
  <div className="feedContainer">
    <FeedTabs />
    <div className="feedList">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  </div>
</main>
  );
}