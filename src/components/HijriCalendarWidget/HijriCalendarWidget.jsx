import { useMemo } from 'react';
import { getHijriDateString, getUpcomingEvents, HIJRI_DISCLAIMER } from '../../data/hijriData';
import './HijriCalendarWidget.css';

export default function HijriCalendarWidget({ maxEvents = 4 }) {
  const now = new Date();
  const hijriStr = useMemo(() => getHijriDateString(now), []);
  const events = useMemo(() => getUpcomingEvents(now).slice(0, maxEvents), []);
  const gregorian = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="hijri-widget">
      <div className="hijri-widget__header">
        <div>
          <div className="hijri-widget__today">📅 {hijriStr}</div>
          <div className="hijri-widget__gregorian">{gregorian}</div>
        </div>
      </div>
      <div className="hijri-widget__events">
        {events.map((evt, i) => (
          <div key={i} className="hijri-widget__event">
            <span className="hijri-widget__event-name">{evt.name}</span>
            <span className="hijri-widget__event-days">
              {evt.daysUntil === 0 ? '🎉 Hari ini!' : `${evt.daysUntil} hari lagi`}
            </span>
          </div>
        ))}
      </div>
      <p className="hijri-widget__disclaimer">{HIJRI_DISCLAIMER}</p>
    </div>
  );
}
