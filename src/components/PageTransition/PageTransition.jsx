import { useRef, useEffect } from 'react';
import './PageTransition.css';

export default function PageTransition({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reset animation on mount
    el.classList.remove('page-transition--enter');
    // Force reflow to restart animation
    void el.offsetWidth;
    el.classList.add('page-transition--enter');
  }, []);

  return (
    <div className="page-transition" ref={ref}>
      {children}
    </div>
  );
}
