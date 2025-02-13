import { MessageInterface } from "@/types/types";

export const formatDate = (dateInput: string | Date) => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  today.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Returns a group label for a message based solely on its date.
 * For messages:
 * - Today: show time (e.g., "12:00 PM")
 * - Yesterday: show abbreviated weekday and time (e.g., "Thu 12:54 PM")
 * - Older than yesterday: show full date with time (e.g., "Feb 5, 2025, 2:25 PM")
 */
const getMessageGroupLabel = (msgDate: Date, now: Date): string => {
  if (msgDate.toDateString() === now.toDateString()) {
    // Today: show time only (e.g., "12:00 PM")
    return msgDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (msgDate.toDateString() === yesterday.toDateString()) {
    // Yesterday: show abbreviated weekday and time (e.g., "Thu 12:54 PM")
    return (
      msgDate.toLocaleDateString("en-US", { weekday: "short" }) +
      " " +
      msgDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );
  }
  // Older than yesterday: show full date with time (e.g., "Feb 5, 2025, 2:25 PM")
  return (
    msgDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    ", " +
    msgDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  );
};

// Group messages into an object where keys are group labels based solely on date.
export const groupMessages = (
  messages: MessageInterface[]
): Record<string, MessageInterface[]> => {
  const now = new Date();
  return messages?.reduce((acc, message) => {
    const msgDate = new Date(message.createdAt);
    const groupLabel = getMessageGroupLabel(msgDate, now);
    if (!acc[groupLabel]) {
      acc[groupLabel] = [];
    }
    acc[groupLabel].push(message);
    return acc;
  }, {} as Record<string, MessageInterface[]>);
};
