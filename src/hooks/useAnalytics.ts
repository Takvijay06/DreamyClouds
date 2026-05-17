import { useCallback } from 'react';
import {
  trackEvent,
  trackException,
  trackNamedEvent,
  trackPageView,
  trackUserJourneyFunnel
} from '../services/analytics';
import type { AnalyticsEventName } from '../constants/analyticsEvents';

/**
 * Stable analytics callbacks for components; delegates to the centralized service (no PII).
 */
export const useAnalytics = () => {
  const trackPage = useCallback((path: string, title?: string) => {
    trackPageView(path, title);
  }, []);

  const trackUserEvent = useCallback((eventName: AnalyticsEventName | string, params?: Record<string, unknown>) => {
    trackNamedEvent(eventName, params);
  }, []);

  const trackError = useCallback((error: unknown, context?: string) => {
    trackException(error, false, context);
  }, []);

  return {
    trackPage,
    trackUserEvent,
    trackError,
    trackEvent,
    trackUserJourneyFunnel
  };
};
