import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { scheduleAnalyticsInit, trackPageView, trackScrollDepthMilestone } from '../services/analytics';

const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

/**
 * Deferred GA4 init, SPA page views (de-duplicated in service), and scroll-depth milestones per route.
 * Mount once inside `<BrowserRouter>`.
 */
export const AnalyticsListeners = () => {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    scheduleAnalyticsInit();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    if (path === lastPathRef.current) {
      return;
    }
    lastPathRef.current = path;
    trackPageView(path, document.title);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const pathKey = `${location.pathname}${location.search}`;
    const fired = new Set<number>();

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = doc.scrollHeight - window.innerHeight;
      if (height <= 0) {
        return;
      }
      const pct = Math.min(100, Math.round((scrollTop / height) * 100));
      for (const milestone of SCROLL_MILESTONES) {
        if (pct >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          trackScrollDepthMilestone(pathKey, milestone);
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, location.search]);

  return null;
};
