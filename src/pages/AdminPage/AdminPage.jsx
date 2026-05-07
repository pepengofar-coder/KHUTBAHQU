import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { validateKhutbah, countWords, estimateReadingDuration, detectDuplicates, isSimilarTitle } from '../../data/khutbahValidator';
import { ALL_SOURCES, SUGGESTED_THEMES, STATUS_LABELS, CONTENT_STATUSES } from '../../data/khutbahSources';
import './AdminPage.css';

export default function AdminPage() {
  const { adminKhutbah, updateKhutbah, deleteKhutbah } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedKhutbah, setSelectedKhutbah] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const khutbahWithStatus = useMemo(() => adminKhutbah, [adminKhutbah]);

  // Validation results
  const validationResults = useMemo(() =>
    khutbahWithStatus.map(k => ({ khutbah: k, validation: validateKhutbah(k) }))
  , [khutbahWithStatus]);

  const duplicates = useMemo(() => detectDuplicates(khutbahWithStatus), [khutbahWithStatus]);

  // Stats
  const stats = useMemo(() => {
    const total = khutbahWithStatus.length;
    const published = khutbahWithStatus.filter(k => k.status === 'published').length;
    const totalWords = khutbahWithStatus.reduce((s, k) => s + countWords(k), 0);
    const avgDuration = total ? Math.round(khutbahWithStatus.reduce((s, k) => s + estimateReadingDuration(k), 0) / total) : 0;
    const issues = validationResults.reduce((s, r) => s + r.validation.issues.length, 0);
    return { total, published, totalWords, avgDuration, issues };
  }, [khutbahWithStatus, validationResults]);

  // Filtered list
  const filtered = khutbahWithStatus.filter(k => {
    if (filterStatus !== 'all' && k.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return k.title.toLowerCase().includes(q) || k.slug.includes(q) || k.category.includes(q);
    }
    return true;
  });

  return (
    <div className="admin container">
      <div className="admin__header">
        <h1>📋 Admin Panel — KhutbahQu</h1>
        <p className="admin__subtitle">Kelola, validasi, dan monitor materi khutbah</p>
      </div>

      {/* Tabs */}
      <div className="admin__tabs">
        {[
          { id: 'overview', label: '📊 Overview', },
          { id: 'content', label: '📝 Konten' },
          { id: 'validation', label: '🔍 Validasi' },
          { id: 'sources', label: '📚 Sumber Referensi' },
          { id: 'themes', label: '💡 Tema' },
          { id: 'guide', label: '📖 Panduan' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`admin__tab ${activeTab === tab.id ? 'admin__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >{tab.label}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin__section">
          <div className="admin__stats">
            <div className="admin__stat-card"><span className="admin__stat-num">{stats.total}</span><span className="admin__stat-label">Total Khutbah</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num">{stats.published}</span><span className="admin__stat-label">Published</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num">{stats.totalWords.toLocaleString()}</span><span className="admin__stat-label">Total Kata</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num">±{stats.avgDuration} mnt</span><span className="admin__stat-label">Rata-rata Durasi</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num" style={{ color: stats.issues > 0 ? '#D97706' : '#059669' }}>{stats.issues}</span><span className="admin__stat-label">Issues</span></div>
          </div>

          {duplicates.length > 0 && (
            <div className="admin__alert admin__alert--warning">
              <strong>⚠️ Duplikasi Terdeteksi:</strong>
              {duplicates.map((d, i) => <p key={i}>{d.type === 'title' ? 'Judul' : 'Slug'} duplikat: "{d.value}" (ID: {d.ids.join(', ')})</p>)}
            </div>
          )}

          <h3>Ringkasan per Kategori</h3>
          <div className="admin__category-grid">
            {[...new Set(khutbahWithStatus.map(k => k.category))].map(cat => {
              const items = khutbahWithStatus.filter(k => k.category === cat);
              return (
                <div key={cat} className="admin__cat-card">
                  <strong>{cat}</strong>
                  <span>{items.length} khutbah</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="admin__section">
          <div className="admin__toolbar">
            <input
              type="text" placeholder="🔍 Cari judul, slug, kategori..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="admin__search"
            />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="admin__select">
              <option value="all">Semua Status</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>

          <table className="admin__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Kata</th>
                <th>Durasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(k => {
                const words = countWords(k);
                const dur = estimateReadingDuration(k);
                const st = STATUS_LABELS[k.status] || STATUS_LABELS.draft;
                return (
                  <tr key={k.id}>
                    <td>{k.id}</td>
                    <td><strong>{k.title}</strong><br/><small className="admin__slug">/{k.slug}</small></td>
                    <td><span className="badge badge--primary">{k.category}</span></td>
                    <td className={words < 800 ? 'admin__warn' : ''}>{words}</td>
                    <td>±{dur} mnt</td>
                    <td><span className="admin__status" style={{ background: st.color + '20', color: st.color }}>{st.icon} {st.label}</span></td>
                    <td><button className="btn btn--ghost btn--sm" onClick={() => setSelectedKhutbah(k)}>Detail</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Detail Modal */}
          {selectedKhutbah && (
            <div className="admin__modal-overlay" onClick={() => setSelectedKhutbah(null)}>
              <div className="admin__modal" onClick={e => e.stopPropagation()}>
                <div className="admin__modal-header">
                  <h3>{selectedKhutbah.title}</h3>
                  <button onClick={() => setSelectedKhutbah(null)}>✕</button>
                </div>
                <div className="admin__modal-body">
                  <DetailView 
                    khutbah={selectedKhutbah} 
                    allKhutbah={khutbahWithStatus} 
                    onUpdate={(updates) => {
                      updateKhutbah(selectedKhutbah.id, updates);
                      setSelectedKhutbah({...selectedKhutbah, ...updates});
                    }}
                    onDelete={() => {
                      if(confirm('Yakin ingin menghapus?')) {
                        deleteKhutbah(selectedKhutbah.id);
                        setSelectedKhutbah(null);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Validation Tab */}
      {activeTab === 'validation' && (
        <div className="admin__section">
          <h3>🔍 Hasil Validasi Seluruh Khutbah</h3>
          {validationResults.map(({ khutbah: k, validation: v }) => (
            <div key={k.id} className={`admin__val-card ${v.valid ? 'admin__val-card--ok' : 'admin__val-card--warn'}`}>
              <div className="admin__val-header">
                <strong>{v.valid ? '✅' : '⚠️'} {k.title}</strong>
                <span>{v.wordCount} kata • ±{v.estimatedMinutes} mnt</span>
              </div>
              {v.issues.length > 0 && (
                <ul className="admin__val-issues">
                  {v.issues.map((issue, i) => (
                    <li key={i} className={`admin__val-issue--${issue.severity}`}>
                      {issue.severity === 'error' ? '🔴' : '🟡'} {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="admin__section">
          <div className="admin__alert admin__alert--info">
            <strong>ℹ️ Catatan Penting:</strong> Website di bawah ini digunakan HANYA sebagai inspirasi tema dan referensi kualitas.
            Konten khutbah TIDAK BOLEH disalin mentah. Seluruh naskah harus ditulis ulang secara orisinal.
          </div>

          <h3>🇮🇩 Sumber Indonesia</h3>
          <div className="admin__source-grid">
            {ALL_SOURCES.filter(s => s.lang === 'id').map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="admin__source-card">
                <strong>{s.name}</strong>
                <p>{s.focus}</p>
                <small>{s.url}</small>
              </a>
            ))}
          </div>

          <h3>🌍 Sumber Internasional</h3>
          <div className="admin__source-grid">
            {ALL_SOURCES.filter(s => s.lang !== 'id').map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="admin__source-card">
                <strong>{s.name}</strong>
                <p>{s.focus}</p>
                <small>{s.url}</small>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Themes Tab */}
      {activeTab === 'themes' && (
        <div className="admin__section">
          <h3>💡 Bank Tema Khutbah</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--sp-4)' }}>Klik tema untuk cek apakah sudah ada khutbah dengan tema serupa.</p>
          <div className="admin__theme-grid">
            {SUGGESTED_THEMES.map(t => {
              const existing = khutbahWithStatus.filter(k => k.category === t.theme || k.tags?.includes(t.theme));
              return (
                <div key={t.theme} className="admin__theme-card">
                  <div className="admin__theme-header">
                    <strong>{t.label}</strong>
                    <span className="badge badge--primary">{existing.length}</span>
                  </div>
                  <p>{t.description}</p>
                  {existing.length > 0 && (
                    <div className="admin__theme-existing">
                      {existing.map(k => <small key={k.id}>• {k.title}</small>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Guide Tab */}
      {activeTab === 'guide' && (
        <div className="admin__section admin__guide">
          <h3>📖 Panduan Update Materi Khutbah</h3>

          <div className="admin__guide-step">
            <h4>1. Generate Draft Baru</h4>
            <p>Jalankan perintah berikut di terminal:</p>
            <pre><code>node scripts/generateDraft.mjs "Judul Khutbah" --theme taqwa --source muslim-or-id</code></pre>
            <p>File draft akan dibuat di <code>src/data/drafts/</code></p>
          </div>

          <div className="admin__guide-step">
            <h4>2. Lengkapi Konten Draft</h4>
            <p>Buka file JSON draft, lalu ganti semua placeholder <code>[TULIS...]</code> dengan konten asli. Pastikan:</p>
            <ul>
              <li>Minimal 800 kata (±7-10 menit baca)</li>
              <li>Memiliki mukaddimah, wasiat taqwa, isi utama, dalil, dan penutup</li>
              <li>Tidak ada singkatan (SAW, SWT, dll)</li>
              <li>Bahasa formal dan profesional</li>
            </ul>
          </div>

          <div className="admin__guide-step">
            <h4>3. Review dan Validasi</h4>
            <p>Ubah status menjadi <code>"review"</code> setelah konten selesai. Gunakan tab Validasi untuk memeriksa masalah.</p>
          </div>

          <div className="admin__guide-step">
            <h4>4. Publish</h4>
            <p>Setelah lulus review, ubah status menjadi <code>"published"</code>. Import file draft ke <code>khutbahData.js</code>.</p>
          </div>

          <div className="admin__guide-step">
            <h4>5. Status Konten</h4>
            <div className="admin__status-list">
              {Object.entries(STATUS_LABELS).map(([key, val]) => (
                <div key={key} className="admin__status-item">
                  <span className="admin__status" style={{ background: val.color + '20', color: val.color }}>{val.icon} {val.label}</span>
                  <span>{key === 'draft' ? 'Baru dibuat, belum lengkap' : key === 'review' ? 'Konten lengkap, perlu dicek' : key === 'ready' ? 'Sudah direview, siap publish' : 'Sudah tayang di website'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin__guide-step">
            <h4>6. Aturan Penting</h4>
            <ul>
              <li>❌ JANGAN copy-paste dari website referensi</li>
              <li>✅ Gunakan referensi hanya untuk inspirasi tema dan dalil</li>
              <li>✅ Tulis ulang seluruh konten dengan bahasa sendiri</li>
              <li>✅ Pastikan setiap khutbah unik (cek duplikasi judul/slug)</li>
              <li>✅ Gunakan lafaz penghormatan lengkap</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/** Sub-component for detail view */
function DetailView({ khutbah, allKhutbah, onUpdate, onDelete }) {
  const v = validateKhutbah(khutbah);
  const words = countWords(khutbah);
  const dur = estimateReadingDuration(khutbah);
  const similar = isSimilarTitle(khutbah.title, allKhutbah.filter(k => k.id !== khutbah.id).map(k => k.title));

  return (
    <div className="admin__detail">
      {!khutbah.isStatic && (
        <div className="admin__actions" style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {khutbah.status === 'review' && (
            <>
              <button className="btn btn--primary" onClick={() => onUpdate({status: 'published'})}>✅ Approve & Publish</button>
              <button className="btn btn--ghost" style={{color: 'red', borderColor: 'red'}} onClick={() => onUpdate({status: 'rejected'})}>❌ Reject</button>
            </>
          )}
          {khutbah.status === 'published' && (
            <button className="btn btn--ghost" onClick={() => onUpdate({status: 'draft'})}>⬇️ Unpublish (Draft)</button>
          )}
          {(khutbah.status === 'draft' || khutbah.status === 'rejected') && (
            <button className="btn btn--primary" onClick={() => onUpdate({status: 'published'})}>⬆️ Publish</button>
          )}
          <button className="btn btn--ghost" style={{color: 'red', marginLeft: 'auto'}} onClick={onDelete}>🗑 Delete</button>
        </div>
      )}

      {khutbah.contributorName && (
        <div className="admin__alert admin__alert--info" style={{marginBottom: 16}}>
          <strong>👤 Kontributor:</strong> {khutbah.contributorName} ({khutbah.contributorEmail}) {khutbah.contributorWa ? ` - WA: ${khutbah.contributorWa}` : ''}
        </div>
      )}

      <div className="admin__detail-grid">
        <div><strong>ID:</strong> {khutbah.id}</div>
        <div><strong>Slug:</strong> {khutbah.slug}</div>
        <div><strong>Kategori:</strong> {khutbah.category}</div>
        <div><strong>Tipe:</strong> {khutbah.type}</div>
        <div><strong>Kata:</strong> {words}</div>
        <div><strong>Durasi:</strong> ±{dur} menit</div>
        <div><strong>Tags:</strong> {khutbah.tags?.join(', ')}</div>
        <div><strong>Tanggal:</strong> {khutbah.createdAt}</div>
      </div>

      <h4>Validasi</h4>
      <p>{v.valid ? '✅ Lulus validasi' : `⚠️ ${v.issues.length} masalah ditemukan`}</p>
      {v.issues.length > 0 && (
        <ul className="admin__val-issues">
          {v.issues.map((issue, i) => (
            <li key={i}>{issue.severity === 'error' ? '🔴' : '🟡'} {issue.message}</li>
          ))}
        </ul>
      )}

      {similar.similar && (
        <div className="admin__alert admin__alert--warning" style={{ marginTop: 12 }}>
          ⚠️ Judul mirip dengan: "{similar.existingTitle}" (kemiripan: {similar.similarity}%)
        </div>
      )}

      <h4>Struktur Konten</h4>
      <div className="admin__blocks">
        <p><strong>Khutbah 1:</strong> {khutbah.firstKhutbah?.length || 0} blok</p>
        {khutbah.firstKhutbah?.map((b, i) => (
          <span key={i} className={`admin__block-tag admin__block-tag--${b.type}`}>{b.type}</span>
        ))}
        <p style={{ marginTop: 8 }}><strong>Khutbah 2:</strong> {khutbah.secondKhutbah?.length || 0} blok</p>
        {khutbah.secondKhutbah?.map((b, i) => (
          <span key={i} className={`admin__block-tag admin__block-tag--${b.type}`}>{b.type}</span>
        ))}
        <p style={{ marginTop: 8 }}><strong>Doa:</strong> {khutbah.dua ? '✅' : '❌'}</p>
        <p><strong>Referensi:</strong> {khutbah.references?.length || 0} sumber</p>
      </div>
    </div>
  );
}
