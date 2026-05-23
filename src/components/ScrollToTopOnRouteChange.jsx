import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly jump to top when navigating to a new route
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
