import { FeedTabs } from "@/components/FeedTabs";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // ок для SSR тоже, если задана в Koyeb

async function getFeed(): Promise<Post[]> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");

  const res = await fetch(`${API_URL}/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Feed request failed: ${res.status} ${text}`);
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