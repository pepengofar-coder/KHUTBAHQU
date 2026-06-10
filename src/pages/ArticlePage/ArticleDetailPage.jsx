import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { getArticleBySlug } from '../../services/openArticleApi';
import { OPEN_ARTICLE_SOURCES, LEGAL_DISCLAIMER } from '../../data/openArticleSources';
import { ARTICLE_CATEGORIES } from '../../data/articleCategories';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import { ArrowLeft, Calendar, User, Scale, Bookmark, Share2 } from 'lucide-react';
import './ArticleDetailPage.css';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await getArticleBySlug(slug);
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  // Dynamic SEO Setup
  useSEO({
    title: article ? `${article.title} - Islamediaku` : 'Artikel Edukasi - Islamediaku',
    description: article ? article.summary : 'Baca artikel Islami berlisensi terbuka secara lengkap di Islamediaku.',
    path: `/artikel/${slug}`,
  });

  if (loading) {
    return (
      <div className="article-detail-page container py-12">
        <LoadingState message="Memuat konten artikel..." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-detail-page container py-12">
        <EmptyState
          title="Artikel Tidak Ditemukan"
          description="Konten artikel yang Anda cari tidak ada atau telah dipindahkan."
          icon={Bookmark}
          action={{
            label: 'Kembali ke Artikel',
            onClick: () => navigate('/artikel')
          }}
        />
      </div>
    );
  }

  const categoryObj = ARTICLE_CATEGORIES.find(c => c.id === article.category);
  const sourceObj = OPEN_ARTICLE_SOURCES.find(s => s.id === article.sourceId);

  return (
    <div className="article-detail-page container">
      {/* Back button */}
      <button 
        onClick={() => navigate('/artikel')} 
        className="back-btn flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Artikel</span>
      </button>

      <article className="article-content-wrapper bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-sm">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {categoryObj && (
            <span className="text-[10px] font-bold bg-[var(--color-primary-light)] text-[var(--color-primary)] px-2.5 py-1 rounded-md">
              {categoryObj.icon} {categoryObj.name}
            </span>
          )}
          <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
            <Calendar size={12} />
            {article.date}
          </span>
          <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
            <User size={12} />
            {article.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="article-detail-title text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Short Summary Box */}
        <p className="article-detail-summary text-sm italic text-[var(--color-text-muted)] border-l-4 border-[var(--color-primary)] pl-4 py-1.5 mb-8 leading-relaxed">
          {article.summary}
        </p>

        {/* Body Text */}
        <div className="article-detail-body text-sm md:text-base text-[var(--color-text-primary)] leading-relaxed whitespace-pre-line mb-8">
          {article.content}
        </div>

        {/* Legal Disclaimer block in detail page */}
        <div className="legal-disclaimer-detail-box p-4 rounded-2xl bg-[var(--color-bg-primary)] border border-[var(--color-border)] mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Scale size={16} className="text-[var(--color-primary)]" />
            <h4 className="text-xs font-bold text-[var(--color-text-primary)]">Komitmen Konten Legal</h4>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
            {LEGAL_DISCLAIMER}
          </p>
        </div>

        {/* Attribution Block */}
        <div className="article-attribution-block p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-[var(--color-text-primary)] mb-1">
              Atribusi & Hak Cipta Sumber
            </h4>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-normal max-w-xl">
              {article.attribution} Artikel ini dilisensikan di bawah lisensi terbuka{' '}
              <a 
                href={sourceObj?.licenseUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] font-semibold hover:underline"
              >
                {article.license}
              </a>.
            </p>
          </div>
          {sourceObj && (
            <a 
              href={sourceObj.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="source-badge-link px-3.5 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-xl text-[10px] font-bold text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all shrink-0 text-center"
            >
              Kunjungi {sourceObj.name}
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
