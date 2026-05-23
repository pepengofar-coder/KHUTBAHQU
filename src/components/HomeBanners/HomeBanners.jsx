import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { defaultHomeBanners } from '../../data/homeBanners';
import './HomeBanners.css';

export default function HomeBanners() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // 1. Try to load from localStorage admin mock
    const adminData = localStorage.getItem('islamediaku_admin_home_banners');
    let loadedBanners = [];
    
    if (adminData) {
      try {
        const parsed = JSON.parse(adminData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedBanners = parsed;
        }
      } catch (e) {
        console.warn('Failed to parse admin banners from localStorage', e);
      }
    }

    // 2. Fallback to default
    if (loadedBanners.length === 0) {
      loadedBanners = defaultHomeBanners;
    }

    // Filter active, sort, and limit to 3
    const activeBanners = loadedBanners
      .filter(b => b.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .slice(0, 3);

    setBanners(activeBanners);
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className="home-banners-section">
      <div className="home-banners-header">
        <h2 className="home-banners-title">Pilihan Hari Ini</h2>
      </div>
      
      <div className="home-banners-container">
        {banners.map((banner) => {
          const isExternal = banner.ctaHref.startsWith('http');
          
          const cardContent = (
            <>
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.title} className="home-banner__image" loading="lazy" />
              ) : null}
              <div className="home-banner__overlay" />
              <div className="home-banner__content">
                <h3 className="home-banner__title">{banner.title}</h3>
                {banner.subtitle && <p className="home-banner__subtitle">{banner.subtitle}</p>}
                {banner.ctaLabel && (
                  <span className="home-banner__cta">
                    {banner.ctaLabel} <ChevronRight size={14} />
                  </span>
                )}
              </div>
            </>
          );

          if (isExternal) {
            return (
              <a key={banner.id} href={banner.ctaHref} className="home-banner-card" target="_blank" rel="noopener noreferrer">
                {cardContent}
              </a>
            );
          }

          return (
            <Link key={banner.id} to={banner.ctaHref} className="home-banner-card">
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
