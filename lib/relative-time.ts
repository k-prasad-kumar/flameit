export function getRelativeTime(createdAt: Date): string {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return `${seconds} seconds ago`;
  if (hours < 1) return `${minutes} minutes ago`;
  if (days < 1) return `${hours} hours ago`;
  if (weeks < 1) return `${days} days ago`;
  if (months < 1) return `${weeks} weeks ago`;

  return `${months} months ago`;
}
