/**
 * check shop is open now
 * @param {Object} openingHours - JSONB from DB
 * @param {string} timezone - e.g. 'Asia/Bangkok'
 * @returns {boolean}
 */

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function isOpenNow(openingHours, timezone = 'Asia/Bangkok') {
  if (!openingHours) return false;

  // current time in shop timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(now).map(p => [p.type, p.value])
  );

  // convert weekday from 'Mon' → 'mon'
  const todayKey = parts.weekday.toLowerCase();
  const todayHours = openingHours[todayKey];

  // null = closed all day
  if (!todayHours) return false;

  const { open, close } = todayHours;
  if (!open || !close) return false;

  // current time in "HH:MM"
  const currentTime = `${parts.hour}:${parts.minute}`;

  return currentTime >= open && currentTime < close;
}