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
