import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useSEO } from '../../utils/seo';
import './SubmitPage.css';

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: '@username_instagram' },
  { key: 'facebook', label: 'Facebook', icon: '👤', placeholder: 'facebook.com/username atau nama profil' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬', placeholder: '08xxxxxxxxxx' },
  { key: 'twitter', label: 'Twitter / X', icon: '🐦', placeholder: '@username' },
  { key: 'youtube', label: 'YouTube', icon: '▶️', placeholder: 'Link channel YouTube' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵', placeholder: '@username_tiktok' },
];

export default function SubmitPage() {
  const { categories, addSubmission } = useApp();

  useSEO({
    title: 'Kirim Naskah Khutbah — Kontribusi Materi Dakwah | Islamediaku',
    description: 'Kirimkan naskah khutbah Jumat, kultum, atau tausiyah Anda ke Islamediaku. Bagikan ilmu dan raih pahala jariyah dengan berkontribusi materi dakwah Islam.',
    path: '/kontribusi',
  });
  const [form, setForm] = useState({
    contributorName: '',
    contributorEmail: '',
    title: '',
    category: 'tauhid',
    summary: '',
    firstKhutbah: '',
    secondKhutbah: '',
    dua: '',
    references: '',
    agreement: false,
    socialMedia: {
      instagram: '',
      facebook: '',
      whatsapp: '',
      twitter: '',
      youtube: '',
      tiktok: '',
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const words1 = form.firstKhutbah ? form.firstKhutbah.trim().split(/\s+/).length : 0;
  const words2 = form.secondKhutbah ? form.secondKhutbah.trim().split(/\s+/).length : 0;
  const totalWords = words1 + words2;

  const hasSocialMedia = Object.values(form.socialMedia).some(v => v.trim() !== '');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSocialChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, socialMedia: { ...p.socialMedia, [name]: value } }));
  };

  const validate = () => {
    if (!form.contributorName.trim()) return 'Nama pengirim wajib diisi.';
    if (!form.contributorEmail.trim()) return 'Email wajib diisi.';
    if (!hasSocialMedia) return 'Wajib mengisi minimal satu akun media sosial.';
    if (!form.title.trim()) return 'Judul khutbah wajib diisi.';
    if (!form.summary.trim()) return 'Ringkasan khutbah wajib diisi.';
    if (totalWords < 1200) return `Khutbah terlalu pendek (${totalWords} kata). Minimal 1.200 kata.`;
    if (!form.firstKhutbah || !form.secondKhutbah || !form.dua) return 'Khutbah pertama, khutbah kedua, dan doa wajib diisi.';
    if (!form.agreement) return 'Anda harus menyetujui pernyataan persetujuan karya.';

    const content = (form.firstKhutbah + ' ' + form.secondKhutbah + ' ' + form.dua).toLowerCase();
    const badWords = ['saw', 'swt', 'ra', 'as', 'hr'];
    for (const bw of badWords) {
      if (new RegExp(`\\b${bw}\\b`).test(content)) return `Jangan gunakan singkatan "${bw.toUpperCase()}". Gunakan bentuk lengkap.`;
    }

    const placeholders = ['todo', 'lorem ipsum', 'isi khutbah di sini', 'doa penutup di sini'];
    for (const ph of placeholders) {
      if (content.includes(ph)) return `Teks mengandung placeholder dilarang: "${ph}".`;
    }

    return null;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError('');

    const valError = validate();
    if (valError) {
      setError(valError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const refs = form.references.split('\n').map(r => r.trim()).filter(Boolean);
    const parseBlocks = text => text.split('\n\n').filter(p => p.trim()).map(p => ({ type: 'paragraph', text: p.trim() }));

    const submission = {
      title: form.title,
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: form.category,
      summary: form.summary,
      contributorName: form.contributorName,
      contributorEmail: form.contributorEmail,
      socialMedia: form.socialMedia,
      type: 'khutbah-jumat',
      occasion: 'Jumat',
      duration: Math.round(totalWords / 130),
      firstKhutbah: parseBlocks(form.firstKhutbah),
      secondKhutbah: parseBlocks(form.secondKhutbah),
      dua: form.dua,
      references: refs,
      tags: [form.category]
    };

    addSubmission(submission);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (success) {
    return (
      <div className="submit-page container">
        <div className="submit-success">
          <div className="submit-success__icon">🎉</div>
          <h2>Alhamdulillah, Khutbah Berhasil Dikirim!</h2>
          <p>Terima kasih atas kontribusi Anda. Khutbah Anda saat ini berstatus <strong>Menunggu Review Admin</strong>.</p>
          <p>Tim admin kami akan meninjau naskah Anda sebelum diterbitkan di Islamediaku. Jazakallahu khairan.</p>
          <div className="submit-success__actions">
            <button className="btn btn--primary" onClick={() => setSuccess(false)}>Kirim Khutbah Lainnya</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page container">
      <div className="submit-page__header">
        <div className="submit-page__badge">Kontribusi Umat</div>
        <h1>📤 Kirim Naskah Khutbah</h1>
        <p>Bagikan ilmu dan raih pahala jariyah dengan mengirimkan naskah khutbah Anda. Setiap khutbah akan direview oleh admin sebelum diterbitkan.</p>
      </div>

      {/* Info Banner */}
      <div className="submit-info-banner">
        <div className="submit-info-banner__item">📝 Min. 1.200 kata</div>
        <div className="submit-info-banner__item">⏱️ Review dalam 1–3 hari</div>
        <div className="submit-info-banner__item">✅ Konten original</div>
        <div className="submit-info-banner__item">🌟 Pahala jariyah</div>
      </div>

      <form className="submit-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="submit-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Identitas Pengirim ── */}
        <div className="submit-section">
          <div className="submit-section__header">
            <h3>👤 Identitas Pengirim</h3>
            <p>Data pengirim tidak akan dipublikasikan secara terbuka</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Lengkap <span className="required">*</span></label>
              <input
                required
                type="text"
                name="contributorName"
                value={form.contributorName}
                onChange={handleChange}
                className="form-control"
                placeholder="Nama lengkap Anda"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input
                required
                type="email"
                name="contributorEmail"
                value={form.contributorEmail}
                onChange={handleChange}
                className="form-control"
                placeholder="email@contoh.com (tidak dipublikasikan)"
              />
            </div>
          </div>

          {/* Media Sosial */}
          <div className="form-group">
            <label className="form-label">
              Media Sosial <span className="required">*</span>
              <span className="form-label__note">Wajib minimal satu platform</span>
            </label>
            <div className="social-grid">
              {SOCIAL_PLATFORMS.map(platform => (
                <div key={platform.key} className={`social-item ${form.socialMedia[platform.key] ? 'social-item--filled' : ''}`}>
                  <div className="social-item__header">
                    <span className="social-item__icon">{platform.icon}</span>
                    <span className="social-item__label">{platform.label}</span>
                  </div>
                  <input
                    type="text"
                    name={platform.key}
                    value={form.socialMedia[platform.key]}
                    onChange={handleSocialChange}
                    className="form-control form-control--sm"
                    placeholder={platform.placeholder}
                  />
                </div>
              ))}
            </div>
            {!hasSocialMedia && (
              <p className="form-help form-help--warning">⚠️ Isi minimal satu media sosial untuk melanjutkan pengiriman.</p>
            )}
            {hasSocialMedia && (
              <p className="form-help form-help--success">✅ Media sosial sudah diisi.</p>
            )}
          </div>
        </div>

        {/* ── Detail Khutbah ── */}
        <div className="submit-section">
          <div className="submit-section__header">
            <h3>📖 Detail Khutbah</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Judul Khutbah <span className="required">*</span></label>
            <input
              required
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Judul yang menarik dan representatif"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kategori Tema <span className="required">*</span></label>
              <select
                required
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-control"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ringkasan Khutbah <span className="required">*</span></label>
            <textarea
              required
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Tuliskan 1-2 kalimat ringkasan inti dari khutbah ini."
            />
          </div>
        </div>

        {/* ── Naskah Khutbah ── */}
        <div className="submit-section">
          <div className="submit-section__header">
            <h3>✍️ Naskah Khutbah</h3>
            <p>Muqaddimah bahasa Arab akan otomatis ditambahkan oleh sistem</p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Isi Khutbah Pertama <span className="required">*</span>
            </label>
            <p className="form-help" style={{ marginBottom: 8 }}>
              Langsung tuliskan Wasiat Takwa dan Isi Khutbah (tanpa muqaddimah, sistem akan menambahkan otomatis).
            </p>
            <textarea
              required
              name="firstKhutbah"
              value={form.firstKhutbah}
              onChange={handleChange}
              className="form-control"
              rows="14"
              placeholder="Jamaah shalat Jumat yang dirahmati Allah Subhanahu wa Ta'ala..."
            />
            <span className="word-count">{words1} kata (khutbah 1)</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              Isi Khutbah Kedua <span className="required">*</span>
            </label>
            <textarea
              required
              name="secondKhutbah"
              value={form.secondKhutbah}
              onChange={handleChange}
              className="form-control"
              rows="9"
              placeholder="Jamaah shalat Jumat yang dirahmati Allah..."
            />
            <span className="word-count">{words2} kata (khutbah 2)</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              Doa Penutup <span className="required">*</span>
            </label>
            <textarea
              required
              name="dua"
              value={form.dua}
              onChange={handleChange}
              className="form-control"
              rows="5"
              placeholder="Allahummaghfir lil muslimina wal muslimat..."
            />
            <span className={`word-count word-count--total ${totalWords >= 1200 ? 'valid' : 'invalid'}`}>
              Total: {totalWords} kata {totalWords >= 1200 ? '✅' : `(kurang ${1200 - totalWords} kata)`}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Referensi Dalil <span className="form-label__note">Opsional tapi disarankan</span></label>
            <textarea
              name="references"
              value={form.references}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder={"QS. Al-Baqarah: 183\nHR. Bukhari dan Muslim"}
            />
            <p className="form-help">Satu referensi per baris.</p>
          </div>
        </div>

        {/* ── Persetujuan ── */}
        <div className="submit-agreement">
          <input
            required
            type="checkbox"
            id="agreement"
            name="agreement"
            checked={form.agreement}
            onChange={handleChange}
          />
          <label htmlFor="agreement">
            Saya menyatakan bahwa naskah khutbah ini adalah <strong>karya saya sendiri</strong>, bebas dari unsur plagiarisme, dan saya memberikan izin kepada Islamediaku untuk menerbitkannya (admin berhak mengedit sebelum dipublish).
          </label>
        </div>

        <button
          type="submit"
          className="btn btn--primary submit-btn"
          disabled={!hasSocialMedia}
        >
          {hasSocialMedia ? '📤 Kirim Naskah Khutbah' : '⚠️ Lengkapi Media Sosial Dulu'}
        </button>
      </form>
    </div>
  );
}
