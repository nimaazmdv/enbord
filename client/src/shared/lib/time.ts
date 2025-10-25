import * as fns from "date-fns";

export function formatAbsolute(date: string, mode: "date" | "time" | "full") {
  const formattedDate = fns.format(date, "MMM d"); // eg, Oct 14
  const formattedTime = fns.format(date, "h:mm a"); // eg, 3:42 PM

  switch (mode) {
    case "date":
      return formattedDate;
    case "time":
      return formattedTime;
    case "full":
      return `${formattedDate}, ${formattedTime}`;
  }
}

export function formatSmartAbsolute(
  date: string,
  { weekdays = false, time = false }: { weekdays?: boolean; time?: boolean },
) {
  let formattedDate;
  const formattedTime = fns.format(date, "h:mm a"); // eg, 3:42 PM

  if (fns.isToday(date)) {
    // Show only the time if it's today
    return formattedTime;
  }

  if (fns.isYesterday(date)) {
    formattedDate = "Yesterday";
  } else if (weekdays && fns.isThisWeek(date)) {
    formattedDate = fns.format(date, "EEE"); // eg, Sat
  } else if (fns.isThisYear(date)) {
    formattedDate = fns.format(date, "MMM d"); // eg, Oct 14
  } else {
    formattedDate = fns.format(date, "MMM d, yyyy"); // eg, Oct 14, 2025
  }

  return time ? `${formattedDate}, ${formattedTime}` : formattedDate;
}

export function formatRelative(date: string, nowTs?: number) {
  // Calculate now from an optional external timestamp for performance
  const now = nowTs ? new Date(nowTs) : new Date();

  const dSeconds = fns.differenceInSeconds(now, date);
  const dDays = fns.differenceInCalendarDays(now, date);

  // Extract custom values for dates around now
  if (Math.abs(dSeconds) < 60) {
    return "Just now";
  }

  if (dDays === 1) {
    return "Yesterday";
  }

  if (dDays === -1) {
    return "Tomorrow";
  }

  // Pass anything else for a dynamic "time ago" style formatting
  return fns.formatDistanceToNowStrict(date, { addSuffix: true });
}
