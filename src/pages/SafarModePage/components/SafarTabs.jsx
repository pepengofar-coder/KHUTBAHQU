import { useMemo } from 'react';

export default function SafarTabs({ activeTab, onTabClick }) {
  const tabs = useMemo(() => [
    { label: 'Overview', id: 'overview' },
    { label: 'Guidance', id: 'guidance' },
    { label: 'Du’a', id: 'duas' },
    { label: 'Audio', id: 'audio' },
    { label: 'Qibla', id: 'qibla', isLink: true, path: '/kiblat' },
    { label: 'Tips', id: 'tips' },
  ], []);

  return (
    <div className="safar-sticky-tabs">
      <div className="safar-sticky-tabs__inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab)}
            className={`safar-tab-btn ${activeTab === tab.id ? 'safar-tab-btn--active' : ''}`}
            style={{ cursor: 'pointer' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
