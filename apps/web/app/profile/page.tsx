import { BottomNav } from '@/src/components/BottomNav';

export default function ProfilePage() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontWeight: 800 }}>Profile</div>
          <div className="muted" style={{ marginTop: 6 }}>Coming soon</div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}