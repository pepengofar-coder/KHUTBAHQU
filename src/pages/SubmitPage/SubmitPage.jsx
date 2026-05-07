import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { countWords } from '../../data/khutbahValidator';
import './SubmitPage.css';

export default function SubmitPage() {
  const { categories, addSubmission } = useApp();
  const [form, setForm] = useState({
    contributorName: '',
    contributorEmail: '',
    contributorWa: '',
    title: '',
    category: 'tauhid',
    summary: '',
    firstKhutbah: '',
    secondKhutbah: '',
    dua: '',
    references: '',
    agreement: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const words1 = form.firstKhutbah ? form.firstKhutbah.trim().split(/\s+/).length : 0;
  const words2 = form.secondKhutbah ? form.secondKhutbah.trim().split(/\s+/).length : 0;
  const totalWords = words1 + words2;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    if (!form.agreement) return "Anda harus menyetujui pernyataan persetujuan karya.";
    if (totalWords < 1200) return `Khutbah terlalu pendek (${totalWords} kata). Minimal 1.200 kata.`;
    if (!form.firstKhutbah || !form.secondKhutbah || !form.dua) return "Khutbah pertama, khutbah kedua, dan doa wajib diisi.";
    
    const content = (form.firstKhutbah + " " + form.secondKhutbah + " " + form.dua).toLowerCase();
    const badWords = ["saw", "swt", "ra", "as", "hr"];
    for (const bw of badWords) {
      if (new RegExp(`\\b${bw}\\b`).test(content)) return `Jangan gunakan singkatan "${bw.toUpperCase()}". Gunakan bentuk lengkap.`;
    }
    
    const placeholders = ["todo", "lorem ipsum", "isi khutbah di sini", "doa penutup di sini"];
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
      contributorWa: form.contributorWa,
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
    setForm({ ...form, title: '', summary: '', firstKhutbah: '', secondKhutbah: '', dua: '', references: '', agreement: false });
  };

  if (success) {
    return (
      <div className="submit-page container">
        <div className="submit-success">
          <h3>🎉 Alhamdulillah, Khutbah Berhasil Dikirim!</h3>
          <p>Terima kasih atas kontribusi Anda. Khutbah Anda saat ini berstatus <strong>Menunggu Review</strong>.</p>
          <p>Tim admin kami akan meninjau naskah Anda sebelum diterbitkan di KhutbahQu.</p>
          <br/>
          <button className="btn btn--primary" onClick={() => setSuccess(false)}>Kirim Khutbah Lainnya</button>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page container">
      <div className="submit-page__header">
        <h1>Kirim Kontribusi Khutbah</h1>
        <p>Bagikan ilmu dan pahala jariyah dengan mengirimkan naskah khutbah Anda.</p>
      </div>

      <form className="submit-form" onSubmit={handleSubmit}>
        {error && <div className="submit-error"><strong>⚠️ Gagal:</strong> {error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>Nama Pembuat / Kontributor *</label>
            <input required type="text" name="contributorName" value={form.contributorName} onChange={handleChange} className="form-control" placeholder="Nama Lengkap" />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input required type="email" name="contributorEmail" value={form.contributorEmail} onChange={handleChange} className="form-control" placeholder="Email Anda (tidak dipublikasikan)" />
          </div>
        </div>
        
        <div className="form-group">
          <label>Nomor WhatsApp (Opsional)</label>
          <input type="text" name="contributorWa" value={form.contributorWa} onChange={handleChange} className="form-control" placeholder="Contoh: 08123456789" />
        </div>

        <hr style={{margin: '2rem 0', borderColor: 'var(--color-border)'}} />

        <div className="form-group">
          <label>Judul Khutbah *</label>
          <input required type="text" name="title" value={form.title} onChange={handleChange} className="form-control" placeholder="Judul menarik dan representatif" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Kategori Tema *</label>
            <select required name="category" value={form.category} onChange={handleChange} className="form-control">
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            {form.category === 'bidah' && <p className="form-help" style={{color: 'orange'}}>Tema Maulid tidak diizinkan tampil sebagai konten publik.</p>}
          </div>
        </div>

        <div className="form-group">
          <label>Ringkasan Khutbah *</label>
          <textarea required name="summary" value={form.summary} onChange={handleChange} className="form-control" rows="3" placeholder="Tuliskan 1-2 kalimat ringkasan inti dari khutbah ini."></textarea>
        </div>

        <div className="form-group">
          <label>Isi Khutbah Pertama *</label>
          <p className="form-help" style={{marginBottom: 8}}>Muqaddimah bahasa Arab akan otomatis ditambahkan oleh sistem. Langsung tuliskan Wasiat Takwa dan Isi Khutbah.</p>
          <textarea required name="firstKhutbah" value={form.firstKhutbah} onChange={handleChange} className="form-control" rows="12" placeholder="Jamaah shalat Jumat yang dirahmati Allah..."></textarea>
        </div>

        <div className="form-group">
          <label>Isi Khutbah Kedua *</label>
          <p className="form-help" style={{marginBottom: 8}}>Muqaddimah khutbah kedua bahasa Arab akan otomatis ditambahkan. Langsung tuliskan isi khutbah kedua.</p>
          <textarea required name="secondKhutbah" value={form.secondKhutbah} onChange={handleChange} className="form-control" rows="8" placeholder="Jamaah shalat Jumat yang dirahmati Allah..."></textarea>
        </div>

        <div className="form-group">
          <label>Doa Penutup *</label>
          <p className="form-help" style={{marginBottom: 8}}>Sertakan doa penutup dengan format lengkap (Bahasa Arab & terjemahan opsional).</p>
          <textarea required name="dua" value={form.dua} onChange={handleChange} className="form-control" rows="5" placeholder="Allahummaghfir lil muslimina wal muslimat..."></textarea>
          <span className={`word-count ${totalWords >= 1200 ? 'valid' : 'invalid'}`}>
            Total Panjang: {totalWords} kata (Minimal 1.200)
          </span>
        </div>

        <div className="form-group">
          <label>Referensi Dalil (Opsional tapi disarankan)</label>
          <textarea name="references" value={form.references} onChange={handleChange} className="form-control" rows="3" placeholder="QS. Al-Baqarah: 183&#10;HR. Bukhari dan Muslim"></textarea>
          <p className="form-help">Satu referensi per baris.</p>
        </div>

        <div className="form-checkbox">
          <input required type="checkbox" id="agreement" name="agreement" checked={form.agreement} onChange={handleChange} />
          <label htmlFor="agreement">
            Saya menyatakan bahwa naskah khutbah ini adalah karya saya sendiri, bebas dari unsur plagiarisme, dan saya memberikan izin kepada KhutbahQu untuk menerbitkannya (admin berhak mengedit sebelum dipublish).
          </label>
        </div>

        <button type="submit" className="btn btn--primary" style={{width: '100%', padding: '1rem', fontSize: '1.1rem'}}>
          Kirim Naskah Khutbah
        </button>
      </form>
    </div>
  );
}
