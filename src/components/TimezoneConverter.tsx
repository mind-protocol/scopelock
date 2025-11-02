'use client';

import { useEffect, useState } from 'react';
import styles from './TimezoneConverter.module.css';

export function TimezoneConverter() {
  const [localTime, setLocalTime] = useState<{ start: string; end: string; timezone: string } | null>(null);

  useEffect(() => {
    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Create Date objects for CET core hours (14:00-19:00)
    const now = new Date();
    const cetStartHour = 14;
    const cetEndHour = 19;

    // Create dates in CET timezone
    const cetStart = new Date(now);
    cetStart.setHours(cetStartHour, 0, 0, 0);

    const cetEnd = new Date(now);
    cetEnd.setHours(cetEndHour, 0, 0, 0);

    // Convert to user's local timezone
    const localStart = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: userTimezone,
      hour12: false,
    }).format(cetStart);

    const localEnd = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: userTimezone,
      hour12: false,
    }).format(cetEnd);

    // Get timezone abbreviation
    const tzAbbr = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
      timeZone: userTimezone,
    }).format(now).split(', ')[1] || userTimezone;

    setLocalTime({
      start: localStart,
      end: localEnd,
      timezone: tzAbbr,
    });
  }, []);

  // Server-side render fallback
  if (!localTime) {
    return (
      <div className={styles.timezoneConverter}>
        <div className={styles.cetTime}>
          <strong>Core hours:</strong> 14:00–19:00 CET
        </div>
      </div>
    );
  }

  // Check if user is in CET timezone
  const isCET = localTime.timezone.includes('CET') || localTime.timezone.includes('CEST');

  return (
    <div className={styles.timezoneConverter}>
      <div className={styles.cetTime}>
        <strong>Core hours (CET):</strong> 14:00–19:00
      </div>
      {!isCET && (
        <div className={styles.localTime}>
          <strong>Your local time:</strong> {localTime.start}–{localTime.end} {localTime.timezone}
        </div>
      )}
      <p className={styles.note}>
        {isCET
          ? 'You\'re in the same timezone! Perfect overlap for real-time collaboration.'
          : 'Async work happens 24/7. Most communication is through demos and /proof links.'}
      </p>
    </div>
  );
}
