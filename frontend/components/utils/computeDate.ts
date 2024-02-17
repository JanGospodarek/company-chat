export function computeDate(date: Date) {
  const now = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const sameDay =
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day;
  if (sameDay) {
    const time = date.toLocaleTimeString("pl-Pl", {
      hour: "numeric",
      minute: "numeric",
    });
    return time;
  }
  const sameWeek = now.valueOf() - date.valueOf() < 7 * 24 * 60 * 60 * 1000;
  if (sameWeek) {
    const day = date.toLocaleDateString("pl-Pl", {
      weekday: "long",
    });
    return day;
  }
  const sameYear = now.getFullYear() === year;
  if (sameYear) {
    const day = date.toLocaleDateString("pl-Pl", {
      day: "numeric",
      month: "short",
    });
    return day;
  }
  return date.toLocaleDateString("pl-Pl", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function computeLongDate(date: Date) {
  const now = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const sameDay =
    now.getFullYear() === year &&
    now.getMonth() === month &&
    now.getDate() === day;
  if (sameDay) {
    const time = date.toLocaleTimeString("pl-Pl", {
      hour: "numeric",
      minute: "numeric",
    });
    return time;
  }
  const sameWeek = now.valueOf() - date.valueOf() < 7 * 24 * 60 * 60 * 1000;
  if (sameWeek) {
    const day = date.toLocaleDateString("pl-Pl", {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
    });
    return day;
  }
  const sameYear = now.getFullYear() === year;
  if (sameYear) {
    const day = date.toLocaleDateString("pl-Pl", {
      day: "numeric",
      month: "short",
    });
    return day;
  }
  return date.toLocaleDateString("pl-Pl", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const minuteDifference = (a: Date, b: Date) => {
  return Math.floor((a.valueOf() - b.valueOf()) / 60000);
};
