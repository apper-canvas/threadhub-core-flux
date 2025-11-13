import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";

export function formatTimeAgo(date) {
  const now = new Date();
  const targetDate = new Date(date);
  
  if (isToday(targetDate)) {
    const distance = formatDistanceToNow(targetDate, { addSuffix: true });
    return distance.replace("about ", "");
  }
  
  if (isYesterday(targetDate)) {
    return "yesterday";
  }
  
  const daysDiff = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 7) {
    return `${daysDiff} days ago`;
  }
  
  if (daysDiff <= 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  
  if (daysDiff <= 365) {
    const months = Math.floor(daysDiff / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  
  const years = Math.floor(daysDiff / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}