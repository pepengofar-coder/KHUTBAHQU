import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  gregorianToHijri, getHijriDateString, getUpcomingEvents,
  getRecommendedThemes, buildMonthCalendar,
  HIJRI_MONTHS, SUNNAH_FASTS, HIJRI_DISCLAIMER
} from '../../data/hijriData';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import './HijriCalendarPage.css';

const WEEKDAYS_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const GREGORIAN_MONTHS = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

export default function HijriCalendarPage() {
  const { allKhutbah, categories } = useApp();
  const now   = new Date();
  const today = useMemo(() => gregorianToHijri(now), []);

  const [viewYear,  setViewYear]  = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed Gregorian
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'fast' | 'event'

  const calDays  = useMemo(() => buildMonthCalendar(viewYear, viewMonth), [viewYear, viewMonth]);
  const events   = useMemo(() => getUpcomingEvents(now), []);
  const hijriStr = useMemo(() => getHijriDateString(now), []);

  // Nav
  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); setSelectedDay(null); };

  // Hijri month of the first real day in view
  const firstRealDay = calDays.find(d => d !== null);
  const viewHijriMonth = firstRealDay ? firstRealDay.hijri.month : today.month;
  const viewHijriYear  = firstRealDay ? firstRealDay.hijri.year  : today.year;

  // Recommended khutbah
  const themes      = useMemo(() => getRecommendedThemes(viewHijriMonth), [viewHijriMonth]);
  const recommended = allKhutbah.filter(k => themes.includes(k.category)).slice(0, 3);

  // Sunnah fasts in this month
  const sunnahInMonth = SUNNAH_FASTS.filter(sf =>
    sf.type === 'date' ? sf.month === viewHijriMonth : sf.type !== 'info'
  );

  return (
    <div className="hijri-page container">
      {/* ── Top: Today's date ── */}
      <div className="hijri-page__today-card">
        <div className="hijri-page__today-hijri">{hijriStr}</div>
        <div className="hijri-page__today-greg">
          {now.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </div>
      </div>

      {/* ── Month Calendar ── */}
      <div className="hijri-cal">
        {/* Header */}
        <div className="hijri-cal__header">
          <button className="hijri-cal__nav" onClick={prevMonth} aria-label="Bulan sebelumnya">‹</button>
          <div className="hijri-cal__title">
            <div className="hijri-cal__greg-month">{GREGORIAN_MONTHS[viewMonth]} {viewYear}</div>
            <div className="hijri-cal__hijri-month">
              {HIJRI_MONTHS[viewHijriMonth - 1]} {viewHijriYear} H
            </div>
          </div>
          <button className="hijri-cal__nav" onClick={nextMonth} aria-label="Bulan berikutnya">›</button>
        </div>
        <div className="hijri-cal__today-btn-row">
          <button className="hijri-cal__today-btn" onClick={goToday}>📅 Hari Ini</button>
          <div className="hijri-cal__filter">
            {[['all','Semua'],['fast','🌙 Puasa'],['event','🕌 Acara']].map(([v,l]) => (
              <button
                key={v}
                className={`hijri-cal__filter-btn${activeFilter===v?' active':''}`}
                onClick={() => setActiveFilter(v)}
              >{l}</button>
            ))}
          </div>
        </div>

        {/* Weekday labels */}
        <div className="hijri-cal__weekdays">
          {WEEKDAYS_SHORT.map((d, i) => (
            <div key={d} className={`hijri-cal__weekday${i===5?' hijri-cal__weekday--friday':''}`}>{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="hijri-cal__grid">
          {calDays.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="hijri-cal__empty" />;

            const hasFast  = day.fasts.length > 0;
            const hasEvent = day.events.length > 0;
            const isSelected = selectedDay?.date?.getTime() === day.date.getTime();

            const showDot = activeFilter === 'all'   ? (hasFast || hasEvent)
                          : activeFilter === 'fast'  ? hasFast
                          : activeFilter === 'event' ? hasEvent : false;

            return (
              <button
                key={day.gDay}
                className={[
                  'hijri-cal__day',
                  day.isToday      ? 'hijri-cal__day--today'    : '',
                  isSelected       ? 'hijri-cal__day--selected' : '',
                  day.weekday === 5? 'hijri-cal__day--friday'   : '',
                  hasFast          ? 'hijri-cal__day--fast'     : '',
                  hasEvent         ? 'hijri-cal__day--event'    : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                title={[
                  ...day.events.map(e => e.name),
                  ...day.fasts.map(f => f.name)
                ].join(' · ') || `${day.gDay} (${day.hijri.day} ${HIJRI_MONTHS[day.hijri.month-1]})`}
              >
                <span className="hijri-cal__gday">{day.gDay}</span>
                <span className="hijri-cal__hday">{day.hijri.day}</span>
                {showDot && (
                  <div className="hijri-cal__dots">
                    {hasFast  && activeFilter !== 'event' && <span className="hijri-cal__dot hijri-cal__dot--fast"  />}
                    {hasEvent && activeFilter !== 'fast'  && <span className="hijri-cal__dot hijri-cal__dot--event" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="hijri-cal__legend">
          <span><span className="hijri-cal__dot hijri-cal__dot--fast" /> Puasa Sunnah</span>
          <span><span className="hijri-cal__dot hijri-cal__dot--event" /> Acara Islam</span>
          <span className="hijri-cal__legend-friday">Jum <span style={{color:'var(--color-primary)'}}>■</span></span>
        </div>
      </div>

      {/* ── Selected Day Detail ── */}
      {selectedDay && (
        <div className="hijri-detail">
          <div className="hijri-detail__header">
            <div>
              <h3 className="hijri-detail__date">
                {selectedDay.gDay} {GREGORIAN_MONTHS[viewMonth]} {viewYear}
              </h3>
              <p className="hijri-detail__hijri">
                {selectedDay.hijri.day} {HIJRI_MONTHS[selectedDay.hijri.month - 1]} {selectedDay.hijri.year} H
              </p>
            </div>
            <button className="hijri-detail__close" onClick={() => setSelectedDay(null)}>✕</button>
          </div>

          {selectedDay.events.length === 0 && selectedDay.fasts.length === 0 && (
            <p className="hijri-detail__empty">Tidak ada acara atau puasa sunnah pada hari ini.</p>
          )}

          {selectedDay.events.map((e, i) => (
            <div key={i} className="hijri-detail__item hijri-detail__item--event">
              <span className="hijri-detail__item-icon">🕌</span>
              <div>
                <div className="hijri-detail__item-name">{e.name}</div>
                <div className="hijri-detail__item-type">Acara Islam</div>
              </div>
            </div>
          ))}

          {selectedDay.fasts.map((f, i) => (
            <div key={i} className="hijri-detail__item hijri-detail__item--fast" style={{ borderColor: f.color }}>
              <span className="hijri-detail__item-icon">{f.icon}</span>
              <div>
                <div className="hijri-detail__item-name" style={{ color: f.color }}>{f.name}</div>
                <div className="hijri-detail__item-desc">{f.description}</div>
                <div className="hijri-detail__item-dalil">📚 {f.dalil}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Puasa Sunnah Panel ── */}
      <section className="hijri-fasts">
        <h2 className="hijri-fasts__title">🌙 Puasa-Puasa Sunnah</h2>
        <p className="hijri-fasts__subtitle">
          Amalan puasa sunnah yang dianjurkan Rasulullah ﷺ dan pahalanya sangat besar
        </p>
        <div className="hijri-fasts__grid">
          {SUNNAH_FASTS.map(sf => (
            <div key={sf.id} className="hijri-fast-card" style={{ '--fast-color': sf.color }}>
              <div className="hijri-fast-card__icon">{sf.icon}</div>
              <div className="hijri-fast-card__content">
                <h3 className="hijri-fast-card__name">{sf.name}</h3>
                <p className="hijri-fast-card__desc">{sf.description}</p>
                <div className="hijri-fast-card__schedule">
                  {sf.type === 'date'    && <span>📅 {HIJRI_MONTHS[sf.month-1]}, hari ke-{sf.days.join(', ')}</span>}
                  {sf.type === 'weekly'  && <span>🔄 Setiap Senin & Kamis</span>}
                  {sf.type === 'monthly' && <span>🌔 Setiap 13, 14, 15 Hijriah</span>}
                  {sf.type === 'info'    && <span>⚖️ Sehari puasa, sehari tidak</span>}
                </div>
                <div className="hijri-fast-card__dalil">📚 {sf.dalil}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="hijri-events">
        <h2 className="hijri-events__title">🕌 Peristiwa Islam Terdekat</h2>
        <div className="hijri-events__list">
          {events.map((e, i) => (
            <div key={i} className={`hijri-events__item${e.daysUntil === 0 ? ' hijri-events__item--today' : ''}`}>
              <div className="hijri-events__name">{e.name}</div>
              <div className="hijri-events__badge">
                {e.daysUntil === 0 ? '🎉 Hari ini!' : `${e.daysUntil} hari lagi`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recommended Khutbah ── */}
      {recommended.length > 0 && (
        <section style={{ marginTop: 'var(--sp-8)' }}>
          <h2 className="section__title" style={{ marginBottom: 8 }}>📖 Rekomendasi Khutbah Bulan Ini</h2>
          <p className="section__subtitle" style={{ marginBottom: 16 }}>
            Berdasarkan bulan {HIJRI_MONTHS[viewHijriMonth - 1]} —{' '}
            {themes.map(t => categories.find(c => c.id === t)?.label).filter(Boolean).join(', ')}
          </p>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {recommended.map(k => <KhutbahCard key={k.id} khutbah={k} compact />)}
          </div>
        </section>
      )}

      <p className="hijri-page__disclaimer">{HIJRI_DISCLAIMER}</p>
    </div>
  );
}
