/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useSEO } from '../../utils/seo';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import './CatalogPage.css';

export default function CatalogPage() {
  const { filteredKhutbah, searchQuery, setSearchQuery, categories, types,
    activeCategory, setActiveCategory, activeType, setActiveType,
    activeDuration, setActiveDuration, allKhutbah } = useApp();
  const [params, setParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const cat = params.get('category');
    const type = params.get('type');
    const q = params.get('q');
    if (cat) setActiveCategory(cat);
    if (type) setActiveType(type);
    if (q) setSearchQuery(q);
    
    return () => { setActiveCategory(null); setActiveType(null); setActiveDuration(null); setSearchQuery(''); };
  }, []);

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (activeCategory) newParams.set('category', activeCategory);
    if (activeType) newParams.set('type', activeType);
    if (searchQuery) newParams.set('q', searchQuery);
    setParams(newParams, { replace: true });
  }, [activeCategory, activeType, searchQuery, setParams]);

  const activeCat = categories.find(c => c.id === activeCategory);
  const activeTypeName = types.find(t => t.id === activeType);

  let seoTitle = `Khutbah & Materi Islami - Islamediaku`;
  let seoDesc = `Temukan ${allKhutbah.length}+ teks khutbah Jumat, kultum, tausiyah, dan materi dakwah Islam siap pakai. Filter berdasarkan kategori, tipe, dan durasi.`;

  if (activeCat) {
    seoTitle = `Materi tentang ${activeCat.label} - Islamediaku`;
    seoDesc = `Koleksi teks khutbah Jumat dan materi dakwah Islam bertema ${activeCat.label}. Siap pakai untuk khatib dan dai.`;
  } else if (activeTypeName) {
    seoTitle = `${activeTypeName.label} Islam Siap Pakai - Islamediaku`;
    seoDesc = `Koleksi ${activeTypeName.label.toLowerCase()} Islam siap pakai. Temukan materi dakwah berkualitas di Islamediaku.`;
  }

  useSEO({
    title: seoTitle,
    description: seoDesc,
    path: '/khutbah',
  });

  const toggle = (setter, current, val) => setter(current === val ? null : val);

  const catCounts = {};
  for (const k of allKhutbah) {
    catCounts[k.category] = (catCounts[k.category] || 0) + 1;
  }

  const sortedKhutbah = useMemo(() => {
    let sorted = [...filteredKhutbah];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'shortest') {
      sorted.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'az') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [filteredKhutbah, sortBy]);

  const featuredCategories = [
    { id: 'jumat', title: 'Khutbah Jumat', desc: 'Materi khutbah khusus hari Jumat', icon: '🕌' },
    { id: 'ramadan', title: 'Ramadhan', desc: 'Materi seputar puasa dan Ramadhan', icon: '🌙' },
    { id: 'akhlak', title: 'Akhlak', desc: 'Pembinaan akhlak mulia', icon: '🤝' },
    { id: 'family', title: 'Keluarga', desc: 'Panduan membina rumah tangga', icon: '👨‍👩‍👧‍👦' },
    { id: 'youth', title: 'Pemuda', desc: 'Nasihat untuk generasi muda', icon: '💪' },
    { id: 'taubat', title: 'Taubat', desc: 'Kembali kepada jalan yang benar', icon: '😭' }
  ];

  return (
    <div className="catalog container">
      <div className="section__header">
        <div>
          <h1 className="section__title">Katalog Materi Dakwah</h1>
          <p className="section__subtitle">Temukan {allKhutbah.length} naskah khutbah dan kultum pilihan</p>
        </div>
      </div>

      <div className="catalog__search-bar">
        <div className="catalog__search">
          <span className="catalog__search-icon">🔍</span>
          <input className="catalog__search-input" type="search" placeholder="Cari judul, tema, atau kata kunci..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && (
            <button className="catalog__clear-search" onClick={() => setSearchQuery('')} aria-label="Hapus pencarian">✖</button>
          )}
        </div>
        <button className="btn btn--secondary" onClick={() => setShowFilter(true)}>
          <span style={{fontSize: '16px'}}>⚙️</span> Filter
        </button>
      </div>

      <div className="catalog__categories-scroll">
        <button className={`filter-btn${!activeCategory ? ' active' : ''}`}
          onClick={() => setActiveCategory(null)}>
          📋 Semua <span className="filter-count">{allKhutbah.length}</span>
        </button>
        {categories.map(c => (
          <button key={c.id} className={`filter-btn${activeCategory === c.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(c.id)}>
            {c.icon} {c.label} <span className="filter-count">{catCounts[c.id] || 0}</span>
          </button>
        ))}
      </div>

      {!activeCategory && !searchQuery && (
        <div className="catalog__featured">
          <h2 className="catalog__featured-title">Kategori Populer</h2>
          <div className="catalog__featured-grid">
            {featuredCategories.map(fc => {
              const count = catCounts[fc.id] || 0;
              return (
                <div key={fc.id} className="featured-card card glass-card" onClick={() => setActiveCategory(fc.id)}>
                  <div className="featured-card__icon">{fc.icon}</div>
                  <div className="featured-card__content">
                    <h3 className="featured-card__title">{fc.title}</h3>
                    <p className="featured-card__desc">{fc.desc}</p>
                    <span className="badge">{count} Materi</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="catalog__list-header">
        <h2 className="catalog__list-title">
          {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : activeCat ? `Kategori: ${activeCat.label}` : 'Semua Khutbah'}
          <span className="badge badge--primary" style={{marginLeft: '8px'}}>{sortedKhutbah.length}</span>
        </h2>
        
        <div className="catalog__sort">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="catalog__sort-select">
            <option value="newest">Terbaru</option>
            <option value="shortest">Durasi Singkat</option>
            <option value="az">A–Z</option>
          </select>
        </div>
      </div>

      {showFilter && (
        <div className="filter-modal-overlay" onClick={() => setShowFilter(false)}>
          <div className="filter-modal" onClick={e => e.stopPropagation()}>
            <div className="filter-modal__header">
              <h3>Filter Tambahan</h3>
              <button onClick={() => setShowFilter(false)} aria-label="Tutup">✖</button>
            </div>
            <div className="filter-modal__body">
              <div className="filter-section">
                <h4>Jenis Materi</h4>
                <div className="catalog__filters catalog__filters--wrap">
                  {types.map(t => (
                    <button key={t.id} className={`filter-btn${activeType===t.id?' active':''}`}
                      onClick={() => toggle(setActiveType, activeType, t.id)}>{t.label}</button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h4>Durasi</h4>
                <div className="catalog__filters catalog__filters--wrap">
                  <button className={`filter-btn${activeDuration==='short'?' active':''}`}
                    onClick={() => toggle(setActiveDuration, activeDuration, 'short')}>⏱ Singkat (≤8m)</button>
                  <button className={`filter-btn${activeDuration==='medium'?' active':''}`}
                    onClick={() => toggle(setActiveDuration, activeDuration, 'medium')}>⏱ Sedang (9-12m)</button>
                  <button className={`filter-btn${activeDuration==='long'?' active':''}`}
                    onClick={() => toggle(setActiveDuration, activeDuration, 'long')}>⏱ Panjang (≥13m)</button>
                </div>
              </div>
            </div>
            <div className="filter-modal__footer">
              <button className="btn btn--ghost" onClick={() => { setActiveType(null); setActiveDuration(null); }}>Reset Filter</button>
              <button className="btn btn--primary" style={{flex: 1}} onClick={() => setShowFilter(false)}>Terapkan Filter</button>
            </div>
          </div>
        </div>
      )}

      {sortedKhutbah.length > 0 ? (
        <div className="catalog__grid">
          {sortedKhutbah.map(k => <KhutbahCard key={k.id} khutbah={k} />)}
        </div>
      ) : (
        <div className="catalog__empty">
          <div className="catalog__empty-icon">🔍</div>
          <p><strong>
            {searchQuery ? "Tidak ada khutbah yang cocok dengan pencarianmu." : "Belum ada khutbah untuk kategori ini."}
          </strong></p>
          <p>Coba kata kunci lain atau ubah filter</p>
          {(activeCategory || searchQuery) && (
            <button className="btn btn--outline" style={{marginTop: '16px'}} onClick={() => { setActiveCategory(null); setSearchQuery(''); }}>
              Tampilkan Semua Khutbah
            </button>
          )}
        </div>
      )}
    </div>
  );
}
