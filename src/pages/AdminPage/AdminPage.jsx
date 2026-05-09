import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { validateKhutbah, countWords, estimateReadingDuration, detectDuplicates } from '../../data/khutbahValidator';
import { ALL_SOURCES, SUGGESTED_THEMES, STATUS_LABELS } from '../../data/khutbahSources';
import './AdminPage.css';

// ── Login Screen ─────────────────────────────────────────────
function LoginScreen() {
  const { adminLogin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = adminLogin(username, password);
    if (!ok) setError('Username atau password salah.');
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">🕌</div>
        <h1 className="admin-login__title">KhutbahQu Admin</h1>
        <p className="admin-login__subtitle">Masuk untuk mengelola konten khutbah</p>
        <form onSubmit={handleSubmit} className="admin-login__form">
          {error && <div className="admin-login__error">⚠️ {error}</div>}
          <div className="admin-login__field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required autoFocus />
          </div>
          <div className="admin-login__field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          </div>
          <button type="submit" className="admin-login__btn" disabled={loading}>
            {loading ? '⏳ Memverifikasi...' : '🔐 Masuk Panel Admin'}
          </button>
        </form>
        <p className="admin-login__back"><a href="/">← Kembali ke KhutbahQu</a></p>
      </div>
    </div>
  );
}

