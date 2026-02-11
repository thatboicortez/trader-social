'use client';

import styles from './TopTabs.module.css';

export function TopTabs({
  active,
  onChange,
}: {
  active: 'forYou' | 'following';
  onChange: (v: 'forYou' | 'following') => void;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.pill}>
        <button
          className={`${styles.tab} ${active === 'forYou' ? styles.active : ''}`}
          onClick={() => onChange('forYou')}
          type="button"
        >
          For you
        </button>
        <button
          className={`${styles.tab} ${active === 'following' ? styles.active : ''}`}
          onClick={() => onChange('following')}
          type="button"
        >
          Following
        </button>
      </div>
    </div>
  );
}