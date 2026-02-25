export type RelationshipDuration = {
  years: number;
  months: number;
  days: number;
};

export const buildYoutubeEmbedUrl = (videoId: string, muted: boolean) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&playsinline=1&mute=${muted ? 1 : 0}`;

export const calculateRelationshipDuration = (
  startDate: Date,
  now: Date,
): RelationshipDuration => {
  let yearsDiff = now.getFullYear() - startDate.getFullYear();
  let monthsDiff = now.getMonth() - startDate.getMonth();
  let daysDiff = now.getDate() - startDate.getDate();

  if (daysDiff < 0) {
    monthsDiff -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    daysDiff += prevMonth.getDate();
  }

  if (monthsDiff < 0) {
    yearsDiff -= 1;
    monthsDiff += 12;
  }

  return {
    years: yearsDiff,
    months: monthsDiff,
    days: daysDiff,
  };
};
