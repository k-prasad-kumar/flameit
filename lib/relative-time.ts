export function getRelativeTime(createdAt: Date): string {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  if (hours < 1) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (days < 1) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (weeks < 1) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (months < 1) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

  return `${months} month${months === 1 ? "" : "s"} ago`;
}
