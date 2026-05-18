/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useSEO } from '../../utils/seo';
import KhutbahCard from '../../components/KhutbahCard/KhutbahCard';
import './CatalogPage.css';

export default function CatalogPage() {
  const { filteredKhutbah, searchQuery, setSearchQuery, categories, types,
    activeCategory, setActiveCategory, activeType, setActiveType,
    activeDuration, setActiveDuration, allKhutbah } = useApp();
  const [params] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const cat = params.get('cat');
    const type = params.get('type');
    if (cat) setActiveCategory(cat);
    if (type) setActiveType(type);
    return () => { setActiveCategory(null); setActiveType(null); setActiveDuration(null); setSearchQuery(''); };
  }, []);

  // Dynamic SEO based on active filters
  const activeCat = categories.find(c => c.id === activeCategory);
  const activeTypeName = types.find(t => t.id === activeType);

  let seoTitle = `Katalog Teks Khutbah Jumat dan Materi Dakwah Islam | Islamediaku`;
  let seoDesc = `Temukan ${allKhutbah.length}+ teks khutbah Jumat, kultum, tausiyah, dan materi dakwah Islam siap pakai. Filter berdasarkan kategori, tipe, dan durasi.`;

  if (activeCat) {
    seoTitle = `Khutbah Jumat tentang ${activeCat.label} | Islamediaku`;
    seoDesc = `Koleksi teks khutbah Jumat dan materi dakwah Islam bertema ${activeCat.label}. Siap pakai untuk khatib dan dai.`;
  } else if (activeTypeName) {
    seoTitle = `${activeTypeName.label} Islam Siap Pakai | Islamediaku`;
    seoDesc = `Koleksi ${activeTypeName.label.toLowerCase()} Islam siap pakai. Temukan materi dakwah berkualitas di Islamediaku.`;
  }

  useSEO({
    title: seoTitle,
    description: seoDesc,
    path: '/khutbah',
  });

  const toggle = (setter, current, val) => setter(current === val ? null : val);

  // Count khutbah per category
  const catCounts = {};
  for (const k of allKhutbah) {
    catCounts[k.category] = (catCounts[k.category] || 0) + 1;
  }

  return (
    <div className="catalog container">
      <div className="section__header">
        <div>
          <h1 className="section__title">Katalog Teks Khutbah Jumat dan Materi Dakwah Islam</h1>
          <p className="section__subtitle">Temukan materi khutbah yang sesuai kebutuhan Anda — {allKhutbah.length} naskah tersedia</p>
        </div>
      </div>

      <div className="catalog__search-bar">
        <div className="catalog__search">
          <span className="catalog__search-icon">🔍</span>
          <input className="catalog__search-input" type="search" placeholder="Cari judul, tema, atau kata kunci..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <button className="btn btn--secondary" onClick={() => setShowFilter(true)}>
          <span style={{fontSize: '16px'}}>⚙️</span> Filter
        </button>
      </div>

      {showFilter && (
        <div className="filter-modal-overlay" onClick={() => setShowFilter(false)}>
          <div className="filter-modal" onClick={e => e.stopPropagation()}>
            <div className="filter-modal__header">
              <h3>Filter Pencarian</h3>
              <button onClick={() => setShowFilter(false)} aria-label="Tutup">✖</button>
            </div>
            <div className="filter-modal__body">
              <div className="filter-section">
                <h4>Kategori Tema</h4>
                <div className="catalog__filters catalog__filters--wrap">
                  <button className={`filter-btn${!activeCategory?' active':''}`}
                    onClick={() => setActiveCategory(null)}>📋 Semua <span className="filter-count">{allKhutbah.length}</span></button>
                  {categories.map(c => (
                    <button key={c.id} className={`filter-btn${activeCategory===c.id?' active':''}`}
                      onClick={() => toggle(setActiveCategory, activeCategory, c.id)}>
                      {c.icon} {c.label} <span className="filter-count">{catCounts[c.id] || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

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
              <button className="btn btn--ghost" onClick={() => { setActiveCategory(null); setActiveType(null); setActiveDuration(null); }}>Reset</button>
              <button className="btn btn--primary" style={{flex: 1}} onClick={() => setShowFilter(false)}>Terapkan Filter</button>
            </div>
          </div>
        </div>
      )}

      {filteredKhutbah.length > 0 ? (
        <div className="catalog__grid">
          {filteredKhutbah.map(k => <KhutbahCard key={k.id} khutbah={k} />)}
        </div>
      ) : (
        <div className="catalog__empty">
          <div className="catalog__empty-icon">🔍</div>
          <p><strong>Khutbah tidak ditemukan</strong></p>
          <p>Coba kata kunci lain atau ubah filter</p>
        </div>
      )}
    </div>
  );
}
