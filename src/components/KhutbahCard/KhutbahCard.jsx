/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './KhutbahCard.css';

export default function KhutbahCard({ khutbah, compact = false }) {
  const nav = useNavigate();
  const { isBookmarked, toggleBookmark, copyText, shareWhatsApp, categories, types } = useApp();
  const bm = isBookmarked(khutbah.id);
  const cat = categories.find(c => c.id === khutbah.category);
  const tp = types.find(t => t.id === khutbah.type);

  const stop = (e, fn) => { e.stopPropagation(); fn(); };

  return (
    <article className="kcard card" onClick={() => nav(`/khutbah/${khutbah.slug}`)} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && nav(`/khutbah/${khutbah.slug}`)} id={`kcard-${khutbah.id}`}>
      <div className="kcard__top">
        <h3 className="kcard__title">{khutbah.title}</h3>
        <button className={`kcard__bm-btn${bm?' active':''}`} onClick={e => stop(e, () => toggleBookmark(khutbah.id))}
          aria-label={bm?'Hapus favorit':'Simpan favorit'}>
          {bm ? '★' : '☆'}
        </button>
      </div>
      {!compact && <p className="kcard__summary">{khutbah.summary}</p>}
      <div className="kcard__meta">
        {cat && <span className="badge badge--primary">{cat.icon} {cat.label}</span>}
        {tp && <span className="badge badge--gold">{tp.label}</span>}
        <span className="badge" style={{background:'var(--color-bg-alt)',color:'var(--color-text-muted)'}}>⏱ {khutbah.duration} mnt</span>
      </div>
      {!compact && (
        <div className="kcard__actions">
          <button className="btn btn--primary btn--sm" onClick={e => stop(e, () => nav(`/khutbah/${khutbah.slug}`))}>Baca</button>
          <button className="btn btn--outline btn--sm" onClick={e => stop(e, () => toggleBookmark(khutbah.id))}>{bm?'Tersimpan':'Simpan'}</button>
          <button className="btn btn--ghost btn--sm" onClick={e => stop(e, () => shareWhatsApp(khutbah))}>WhatsApp</button>
        </div>
      )}
    </article>
  );
}
