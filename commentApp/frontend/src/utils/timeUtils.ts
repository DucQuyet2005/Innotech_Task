/**
 * ===========================================
 * TIME UTILS - Relative Time Formatting
 * ===========================================
 * 
 * Chuyển đổi ISO timestamp thành "X phút trước",
 * "X giờ trước"... giống Facebook/YouTube.
 */

/**
 * Format thời gian tương đối.
 * @param dateString - ISO date string
 * @returns String dạng "vừa xong", "5 phút trước", "2 giờ trước"...
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 30) return 'vừa xong';
  if (diffSeconds < 60) return `${diffSeconds} giây trước`;
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffWeeks < 4) return `${diffWeeks} tuần trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return `${diffYears} năm trước`;
}
