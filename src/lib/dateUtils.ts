import { differenceInDays, format, addDays, startOfWeek } from 'date-fns';

export const DEPARTURE_DATE = new Date(2026, 7, 9); // 9 August 2026 (Month is 0-indexed in JS)

export function getDaysUntilDeparture() {
  return differenceInDays(DEPARTURE_DATE, new Date());
}

export function getCurrentDateFormatted() {
  return format(new Date(), 'EEEE, MMMM d');
}

export function getWeekDays() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Starts on Monday
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
}
