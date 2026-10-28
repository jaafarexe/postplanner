export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function formatTimeDisplay(time24: string): string {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  if (isNaN(hours)) return time24;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${ampm}`;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isDateToday(date: Date): boolean {
  const today = new Date();
  return isSameDay(date, today);
}

/**
 * Builds a 35 or 42 day grid for the given year and month (0-indexed).
 * Starts with Monday.
 */
export function generateMonthCalendar(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week: Sunday is 0, Monday is 1, ..., Saturday is 6.
  // We want Monday as index 0, ..., Sunday as index 6.
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6; // Sunday moved to index 6

  const days: CalendarDay[] = [];
  const today = new Date();

  // 1. Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    const dayOfWeek = prevDate.getDay();
    days.push({
      date: prevDate,
      dateString: formatDateString(prevDate),
      dayNumber: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: isSameDay(prevDate, today),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  // 2. Current month days
  const totalDaysInMonth = lastDayOfMonth.getDate();
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const currentDate = new Date(year, month, d);
    const dayOfWeek = currentDate.getDay();
    days.push({
      date: currentDate,
      dateString: formatDateString(currentDate),
      dayNumber: d,
      isCurrentMonth: true,
      isToday: isSameDay(currentDate, today),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  // 3. Next month leading days to complete full grid (multiples of 7, usually 35 or 42)
  const remainingSlots = (7 - (days.length % 7)) % 7;
  // If the grid has 35 days and more are needed, or keep minimum 35 days
  const targetTotal = days.length + remainingSlots < 35 ? 35 : days.length + remainingSlots;
  const daysToAdd = targetTotal - days.length;

  for (let n = 1; n <= daysToAdd; n++) {
    const nextDate = new Date(year, month + 1, n);
    const dayOfWeek = nextDate.getDay();
    days.push({
      date: nextDate,
      dateString: formatDateString(nextDate),
      dayNumber: nextDate.getDate(),
      isCurrentMonth: false,
      isToday: isSameDay(nextDate, today),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  return days;
}

export function formatFriendlyDate(dateStr: string): string {
  const date = parseDateString(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, tomorrow)) return 'Tomorrow';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
}
