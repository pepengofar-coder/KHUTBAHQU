import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../utils/seo';
import { ARTICLE_CATEGORIES } from '../../data/articleCategories';
import { getOpenArticles } from '../../services/openArticleApi';
import { LEGAL_DISCLAIMER } from '../../data/openArticleSources';
import Card from '../../components/common/Card';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { Search, BookOpen, Scale, FileText } from 'lucide-react';
import './ArticlePage.css';

export default function ArticlePage() {
  useSEO({
    title: 'Artikel Edukasi Islami - Islamediaku',
    description: 'Kumpulan artikel edukasi Islami harian berlisensi terbuka, tepercaya, dan bebas dari hak cipta ilegal.',
    path: '/artikel',
  });

  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOpenArticles(searchQuery, selectedCategory);
      setArticles(data);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError('Gagal memuat artikel edukasi. Silakan periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="article-page container">
      {/* Header Section */}
      <header className="article-header">
        <span className="article-badge">EDUKASI</span>
        <h1 className="article-title">Artikel Islamediaku</h1>
        <p className="article-subtitle">
          Khazanah keilmuan Islam, sejarah, dan panduan ibadah harian dari sumber terbuka berlisensi resmi.
        </p>
      </header>

      {/* Legal Disclaimer Box */}
      <div className="legal-disclaimer-box">
        <Scale className="legal-disclaimer-icon text-[var(--color-primary)]" size={20} />
        <p className="legal-disclaimer-text">{LEGAL_DISCLAIMER}</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="article-filters flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="search-bar-wrapper flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
          <input
            type="text"
            placeholder="Cari artikel edukasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full pl-11 pr-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-scroll-container mb-8">
        <div className="category-tabs flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`category-tab-btn px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === ''
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]/80'
            }`}
          >
            Semua Kategori
          </button>
          {ARTICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-tab-btn px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid / State representation */}
      {loading ? (
        <LoadingState message="Mencari artikel edukasi terbaik..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchArticles} />
      ) : articles.length === 0 ? (
        <EmptyState
          title="Artikel Tidak Ditemukan"
          description="Cobalah cari dengan kata kunci lain atau pilih kategori yang berbeda."
          icon={BookOpen}
        />
      ) : (
        <div className="articles-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {articles.map((article) => {
            const categoryObj = ARTICLE_CATEGORIES.find((c) => c.id === article.category);
            return (
              <Card
                key={article.slug}
                onClick={() => navigate(`/artikel/${article.slug}`)}
                className="article-card flex flex-col justify-between"
                hoverable
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-[var(--color-primary-light)] text-[var(--color-primary)] px-2.5 py-1 rounded-md">
                      {categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : 'Edukasi'}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="article-card-title text-base font-bold text-[var(--color-text-primary)] mb-2 leading-snug hover:text-[var(--color-primary)] transition-colors">
                    {article.title}
                  </h3>
                  <p className="article-card-summary text-xs text-[var(--color-text-muted)] mb-5 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
                <div className="article-card-footer border-t border-[var(--color-border)] pt-4 mt-auto flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] font-medium">
                    <FileText size={12} />
                    <span>Sumber: <strong className="text-[var(--color-text-primary)]">{article.author}</strong></span>
                  </div>
                  <span className="px-2 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] font-medium">
                    {article.license}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
