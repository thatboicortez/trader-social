'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FeedTabs() {
  const pathname = usePathname();
  const isForYou = pathname === '/feed';
  const isFollowing = pathname === '/following';

  return (
    <div className="tabsWrap">
      <div className="tabsPill">
        <Link className={`tabBtn ${isForYou ? 'tabActive' : ''}`} href="/feed">
          For you
        </Link>
        <Link
          className={`tabBtn ${isFollowing ? 'tabActive' : ''}`}
          href="/following"
        >
          Following
        </Link>
      </div>
    </div>
  );
}