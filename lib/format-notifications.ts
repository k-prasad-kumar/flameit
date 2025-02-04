import { NotificationInterface } from "@/types/types";

export const groupNotificationsByDate = (
  notifications: NotificationInterface[]
) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 7);
  const last30Days = new Date();
  last30Days.setDate(today.getDate() - 30);

  const grouped: Record<string, NotificationInterface[]> = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    "Last 30 Days": [],
    Older: [],
  };

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);
    if (date.toDateString() === today.toDateString()) {
      grouped["Today"].push(notification);
    } else if (date.toDateString() === yesterday.toDateString()) {
      grouped["Yesterday"].push(notification);
    } else if (date >= last7Days) {
      grouped["Last 7 Days"].push(notification);
    } else if (date >= last30Days) {
      grouped["Last 30 Days"].push(notification);
    } else {
      grouped["Older"].push(notification);
    }
  });

  return grouped;
};
