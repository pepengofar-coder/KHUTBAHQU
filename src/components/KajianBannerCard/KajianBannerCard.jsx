import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabaseClient } from '../../lib/supabaseClient';
import { ImageIcon, ChevronRight } from 'lucide-react';
import './KajianBannerCard.css';

const FALLBACK_URL = '/mode-perjalanan';

export default function KajianBannerCard() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchBanner = async () => {
      if (!supabaseClient) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabaseClient
          .from('kajian_banners')
          .select('id, title, description, image_url, target_url')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error || !data) {
          if (mounted) setLoading(false);
          return;
        }

        if (mounted) {
          setBanner(data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('[KajianBannerCard] Failed to fetch banner:', err);
        if (mounted) setLoading(false);
      }
    };

    fetchBanner();
    return () => { mounted = false; };
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="kajian-banner kajian-banner--loading" aria-hidden="true">
        <div className="kajian-banner__image-wrap" />
        <div className="kajian-banner__body">
          <div className="kajian-banner__text">
            <p className="kajian-banner__title">Memuat info kajian...</p>
            <p className="kajian-banner__desc">Mohon tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  // No banner available
  if (!banner) {
    return (
      <div className="kajian-banner--empty">
        <ImageIcon size={32} className="kajian-banner__empty-icon" />
        <p>Info kajian belum tersedia.</p>
      </div>
    );
  }

  const targetUrl = banner.target_url || FALLBACK_URL;
  const isExternal = targetUrl.startsWith('http://') || targetUrl.startsWith('https://');

  const cardContent = (
    <>
      {banner.image_url && (
        <div className="kajian-banner__image-wrap">
          <img
            src={banner.image_url}
            alt={banner.title || 'Kajian Banner'}
            className="kajian-banner__image"
            loading="lazy"
          />
          <div className="kajian-banner__image-overlay" />
        </div>
      )}
      <div className="kajian-banner__body">
        <div className="kajian-banner__text">
          {banner.title && <h3 className="kajian-banner__title">{banner.title}</h3>}
          {banner.description && <p className="kajian-banner__desc">{banner.description}</p>}
        </div>
        <span className="kajian-banner__cta">
          Lihat Kajian <ChevronRight size={14} />
        </span>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={targetUrl}
        className="kajian-banner"
        target="_blank"
        rel="noopener noreferrer"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link to={targetUrl} className="kajian-banner">
      {cardContent}
    </Link>
  );
}
