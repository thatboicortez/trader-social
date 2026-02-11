import { FeedTabs } from '@/components/FeedTabs';

export default function FollowingPage() {
  return (
    <main className="feedPage">
      <div className="feedContainer">
        <FeedTabs />
        <div className="card" style={{ padding: 14 }}>
          <div className="feedTitle">Following</div>
          <div className="muted">
            Here will be your subscribed channels list (like Telegram).
          </div>
        </div>
      </div>
    </main>
  );
}