// ── Add Khutbah Form ─────────────────────────────────────────
function AddKhutbahForm({ categories, onAdd, onCancel }) {
  const [form, setForm] = useState({
    title: '', category: 'tauhid', summary: '', firstKhutbah: '', secondKhutbah: '', dua: '', references: ''
  });
  const [msg, setMsg] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title || !form.firstKhutbah || !form.secondKhutbah || !form.dua) {
      setMsg('❌ Judul, Khutbah 1, Khutbah 2, dan Doa wajib diisi.');
      return;
    }
    const parseBlocks = text => text.split('\n\n').filter(p => p.trim()).map(p => ({ type: 'paragraph', text: p.trim() }));
    const refs = form.references.split('\n').map(r => r.trim()).filter(Boolean);
    onAdd({
      title: form.title,
      category: form.category,
      summary: form.summary,
      firstKhutbah: parseBlocks(form.firstKhutbah),
      secondKhutbah: parseBlocks(form.secondKhutbah),
      dua: form.dua,
      references: refs,
    });
  };

  return (
    <div className="admin-add-form">
      <h3>➕ Tambah Khutbah Baru</h3>
      {msg && <div className="admin__alert admin__alert--warning">{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="admin-add-form__row">
          <div className="admin-add-form__group">
            <label>Judul *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Judul khutbah..." required />
          </div>
          <div className="admin-add-form__group">
            <label>Kategori *</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="admin-add-form__group">
          <label>Ringkasan</label>
          <textarea name="summary" value={form.summary} onChange={handleChange} rows="2" placeholder="Ringkasan singkat khutbah..." />
        </div>
        <div className="admin-add-form__group">
          <label>Isi Khutbah Pertama * <small>(pisah paragraf dengan baris kosong)</small></label>
          <textarea name="firstKhutbah" value={form.firstKhutbah} onChange={handleChange} rows="10" placeholder="Jamaah shalat Jumat yang dirahmati Allah..." required />
        </div>
        <div className="admin-add-form__group">
          <label>Isi Khutbah Kedua *</label>
          <textarea name="secondKhutbah" value={form.secondKhutbah} onChange={handleChange} rows="7" placeholder="Isi khutbah kedua..." required />
        </div>
        <div className="admin-add-form__group">
          <label>Doa Penutup *</label>
          <textarea name="dua" value={form.dua} onChange={handleChange} rows="4" placeholder="Allahummaghfir lil muslimina wal muslimat..." required />
        </div>
        <div className="admin-add-form__group">
          <label>Referensi Dalil <small>(satu per baris)</small></label>
          <textarea name="references" value={form.references} onChange={handleChange} rows="3" placeholder="QS. Al-Baqarah: 183&#10;HR. Bukhari dan Muslim" />
        </div>
        <div className="admin-add-form__actions">
          <button type="submit" className="btn btn--primary">✅ Simpan & Publish</button>
          <button type="button" className="btn btn--ghost" onClick={onCancel}>Batal</button>
        </div>
      </form>
    </div>
  );
}

// ── Submission Detail ─────────────────────────────────────────
function SubmissionDetail({ khutbah, onApprove, onReject, onClose }) {
  const words = khutbah.firstKhutbah
    ? khutbah.firstKhutbah.reduce((s, b) => s + (b.text ? b.text.split(/\s+/).length : 0), 0) +
      (khutbah.secondKhutbah || []).reduce((s, b) => s + (b.text ? b.text.split(/\s+/).length : 0), 0)
    : 0;

  const socialEntries = khutbah.socialMedia
    ? Object.entries(khutbah.socialMedia).filter(([, v]) => v)
    : [];

  return (
    <div className="admin__modal-overlay" onClick={onClose}>
      <div className="admin__modal" onClick={e => e.stopPropagation()}>
        <div className="admin__modal-header">
          <h3>{khutbah.title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="admin__modal-body">
          <div className="admin__alert admin__alert--info" style={{ marginBottom: 16 }}>
            <strong>👤 Pengirim:</strong> {khutbah.contributorName} — {khutbah.contributorEmail}
          </div>
          {socialEntries.length > 0 && (
            <div className="admin__social-list">
              <strong>📱 Media Sosial:</strong>
              <div className="admin__social-tags">
                {socialEntries.map(([k, v]) => (
                  <span key={k} className="admin__social-tag">
                    {k === 'instagram' ? '📸' : k === 'facebook' ? '👤' : k === 'whatsapp' ? '💬' : k === 'twitter' ? '🐦' : k === 'youtube' ? '▶️' : '🎵'}
                    {' '}{k}: {v}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="admin__detail-grid" style={{ marginTop: 16 }}>
            <div><strong>Kategori:</strong> {khutbah.category}</div>
            <div><strong>Total Kata:</strong> {words}</div>
            <div><strong>Dikirim:</strong> {khutbah.createdAt}</div>
            <div><strong>Status:</strong> {khutbah.status}</div>
          </div>
          {khutbah.summary && <p style={{ marginTop: 12, color: 'var(--color-text-secondary)' }}><em>{khutbah.summary}</em></p>}
          <div className="admin__actions" style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button className="btn btn--primary" onClick={onApprove}>✅ Approve & Publish</button>
            <button className="btn btn--ghost" style={{ color: 'red', borderColor: 'red' }} onClick={onReject}>❌ Reject</button>
            <button className="btn btn--ghost" style={{ marginLeft: 'auto' }} onClick={onClose}>Tutup</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────
export default function AdminPage() {
  const { isAdminLoggedIn, adminLogout, adminKhutbah, updateKhutbah, deleteKhutbah, addAdminKhutbah, categories } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedKhutbah, setSelectedKhutbah] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  if (!isAdminLoggedIn) return <LoginScreen />;

  const pendingSubmissions = adminKhutbah.filter(k => k.status === 'review' && !k.isStatic);
  const khutbahWithStatus = adminKhutbah;

  const validationResults = useMemo(() =>
    khutbahWithStatus.map(k => ({ khutbah: k, validation: validateKhutbah(k) }))
  , [khutbahWithStatus]);

  const duplicates = useMemo(() => detectDuplicates(khutbahWithStatus), [khutbahWithStatus]);

  const stats = useMemo(() => {
    const total = khutbahWithStatus.length;
    const published = khutbahWithStatus.filter(k => k.status === 'published').length;
    const totalWords = khutbahWithStatus.reduce((s, k) => s + countWords(k), 0);
    const avgDuration = total ? Math.round(khutbahWithStatus.reduce((s, k) => s + estimateReadingDuration(k), 0) / total) : 0;
    const issues = validationResults.reduce((s, r) => s + r.validation.issues.length, 0);
    return { total, published, totalWords, avgDuration, issues };
  }, [khutbahWithStatus, validationResults]);

  const filtered = khutbahWithStatus.filter(k => {
    if (filterStatus !== 'all' && k.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return k.title.toLowerCase().includes(q) || k.slug?.includes(q) || k.category.includes(q);
    }
    return true;
  });

  const handleAddKhutbah = (data) => {
    addAdminKhutbah(data);
    setShowAddForm(false);
    setAddSuccess(`✅ Khutbah "${data.title}" berhasil ditambahkan dan dipublikasikan!`);
    setTimeout(() => setAddSuccess(''), 5000);
    setActiveTab('content');
  };

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'submissions', label: `📥 Kiriman User${pendingSubmissions.length > 0 ? ` (${pendingSubmissions.length})` : ''}` },
    { id: 'content', label: '📝 Konten' },
    { id: 'validation', label: '🔍 Validasi' },
    { id: 'sources', label: '📚 Sumber' },
    { id: 'themes', label: '💡 Tema' },
    { id: 'guide', label: '📖 Panduan' },
  ];

  return (
    <div className="admin container">
      <div className="admin__header">
        <div>
          <h1>📋 Admin Panel — KhutbahQu</h1>
          <p className="admin__subtitle">Kelola, validasi, dan monitor materi khutbah</p>
        </div>
        <div className="admin__header-actions">
          <button className="btn btn--primary btn--sm" onClick={() => { setShowAddForm(true); setActiveTab('add'); }}>
            ➕ Tambah Khutbah
          </button>
          <button className="btn btn--ghost btn--sm" onClick={adminLogout}>🚪 Logout</button>
        </div>
      </div>

      {addSuccess && <div className="admin__alert admin__alert--success">{addSuccess}</div>}

      <div className="admin__tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`admin__tab ${activeTab === tab.id ? 'admin__tab--active' : ''} ${tab.id === 'submissions' && pendingSubmissions.length > 0 ? 'admin__tab--badge' : ''}`}
            onClick={() => { setActiveTab(tab.id); setShowAddForm(false); }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Add Form Tab */}
      {activeTab === 'add' && (
        <div className="admin__section">
          <AddKhutbahForm categories={categories} onAdd={handleAddKhutbah} onCancel={() => setActiveTab('content')} />
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'submissions' && (
        <div className="admin__section">
          <h3>📥 Kiriman Khutbah dari User</h3>
          {pendingSubmissions.length === 0 ? (
            <div className="admin__empty">
              <p>🎉 Tidak ada kiriman yang menunggu review saat ini.</p>
            </div>
          ) : (
            <div className="admin__submission-list">
              {pendingSubmissions.map(k => {
                const socials = k.socialMedia ? Object.entries(k.socialMedia).filter(([, v]) => v) : [];
                return (
                  <div key={k.id} className="admin__submission-card">
                    <div className="admin__submission-meta">
                      <span className="admin__submission-name">👤 {k.contributorName}</span>
                      <span className="admin__submission-date">📅 {k.createdAt}</span>
                      <span className="badge badge--primary">{k.category}</span>
                    </div>
                    <h4 className="admin__submission-title">{k.title}</h4>
                    {k.summary && <p className="admin__submission-summary">{k.summary}</p>}
                    {socials.length > 0 && (
                      <div className="admin__social-tags" style={{ marginTop: 8 }}>
                        {socials.map(([pl, val]) => (
                          <span key={pl} className="admin__social-tag">
                            {pl === 'instagram' ? '📸' : pl === 'facebook' ? '👤' : pl === 'whatsapp' ? '💬' : pl === 'twitter' ? '🐦' : pl === 'youtube' ? '▶️' : '🎵'}
                            {' '}{pl}: {val}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="admin__submission-actions">
                      <button className="btn btn--sm btn--ghost" onClick={() => setSelectedSubmission(k)}>👁 Detail</button>
                      <button className="btn btn--sm btn--primary" onClick={() => { updateKhutbah(k.id, { status: 'published' }); }}>
                        ✅ Approve
                      </button>
                      <button className="btn btn--sm btn--ghost" style={{ color: 'red' }} onClick={() => { if (confirm('Yakin reject kiriman ini?')) deleteKhutbah(k.id); }}>
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedSubmission && (
            <SubmissionDetail
              khutbah={selectedSubmission}
              onApprove={() => { updateKhutbah(selectedSubmission.id, { status: 'published' }); setSelectedSubmission(null); }}
              onReject={() => { if (confirm('Yakin reject?')) { deleteKhutbah(selectedSubmission.id); setSelectedSubmission(null); } }}
              onClose={() => setSelectedSubmission(null)}
            />
          )}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin__section">
          <div className="admin__stats">
            <div className="admin__stat-card"><span className="admin__stat-num">{stats.total}</span><span className="admin__stat-label">Total Khutbah</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num">{stats.published}</span><span className="admin__stat-label">Published</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num">{pendingSubmissions.length}</span><span className="admin__stat-label">Menunggu Review</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num">{stats.totalWords.toLocaleString()}</span><span className="admin__stat-label">Total Kata</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num">±{stats.avgDuration} mnt</span><span className="admin__stat-label">Rata-rata Durasi</span></div>
            <div className="admin__stat-card"><span className="admin__stat-num" style={{ color: stats.issues > 0 ? '#D97706' : '#059669' }}>{stats.issues}</span><span className="admin__stat-label">Issues</span></div>
          </div>
          {duplicates.length > 0 && (
            <div className="admin__alert admin__alert--warning">
              <strong>⚠️ Duplikasi Terdeteksi:</strong>
              {duplicates.map((d, i) => <p key={i}>{d.type === 'title' ? 'Judul' : 'Slug'} duplikat: "{d.value}"</p>)}
            </div>
          )}
          <h3>Ringkasan per Kategori</h3>
          <div className="admin__category-grid">
            {[...new Set(khutbahWithStatus.map(k => k.category))].map(cat => {
              const items = khutbahWithStatus.filter(k => k.category === cat);
              return (
                <div key={cat} className="admin__cat-card">
                  <strong>{cat}</strong><span>{items.length} khutbah</span>
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
            <input type="text" placeholder="🔍 Cari judul, slug, kategori..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="admin__search" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="admin__select">
              <option value="all">Semua Status</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <button className="btn btn--primary btn--sm" onClick={() => { setShowAddForm(true); setActiveTab('add'); }}>➕ Tambah</button>
          </div>
          <table className="admin__table">
            <thead><tr><th>ID</th><th>Judul</th><th>Kategori</th><th>Kata</th><th>Durasi</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {filtered.map(k => {
                const words = countWords(k);
                const dur = estimateReadingDuration(k);
                const st = STATUS_LABELS[k.status] || STATUS_LABELS.draft;
                return (
                  <tr key={k.id}>
                    <td>{k.id}</td>
                    <td><strong>{k.title}</strong><br /><small className="admin__slug">/{k.slug}</small></td>
                    <td><span className="badge badge--primary">{k.category}</span></td>
                    <td className={words < 800 ? 'admin__warn' : ''}>{words}</td>
                    <td>±{dur} mnt</td>
                    <td><span className="admin__status" style={{ background: st.color + '20', color: st.color }}>{st.icon} {st.label}</span></td>
                    <td>
                      {!k.isStatic && (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {k.status !== 'published' && <button className="btn btn--ghost btn--sm" onClick={() => updateKhutbah(k.id, { status: 'published' })}>✅</button>}
                          {k.status === 'published' && <button className="btn btn--ghost btn--sm" onClick={() => updateKhutbah(k.id, { status: 'draft' })}>⬇️</button>}
                          <button className="btn btn--ghost btn--sm" style={{ color: 'red' }} onClick={() => { if (confirm('Hapus?')) deleteKhutbah(k.id); }}>🗑</button>
                        </div>
                      )}
                      {k.isStatic && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Static</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
            <strong>ℹ️ Catatan:</strong> Sumber di bawah digunakan HANYA sebagai inspirasi. Konten TIDAK BOLEH disalin.
          </div>
          <h3>🇮🇩 Sumber Indonesia</h3>
          <div className="admin__source-grid">
            {ALL_SOURCES.filter(s => s.lang === 'id').map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="admin__source-card">
                <strong>{s.name}</strong><p>{s.focus}</p><small>{s.url}</small>
              </a>
            ))}
          </div>
          <h3>🌍 Sumber Internasional</h3>
          <div className="admin__source-grid">
            {ALL_SOURCES.filter(s => s.lang !== 'id').map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="admin__source-card">
                <strong>{s.name}</strong><p>{s.focus}</p><small>{s.url}</small>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Themes Tab */}
      {activeTab === 'themes' && (
        <div className="admin__section">
          <h3>💡 Bank Tema Khutbah</h3>
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
          <div className="admin__guide-step"><h4>1. Tambah Manual</h4><p>Klik tombol <strong>➕ Tambah Khutbah</strong> di header atau tab Konten untuk menambah naskah khutbah baru secara langsung.</p></div>
          <div className="admin__guide-step"><h4>2. Review Kiriman User</h4><p>Kiriman dari pengguna akan muncul di tab <strong>📥 Kiriman User</strong> dengan status "Menunggu Review". Klik Approve untuk mempublikasikan.</p></div>
          <div className="admin__guide-step"><h4>3. Aturan Konten</h4><ul><li>❌ JANGAN copy-paste dari website referensi</li><li>✅ Minimal 800 kata per khutbah</li><li>✅ Gunakan lafaz penghormatan lengkap (tanpa singkatan SAW, SWT, dll)</li><li>✅ Pastikan setiap khutbah unik</li></ul></div>
        </div>
      )}
    </div>
  );
}
