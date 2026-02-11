// apps/web/src/components/PostCard.tsx
import type { Post } from '@/src/types/post';

type Props = {
  post: Post;
  onClick?: () => void;
};

// 1s..24h => "now / 1m / 2h"  (дальше покажем дату "DD.MM.YYYY")
function formatTimeAgoOrDate(dateInput: string | Date): string {
  const dt = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();

  const diffMs = now.getTime() - dt.getTime();
  if (!Number.isFinite(diffMs)) return '';

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);

  // на будущее/битая дата
  if (diffSec < 0) return 'now';

  if (diffSec < 5) return 'now';          // 0-4s
  if (diffMin < 1) return 'now';          // до 59s
  if (diffHrs < 1) return `${diffMin}m`;  // 1m..59m
  if (diffHrs <= 24) return `${diffHrs}h`; // 1h..24h

  // DD.MM.YYYY
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yyyy = dt.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function withAgoIfRelative(text: string): string {
  // если это "now" или "12m" или "3h" => добавляем "ago"
  if (!text) return '';
  if (text === 'now') return 'now';
  if (/[mh]$/.test(text)) return `${text} ago`;
  // иначе это дата типа 11.02.2026 => без ago
  return text;
}

export function PostCard({ post, onClick }: Props) {
  const authorName = post.author?.displayName || post.author?.username || 'Unknown';
  const authorHandle = post.author?.username ? `@${post.author.username}` : '';

  const when = withAgoIfRelative(formatTimeAgoOrDate(post.createdAt));

  return (
    <article
      className={`postCard ${onClick ? 'postCardClickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
    >
      <div className="postHeader">
        <div className="avatar" />
        <div className="postMeta">
          <div className="postTitleRow">
            <div className="authorName">{authorName}</div>
            {authorHandle ? <div className="authorHandle">{authorHandle}</div> : null}
          </div>

          <div className="postSubRow">
            <div className="postDate">{when}</div>
          </div>
        </div>
      </div>

      <div className="postBody">
        <p className="postContent">{post.content}</p>
      </div>
    </article>
  );
}